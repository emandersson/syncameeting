
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
//async = require('async');
formidable = require("formidable");
crypto = require('crypto');
tls=require('tls');
childProcess = require('child_process');
zlib = require('zlib');
//Fiber = require('fibers');
//Future = require('fibers/future');
NodeZip=require('node-zip');
//redis = require("then-redis");
redis = require("redis");
ip = require('ip');
Streamify= require('streamify-string');
serialize = require('serialize-javascript');
var argv = require('minimist')(process.argv.slice(2));
app=(typeof window==='undefined')?global:window;
require('./lib.js');
require('./libServerGeneral.js');
require('./libServer.js');
//require('./store.js');



strAppName='syncameeting';
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


var StrCookiePropProt=["HttpOnly", "Path=/","max-age="+3600*24*30];
//if(boDO) { StrCookiePropProt.push("secure"); }
var StrCookiePropStrict=StrCookiePropProt.concat("SameSite=Strict"),   StrCookiePropLax=StrCookiePropProt.concat("SameSite=Lax"),   StrCookiePropNormal=StrCookiePropProt.concat();
strCookiePropStrict=";"+StrCookiePropStrict.join(';');  strCookiePropLax=";"+StrCookiePropLax.join(';');  strCookiePropNormal=";"+StrCookiePropNormal.join(';');


