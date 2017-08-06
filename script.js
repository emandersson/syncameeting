
http = require("http");
url = require("url");
path = require("path");
fs = require("fs");
mysql =  require('mysql');
util =  require('util');
concat = require('concat-stream');
requestMod = require('request');
through = require('through')
querystring = require('querystring');
async = require('async');
formidable = require("formidable");
crypto = require('crypto');
tls=require('tls');
childProcess = require('child_process');
zlib = require('zlib');
Fiber = require('fibers');
Future = require('fibers/future');
NodeZip=require('node-zip');
//redis = require("then-redis");
redis = require("redis");
ip = require('ip');
var argv = require('minimist')(process.argv.slice(2));
require('./lib.js');
require('./libServerGeneral.js');
require('./libServer.js');
//require('./store.js');



strAppName='syncameeting';
app=(typeof window==='undefined')?global:window;
extend=util._extend;


strInfrastructure=process.env.strInfrastructure||'local';
boHeroku=strInfrastructure=='heroku'; 
boAF=strInfrastructure=='af'; 
boLocal=strInfrastructure=='local'; 
boDO=strInfrastructure=='do'; 

StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'truncate']; // , 'createDummy', 'createDummies'

helpTextExit=function(){
  var arr=[];
  arr.push('USAGE script [OPTION]...');
  arr.push('  -h, --help          Display this text');
  arr.push('  -p, -port [PORT]    Port number (default: 5000)');
  arr.push('  --sql [SQL_ACTION]  Run a sql action.');
  arr.push('    SQL_ACTION='+StrValidSqlCalls.join('|'));
  console.log(arr.join('\n'));
  process.exit(0);
}


    // Set up redisClient
var urlRedis;
if(  (urlRedis=process.env.REDISTOGO_URL)  || (urlRedis=process.env.REDISCLOUD_URL)  ) {
  var objRedisUrl=url.parse(urlRedis),    password=objRedisUrl.auth.split(":")[1];
  var objConnect={host: objRedisUrl.hostname, port: objRedisUrl.port,  password: password};
  //redisClient=redis.createClient(objConnect); // , {no_ready_check: true}
  redisClient=redis.createClient(urlRedis, {no_ready_check: true}); //
}else {
  //var objConnect={host: 'localhost', port: 6379,  password: 'password'};
  redisClient=redis.createClient();
}



Fiber( function(){
  var fiber = Fiber.current;

    // Default config variables
  boDbg=0; boAllowSql=1; port=5000; levelMaintenance=0; googleSiteVerification='googleXXX.html';
  wwwCommon='';
  domainPayPal='www.paypal.com';
  urlPayPal='https://www.paypal.com/cgi-bin/webscr';
  intDDOSMax=100; tDDOSBan=5; 
  maxUnactivity=3600*24;

  port=argv.p||argv.port||5000;
  if(argv.h || argv.help) {helpTextExit(); return;}


  var strConfig;
  if(boHeroku){ 
    if(!process.env.jsConfig) { console.log('jsConfig-environment-variable is not set'); process.exit(1);}
    strConfig=process.env.jsConfig||'';
  }
  else{
    fs.readFile('./config.js', function(errT, bufT) { //, this.encRead
      if(errT){  console.log(errT); }
      strConfig=bufT.toString();
      fiber.run();
    });
    Fiber.yield();
    //require('./config.js');    //require('./config.example.js');
  } 
  var strMd5Config=md5(strConfig);
  eval(strConfig);
  var redisVar='str'+ucfirst(strAppName)+'Md5Config';
  var tmp=wrapRedisSendCommand('get',[redisVar]);
  var boNewConfig=strMd5Config!==tmp; 
  if(boNewConfig) { var tmp=wrapRedisSendCommand('set',[redisVar,strMd5Config]);  }

  if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;

  SiteName=Object.keys(Site);

  require('./variablesCommon.js');
  require('./libReqBE.js');
  require('./libReq.js'); 


  setUpMysqlPool();
  SiteExtend();


    // Do db-query if --sql XXXX was set in the argument
  if(typeof argv.sql!='undefined'){
    var tTmp=new Date().getTime();
    var objSetupSql=new SetupSql(); objSetupSql.doQuery(argv.sql);
    console.log('Time elapsed: '+(new Date().getTime()-tTmp)/1000+' s'); 
    process.exit(0);
  }

  tIndexMod=new Date(); tIndexMod.setMilliseconds(0);


  regexpLib=RegExp('^/(stylesheets|lib|lang|Site)/');
  regexpLooseJS=RegExp('^/(lib|libClient|client|siteSpecific)\\.js');
  //regexpImage=RegExp('^/[^/]*\\.(jpg|jpeg|gif|png|svg)$','i');


  CacheUri=new CacheUriT();
  StrFilePreCache=['lib.js', 'libClient.js', 'client.js', 'stylesheets/style.css','lang/en.js'];
  for(var i=0;i<StrFilePreCache.length;i++) {
    var filename=StrFilePreCache[i];
    var [err]=readFileToCache(filename); if(err) {  console.log(err.message);  return;}
  }
  createSiteSpecificClientJSAll();
  
  if(boDbg){
    fs.watch('.', makeWatchCB('.', ['client.js', 'libClient.js']) );
  }

  handler=function(req, res){
    var domainName=req.headers.host; 

    var cookies = parseCookies(req);
    var sessionID;  if('sessionID' in cookies) sessionID=cookies.sessionID; else { sessionID=randomHash();   res.setHeader("Set-Cookie", "sessionID="+sessionID+"; SameSite=Lax"); }  //+ " HttpOnly" 



    var ipClient=getIP(req);
    var redisVarSession=sessionID+'_Main';
    var redisVarCounter=sessionID+'_Counter', redisVarCounterIP=ipClient+'_Counter'; 
    //var tmp=redisClient.send('eval',[luaCountFunc, 3, redisVarSession, redisVarCounter, redisVarCounterIP, tDDOSBan]).then(function(intCount){
    var tmp=redisClient.send_command('eval',[luaCountFunc, 3, redisVarSession, redisVarCounter, redisVarCounterIP, tDDOSBan], function(err,intCount){
      //console.log(intCount);
      if(intCount>intDDOSMax) {res.outCode(429,"Too Many Requests, wait "+tDDOSBan+"s\n"); return; }



      var domainName=req.headers.host; 
      var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=querystring.parse(qs),  pathNameOrg=objUrl.pathname
      var wwwReq=domainName+pathNameOrg;
      var tmp=Site.getSite(wwwReq);  
      if(!tmp){ res.out404("404 Nothing at that url\n"); return; }
      var siteName=tmp.siteName, wwwSite=tmp.wwwSite, pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';


      if(pathName=='/index.php') { var tmp=objQS.page||''; res.out301('http://'+domainName+'/'+tmp); return; }

      if(boDbg) console.log(req.method+' '+pathName);
        
      var site=Site[siteName];

      if(boHeroku && site.boTLS && req.headers['x-forwarded-proto']!='https') {
        if(pathName=='/' && qs.length==0) {        res.out301('https://'+req.headers.host); return; }
        else { res.writeHead(400);  res.end('You must use https'); return; }
      }


      var strScheme='http'+(site.boTLS?'s':''),   strSchemeLong=strScheme+'://';
      var uDomain=strSchemeLong+domainName;
      var uSite=strSchemeLong+wwwSite;
      req.site=site;  req.sessionID=sessionID; req.qs=qs; req.objQS=objQS; req.siteName=siteName;  req.strSchemeLong=strSchemeLong;  req.wwwSite=wwwSite;  req.uSite=uSite;  req.pathName=pathName;   
      //var rootDomainT=RootDomain[site.strRootDomain];  req.app_id=rootDomainT.fb.id;   req.app_secret=rootDomainT.fb.secret;
      req.rootDomain=RootDomain[site.strRootDomain];

      Fiber( function(){
        if(pathName.substr(0,5)=='/sql/'){
          if(!boDbg && !boAllowSql){ res.out200('Set boAllowSql=1 (or boDbg=1) in the config.js-file');  return }
          var reqSql=new ReqSql(req, res),  objSetupSql=new SetupSql();
          req.pathNameWOPrefix=pathName.substr(5);
          if(req.pathNameWOPrefix=='zip'){       reqSql.createZip(objSetupSql);     }
          else {  reqSql.toBrowser(objSetupSql); }             
        }
        else {
          if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;}
          if(pathName=='/') { var reqIndex=new ReqIndex(req, res); reqIndex.go();   }
          else if(pathName=='/'+leafBE){  var reqBE=new ReqBE(req, res);  reqBE.go();    }
          //else if(pathName=='/'+leafAssign){  var reqAssign=new ReqAssign(req, res);    reqAssign.go();  }
          else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || pathName=='/conversion.html'){   var reqStatic=new ReqStatic(req, res);      reqStatic.go();   }
          else if(pathName=='/'+leafLogin){   
            var state=randomHash(); //CSRF protection
            var objT={state:state, IP:objQS.IP, fun:objQS.fun, caller:objQS.caller||"index"};
            var redisVar=req.sessionID+'_Login', tmp=wrapRedisSendCommand('set',[redisVar,JSON.stringify(objT)]);     var tmp=wrapRedisSendCommand('expire',[redisVar,300]);
            var uLoginBack=uDomain+"/"+leafLoginBack;
            var uTmp="http://www.facebook.com/v3.2/dialog/oauth?"+"client_id="+req.rootDomain.fb.id+"&redirect_uri="+encodeURIComponent(uLoginBack)+"&state="+state+'&display=popup';
            res.writeHead(302, {'Location': uTmp}); res.end();
          }
          else if(pathName=='/'+leafLoginBack){    var reqLoginBack=new ReqLoginBack(req, res);    reqLoginBack.go();    }
          else if(pathName=='/monitor.html'){  var reqMonitor=new ReqMonitor(req, res);      reqMonitor.go();  }
          else if(pathName=='/Sitemap.xml'){  var reqSiteMap=new ReqSiteMap(req, res);      reqSiteMap.go();  }
          //else if(pathName=='/robots.txt'){  var reqRobots=new ReqRobots(req, res);      reqRobots.go();  }
          else if(pathName=='/stat.html'){  var reqStat=new ReqStat(req, res);      reqStat.go();  }
          else if(pathName=='/createDumpCommand'){  var str=createDumpCommand(); res.out200(str);     }
          else if(pathName=='/debug'){    debugger;  res.end();}
          else if(pathName=='/'+googleSiteVerification) res.end('google-site-verification: '+googleSiteVerification);
          else {res.out404("404 Not Found\n"); return; }
        }
      }).run();
    });
  }
  http.createServer(handler).listen(parseInt(port, 10));

  console.log("Listening to port " + port);
}).run();