var flow=( function*(){

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
    if(!process.env.jsConfig) { console.error('jsConfig-environment-variable is not set'); return;} //process.exit(1);
    strConfig=process.env.jsConfig||'';
  }
  else{
    var err, buf; fs.readFile('./config.js', function(errT, bufT) { err=errT;  buf=bufT;  flow.next();  });  yield;     if(err) {console.error(err); return;}
    strConfig=buf.toString();
  } 
  var strMd5Config=md5(strConfig);
  eval(strConfig);
  var redisVar='str'+ucfirst(strAppName)+'Md5Config';
  var tmp=yield *getRedis(flow, redisVar);
  var boNewConfig=strMd5Config!==tmp; 
  if(boNewConfig) { var tmp=yield *setRedis(flow, redisVar, strMd5Config);  }

  if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;

  SiteName=Object.keys(Site);

  require('./variablesCommon.js');
  require('./libReqBE.js');
  require('./libReq.js'); 


  mysqlPool=setUpMysqlPool();
  SiteExtend();


    // Do db-query if --sql XXXX was set in the argument
  //if(typeof argv.sql!='undefined'){
    //var tTmp=new Date().getTime();
    //var objSetupSql=new SetupSql(); objSetupSql.doQuery(argv.sql);
    //console.log('Time elapsed: '+(new Date().getTime()-tTmp)/1000+' s'); 
    //process.exit(0);
  //}
    // Do db-query if --sql XXXX was set in the argument
  if(typeof argv.sql!='undefined'){
    if(typeof argv.sql!='string') {console.log('sql argument is not a string'); process.exit(-1); return; }
    var tTmp=new Date().getTime();
    var SetupSql=new SetupSqlT(); yield* SetupSql.doQuery(flow, argv.sql);
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
    var [err]=yield* readFileToCache(flow, filename); if(err) {  console.log(err.message);  return;}
  }
  yield* createSiteSpecificClientJSAll(flow);
  
  if(boDbg){
    fs.watch('.', makeWatchCB('.', ['client.js', 'libClient.js']) );
  }

  handler=function(req, res){
    req.flow=(function*(){
      
      //res.setHeader("X-Frame-Options", "deny");  // Deny for all (note: this header is removed for images (see reqMediaImage) (should also be removed for videos))
      res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");  // Deny for all (note: this header is removed in certain requests)
      res.setHeader("X-Content-Type-Options", "nosniff");  // Don't try to guess the mime-type (I prefer the rendering of the page to fail if the mime-type is wrong)
      //if(boDO) res.setHeader("Strict-Transport-Security", "max-age="+3600*24*365); // All future requests must be with https (forget this after a year)
      res.setHeader("Referrer-Policy", "origin");  //  Don't write the refer unless the request comes from the origin
      

      var domainName=req.headers.host; 
      var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=querystring.parse(qs),  pathNameOrg=objUrl.pathname;
      var wwwReq=domainName+pathNameOrg;
      var {siteName,wwwSite}=Site.getSite(wwwReq);  
      if(!siteName){ res.out404("404 Nothing at that url\n"); return; }
      var pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';
      var site=Site[siteName];
      
      if(boDbg) console.log(req.method+' '+pathName);

      if(boHeroku && site.boTLS && req.headers['x-forwarded-proto']!='https') {
        if(pathName=='/' && qs.length==0) {        res.out301('https://'+req.headers.host); return; }
        else { res.writeHead(400);  res.end('You must use https'); return; }
      }


      var cookies = parseCookies(req);
      req.cookies=cookies;

      req.boCookieNormalOK=req.boCookieLaxOK=req.boCookieStrictOK=false;
      
        // Check if a valid sessionID-cookie came in
      var boSessionCookieInInput='sessionIDNormal' in cookies, sessionID=null, redisVarSessionCache;
      if(boSessionCookieInInput) {
        sessionID=cookies.sessionIDNormal;  redisVarSessionCache=sessionID+'_Cache';
        var [err, tmp]=yield* cmdRedis(req.flow, 'EXISTS', redisVarSessionCache); req.boCookieNormalOK=tmp;
      } 
      
      if(req.boCookieNormalOK){
          // Check if Lax / Strict -cookies are OK
        req.boCookieLaxOK=('sessionIDLax' in cookies) && cookies.sessionIDLax===sessionID;
        req.boCookieStrictOK=('sessionIDStrict' in cookies) && cookies.sessionIDStrict===sessionID;
        var redisVarDDOSCounter=sessionID+'_Counter';
      }else{
        sessionID=randomHash();  redisVarSessionCache=sessionID+'_Cache';
        var ipClient=getIP(req), redisVarDDOSCounter=ipClient+'_Counter';
      }
      
        // Increase DDOS counter 
      var luaCountFunc=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
      var [err, intCount]=yield* cmdRedis(req.flow, 'EVAL',[luaCountFunc, 1, redisVarDDOSCounter, tDDOSBan]);
      
      
      res.setHeader("Set-Cookie", ["sessionIDNormal="+sessionID+strCookiePropNormal, "sessionIDLax="+sessionID+strCookiePropLax, "sessionIDStrict="+sessionID+strCookiePropStrict]);
       
        // Check if to many requests comes in a short time (DDOS)
      if(intCount>intDDOSMax) {res.outCode(429,"Too Many Requests ("+intCount+"), wait "+tDDOSBan+"s\n"); return; }
      
      
        // Refresh / create  redisVarSessionCache
      if(req.boCookieNormalOK){
        var luaCountFunc=`local c=redis.call('GET',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
        var [err, value]=yield* cmdRedis(req.flow, 'EVAL',[luaCountFunc, 1, redisVarSessionCache, maxUnactivity]); req.sessionCache=JSON.parse(value)
      } else { 
        yield* setRedis(req.flow, redisVarSessionCache, {}, maxUnactivity); 
        req.sessionCache={};
      }


        // Set mimetype if the extention is recognized
      var regexpExt=RegExp('\.([a-zA-Z0-9]+)$');
      var Match=pathName.match(regexpExt), strExt; if(Match) strExt=Match[1];
      if(strExt in MimeType) res.setHeader('Content-type', MimeType[strExt]);
      

      var strScheme='http'+(site.boTLS?'s':''),   strSchemeLong=strScheme+'://';
      var uDomain=strSchemeLong+domainName;
      var uSite=strSchemeLong+wwwSite;
      req.site=site;  req.sessionID=sessionID; req.qs=qs; req.objQS=objQS; req.siteName=siteName;  req.strSchemeLong=strSchemeLong;  req.wwwSite=wwwSite;  req.uSite=uSite;  req.pathName=pathName;   
      //var rootDomainT=RootDomain[site.strRootDomain];  req.app_id=rootDomainT.fb.id;   req.app_secret=rootDomainT.fb.secret;
      req.rootDomain=RootDomain[site.strRootDomain];

      var objReqRes={req:req, res:res};
      objReqRes.myMySql=new MyMySql(mysqlPool);
      if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;}
      if(pathName=='/') { yield* reqIndex.call(objReqRes);   }
      else if(pathName=='/'+leafBE){  var reqBE=new ReqBE(objReqRes);  yield* reqBE.go();    }
      //else if(pathName=='/'+leafAssign){  var reqAssign=new ReqAssign(req, res);    reqAssign.go();  }
      else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || pathName=='/conversion.html'){   yield* reqStatic.call(objReqRes);   }
      else if(pathName=='/'+leafLogin){   
        var state=randomHash(); //CSRF protection
        var objT={state:state, IP:objQS.IP, fun:objQS.fun, caller:objQS.caller||"index"};
        //var redisVar=req.sessionID+'_Login', tmp=wrapRedisSendCommand('set',[redisVar,JSON.stringify(objT)]);     var tmp=wrapRedisSendCommand('expire',[redisVar,300]);
        yield *setRedis(req.flow, req.sessionID+'_Login', objT, 300);
        var uLoginBack=uDomain+"/"+leafLoginBack;
        var uTmp="http://www.facebook.com/v3.2/dialog/oauth?"+"client_id="+req.rootDomain.fb.id+"&redirect_uri="+encodeURIComponent(uLoginBack)+"&state="+state+'&display=popup';
        res.writeHead(302, {'Location': uTmp}); res.end();
      }
      else if(pathName=='/'+leafLoginBack){    var reqLoginBack=new ReqLoginBack(objReqRes);    yield* reqLoginBack.go();    }
      else if(pathName=='/createDumpCommand'){  var str=createDumpCommand(); res.out200(str);     }
      else if(pathName=='/debug'){    debugger;  res.end();}
      else if(pathName=='/'+googleSiteVerification) res.end('google-site-verification: '+googleSiteVerification);
      else {res.out404("404 Not Found\n"); return; }
      objReqRes.myMySql.fin();
      
     
    
    })(); req.flow.next();
  }
  http.createServer(handler).listen(parseInt(port, 10));

  console.log("Listening to port " + port);
})(); flow.next();
