


mesOMake=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(str);
}}
mesEOMake=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  this.Str.push('E: '+err.syscal+' '+err.code);
  var str=this.Str.join(glue); this.res.end(str);	
}}
mesOMakeJSON=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(JSON.stringify(str));
}}
mesEOMakeJSON=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);
  var str=this.Str.join(glue); this.res.end(JSON.stringify(str));	
}}



"use strict"



/******************************************************************************
 * ReqIndex
 ******************************************************************************/
app.ReqIndex=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.Str=[];
}
app.ReqIndex.prototype.mes=function(str){ this.Str.push(str); }
app.ReqIndex.prototype.mesO=mesOMake('\n');
app.ReqIndex.prototype.mesEO=mesEOMake(', ');


app.ReqIndex.prototype.go=function() {
  var self=this, req=this.req, res=this.res;
  var siteName=req.siteName, site=req.site, uSite=req.uSite, wwwSite=req.wwwSite;
  var objQS=req.objQS;
  var idSchedule=null; if('idSchedule' in objQS) { idSchedule=objQS.idSchedule;}
  var codeSchedule=''; if('codeSchedule' in objQS) { codeSchedule=objQS.codeSchedule;}


  var requesterCacheTime=getRequesterTime(req.headers);

  res.setHeader("Cache-Control", "must-revalidate");  res.setHeader('Last-Modified',tIndexMod.toUTCString());

  if(requesterCacheTime && requesterCacheTime>=tIndexMod && 0) { res.statusCode=304; res.end(); return false;   } 
  res.statusCode=200;   
  
 
  var Str=[];
  Str.push('<!DOCTYPE html>\n\
<html xmlns="http://www.w3.org/1999/xhtml"\n\
      xmlns:og="http://ogp.me/ns#"\n\
      xmlns:fb="http://www.facebook.com/2008/fbml">');
  Str.push('<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');

  if(idSchedule!=null)  Str.push('<meta name="robots" content="noindex">');


  var ua=req.headers['user-agent']||''; ua=ua.toLowerCase();
  var boMSIE=RegExp('msie').test(ua), boAndroid=RegExp('android').test(ua), boFireFox=RegExp('firefox').test(ua), boIOS= RegExp('iPhone|iPad|iPod','i').test(ua);

  var tmpIcon=wwwIcon16; if('wwwIcon16' in site) tmpIcon=site.wwwIcon16;  var uIcon16=req.strSchemeLong+tmpIcon;
  var tmpIcon=wwwIcon114; if('wwwIcon114' in site) tmpIcon=site.wwwIcon114;  var uIcon114=req.strSchemeLong+tmpIcon;
  var tmpIcon=wwwIcon200; if('wwwIcon200' in site) tmpIcon=site.wwwIcon200;  var uIcon200=req.strSchemeLong+tmpIcon;
  Str.push('<link rel="icon" type="image/png" href="'+uIcon16+'" />');
  Str.push('<link rel="apple-touch-icon-precomposed" href="'+uIcon114+'"/>');





  var strTmp='';  //if(boAndroid && boFireFox) {  strTmp=", width=device-width'";}    
  Str.push("<meta name='viewport' id='viewportMy' content='initial-scale=1"+strTmp+"'/>");




  var strTitle='Free meeting synchronizer';
  var strH1=wwwSite;
  var strDescription='Free tool for synchronizing a meeting without any particular user commitment';
  var strKeywords='scheduler meeting-synchronizer free schedule synchronize sync calender meeting week day hour lecture';
  var strSummary="";



  Str.push('\
  <meta name="description" content="'+strDescription+'"/>\n\
  <meta name="keywords" content="'+strKeywords+'"/>\n\
  <link rel="canonical" href="'+uSite+'"/>\n');

  
  if(!boDbg) {
    Str.push('\
<meta property="og:title" content="'+wwwSite+'"/>\n\
<meta property="og:type" content="website" />\n\
<meta property="og:url" content="http://'+wwwSite+'"/>\n\
<meta property="og:image" content="'+uIcon200+'"/>\n\
<meta property="og:site_name" content="'+wwwSite+'"/>\n\
<meta property="fb:admins" content="100002646477985"/>\n\
<meta property="fb:app_id" content="'+req.rootDomain.fb.id+'"/>\n\
<meta property="og:description" content="'+strDescription+'"/>\n\
<meta property="og:locale:alternate" content="sv_se" />\n\
<meta property="og:locale:alternate" content="en_US" />\n');
  }


  var tmp='\
<script>\n\
  window.fbAsyncInit = function() {\n\
    FB.init({\n\
      appId      : "'+req.rootDomain.fb.id+'",\n\
      xfbml      : true,\n\
      version    : "v3.2"\n\
    });\n\
    FB.AppEvents.logPageView(); \n\
  };\n\
\n\
  (function(d, s, id){\n\
     var js, fjs = d.getElementsByTagName(s)[0];\n\
     if (d.getElementById(id)) {return;}\n\
     js = d.createElement(s); js.id = id;\n\
     js.src = "//connect.facebook.net/en_US/sdk.js";\n\
     fjs.parentNode.insertBefore(js, fjs);\n\
   }(document, "script", "facebook-jssdk"));\n\
</script>\n';
  Str.push(tmp);



  var uCommon=''; if(wwwCommon) uCommon=req.strSchemeLong+wwwCommon;
  var uJQuery='https://code.jquery.com/jquery-3.3.1.min.js';    if(boDbg) uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/jquery-3.3.1.min.js";
  Str.push('<script src="'+uJQuery+'" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>');
 
    // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes

    // Use normal vTmp on iOS (since I don't have any method of disabling cache on iOS devices (nor any debugging interface))
  var boDbgT=boDbg; if(boIOS) boDbgT=0;
    // Include stylesheets
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbgT) vTmp=0;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var uSite=req.strSchemeLong+wwwSite;
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbgT) vTmp=0;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'"></script>');

    // Include JS-files
  var StrTmp=['lib.js', 'libClient.js', 'client.js', 'lang/en.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbgT) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }




  var strTracker, tmpID=site.googleAnalyticsTrackingID||null;
  if(boDbg||!tmpID){strTracker="<script> ga=function(){};</script>";}else{ 
  strTracker="\n\
<script type=\"text/javascript\">\n\
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n\
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n\
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n\
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n\
  ga('create', '"+tmpID+"', 'auto');\n\
  ga('send', 'pageview');\n\
</script>\n";
  }
  Str.push(strTracker);

  Str.push("</head>");
  Str.push('<body style="visibility:hidden">');


  Str.push("<title>"+strTitle+"</title>\n<h1>"+strH1+"</h1>\n"+strSummary);

  Str.push("\n<script type=\"text/javascript\" language=\"JavaScript\" charset=\"UTF-8\">\n\
  \n\
boTLS="+JSON.stringify(site.boTLS)+";\n\
idSchedule="+JSON.stringify(idSchedule)+";\n\
codeSchedule="+JSON.stringify(codeSchedule)+";\n\
  </script>\n\
  </body>\n\
  </html>");


  var str=Str.join('\n');  res.end(str); // res.writeHead(200, "OK", {'Content-Type': 'text/html'}); 
   
}




/******************************************************************************
 * ReqStatic
 ******************************************************************************/
var ReqStatic=app.ReqStatic=function(req, res){
  this.req=req; this.res=res;  this.site=req.site; this.Str=[];
}
ReqStatic.prototype.go=function() {
  var self=this, req=this.req, res=this.res;
  var site=req.site, objQS=req.objQS, siteName=req.siteName, pathName=req.pathName;

  var fiber = Fiber.current; 
  var eTagIn=getETag(req.headers); //console.log(pathName); debugger
  var keyCache=pathName; if(pathName==='/'+leafSiteSpecific) keyCache=siteName+keyCache; 
  if(!(keyCache in CacheUri)){
    var filename=pathName.substr(1);
    var [err]=readFileToCache(filename);
    if(err) {
      if(err.code=='ENOENT') {res.out404(); return;}
      res.out500(err); return;
    }
  }
  var {buf, type, eTag, boZip, boUglify}=CacheUri[keyCache];
  if(eTag===eTagIn){ res.writeHead(304); res.end(); return; } 
  var mimeType=MimeType[type]; 
  if(typeof mimeType!='string') console.log('type: '+type+', mimeType: ', mimeType);
  if(typeof buf!='object' || !('length' in buf)) console.log('typeof buf: '+typeof buf);
  if(typeof eTag!='string') console.log('typeof eTag: '+eTag);
  var objHead={"Content-Type": mimeType, "Content-Length":buf.length, ETag: eTag, "Cache-Control":"public, max-age=31536000"};
  if(boZip) objHead["Content-Encoding"]='gzip';
  res.writeHead(200, objHead); // "Last-Modified": maxModTime.toUTCString(),
  res.write(buf); //, this.encWrite
  res.end();
}



/******************************************************************************
 * ReqLoginBack
 ******************************************************************************/
var ReqLoginBack=app.ReqLoginBack=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.mess=[];  this.Str=[];
}

ReqLoginBack.prototype.go=function(){
  var self=this, req=this.req, res=this.res, sessionID=req.sessionID, objQS=req.objQS;

  var redisVar=this.req.sessionID+'_Login', strTmp=wrapRedisSendCommand('get',[redisVar]);   this.sessionLogin=JSON.parse(strTmp);
  if(!this.sessionLogin) { res.out500('!sessionLogin');  return; }
  var strFun=this.sessionLogin.fun;

  getSessionMain.call(this);
  if(!this.sessionMain) { res.out500('!sessionMain');  return; } 
  var redisVar=this.req.sessionID+'_Main', tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);

  if(!this.sessionMain.userInfoFrDB){ this.sessionMain.userInfoFrDB=extend({},specialistDefault); setSessionMain.call(this);  }

  
  if('error' in objQS && objQS.error=='access_denied') {this.writeHtml(objQS.error); return}

  var fiber = Fiber.current;


    // getToken
  var code=req.objQS.code;
  var uLoginBack=req.uSite+"/"+leafLoginBack;

  if(req.objQS.state==this.sessionLogin.state) {
    var uToGetToken = "https://graph.facebook.com/v3.2/oauth/access_token?"+"client_id="+req.rootDomain.fb.id+"&redirect_uri="+encodeURIComponent(uLoginBack)+"&client_secret="+req.rootDomain.fb.secret+"&code="+code;
    var reqStream=requestMod.get(uToGetToken); 
    var semCB=0, semY=0, boDoExit=0, buf; 
    var myConcat=concat(function(bufT){
      buf=bufT;
      if(semY)fiber.run(); semCB=1;
    });
    reqStream.pipe(myConcat);
    if(!semCB){semY=1; Fiber.yield();}
    try{ var params=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e); return; }
    self.access_token=params.access_token;
    if('error' in params) { var tmp='Error when getting access token: '+params.error.message; console.log(tmp); res.out500(tmp); return; }
  }
  else {
    var tmp="The state does not match. You may be a victim of CSRF.";    res.out500(tmp); return
  }


  var  semCB=0, semY=0, boDoExit=0; 
  this.getGraph(function(err,res){
    if(err){  boDoExit=1; res.out500(err);  }
    if(semY)fiber.run(); semCB=1;
  });
  if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) return;




    // interpretGraph
  var objGraph=this.objGraph;  
  if('error' in objGraph) {console.log('Error accessing data from facebook: '+objGraph.error.type+' '+objGraph.error.message+'<br>'); return; }
  var IP='fb', idIP=objGraph.id, nameIP=objGraph.name;

  //if(!objGraph.verified) { var tmp="Your Facebook account is not verified. Try search internet for  \"How to verify Facebook account\".";  res.out500(tmp);   return; }

  if(typeof idIP=='undefined') {console.log("Error idIP is empty");}  else if(typeof nameIP=='undefined' ) {nameIP=idIP;}
  
  if('userInfoFrIP' in this.sessionMain){
    if(this.sessionMain.userInfoFrIP.IP!==IP || this.sessionMain.userInfoFrIP.idIP!==idIP){
      this.sessionMain.userInfoFrDB=extend({},specialistDefault);    
    }
  }
  this.sessionMain.userInfoFrIP={IP:IP,idIP:idIP,nameIP:nameIP};   setSessionMain.call(this);
  this.IP=IP;this.idIP=idIP;


    // setCSRFCode
  var CSRFCode=randomHash();
  var redisVar=this.req.sessionID+'_CSRFCode'+ucfirst(this.sessionLogin.caller);   wrapRedisSendCommand('set',[redisVar, CSRFCode]);    var tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
  this.CSRFCode=CSRFCode;


  this.writeHtml(null);
}


ReqLoginBack.prototype.getGraph=function(callback){
  var self=this, req=this.req, res=this.res;
  
    // With the access_token you can get the data about the user
  var uGraph = "https://graph.facebook.com/v3.2/me?access_token="+this.access_token+'&fields=id,name';  //  ,verified
  var reqStream=requestMod.get(uGraph);
  //var fTmp=thisChangedWArg(this.partC,this,null);
  var myConcat=concat(function(buf){
    var objGraph=JSON.parse(buf.toString());
    self.objGraph=objGraph;
    callback(null,'');
  });
  reqStream.pipe(myConcat);
}


ReqLoginBack.prototype.writeHtml=function(err, results){
  var self=this, req=this.req, res=this.res;
  
  var boOK=!Boolean(err);
  var strMess=this.mess.join(', ');
  //if(err){res.out500(err);  return; }
  if(err){
    console.log('err: '+err); //console.log('results: '+results); console.log('mess: '+strMess);  console.log(req.objQS); 
  }
  var uSite=req.strSchemeLong+req.wwwSite;
  
  var Str=this.Str;
  Str.push("\n\
<html><head><meta name='robots' content='noindex'>\n\
<link rel='canonical' href='"+uSite+"'/>\n\
</head>\n\
<body>\n\
<script>\n\
var boOK="+JSON.stringify(boOK)+";\n\
var strMess="+JSON.stringify(strMess)+";\n\
\n\
if(boOK){\n\
  var userInfoFrIPTT="+JSON.stringify(this.sessionMain.userInfoFrIP)+";\n\
  var userInfoFrDBTT="+JSON.stringify(this.sessionMain.userInfoFrDB)+";\n\
  var CSRFCodeTT="+JSON.stringify(this.CSRFCode)+";\n\
  var fun="+JSON.stringify(this.sessionLogin.fun)+";\n\
  window.opener.loginReturn(userInfoFrIPTT,userInfoFrDBTT,fun,strMess,CSRFCodeTT);\n\
  window.close();\n\
}\n\
else {\n\
//debugger\n\
  //alert('Login canceled: '+strMess);\n\
  window.close();\n\
}\n\
</script>\n\
</body>\n\
</html>\n\
");
  var str=Str.join('\n');  this.res.end(str);
}


  

/******************************************************************************
 * SetupSql
 ******************************************************************************/
app.SetupSql=function(){
}
app.SetupSql.prototype.createTable=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlTabDrop=[], SqlTab=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]
  var site=Site[siteName]; 
  var {TableName, ViewName}=site;
  var {scheduleTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));
 
  var StrTabName=object_values(TableName);
  var tmp=StrTabName.join(', ');
  SqlTabDrop.push("DROP TABLE IF EXISTS "+tmp);     
  SqlTabDrop.push('DROP TABLE IF EXISTS '+userTab);
  //var tmp=object_values(ViewName).join(', ');   if(tmp.length) SqlTabDrop.push("DROP VIEW IF EXISTS "+tmp+"");



  var collate="utf8_general_ci";

  var engine='INNODB';  //engine='MyISAM';
  var auto_increment=1;

  var strIPEnum="ENUM('"+Enum.IP.join("', '")+"')";



	  // Create users
  SqlTab.push("CREATE TABLE "+userTab+" ( \n\
  idUser INT(4) NOT NULL auto_increment, \n\
  IP "+strIPEnum+" CHARSET utf8 NOT NULL, \n\
  idIP VARCHAR(128) CHARSET utf8 NOT NULL DEFAULT '', \n\
  PRIMARY KEY (idUser), \n\
  UNIQUE KEY (IP,idIP) \n\
  ) AUTO_INCREMENT = "+auto_increment+", ENGINE="+engine+" COLLATE "+collate+""); 


	  // Create schedule
  SqlTab.push("CREATE TABLE "+scheduleTab+" ( \n\
  idSchedule INT(8) NOT NULL auto_increment, \n\
  idUser INT(4) NOT NULL, \n\
  codeSchedule VARCHAR(20) NOT NULL DEFAULT '', \n\
  title VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '', \n\
  MTab TEXT CHARSET utf8 NOT NULL, \n\
  unit ENUM('l', 'h', 'd', 'w') NOT NULL, \n\
  firstDayOfWeek INT(1) NOT NULL DEFAULT 1, \n\
  dateAlwaysInWOne INT(1) NOT NULL DEFAULT 4, \n\
  start TIMESTAMP DEFAULT 0, \n\
  vNames TEXT CHARSET utf8 NOT NULL, \n\
  hFilter VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '', \n\
  dFilter VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '', \n\
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \n\
  lastActivity TIMESTAMP DEFAULT 0, \n\
  PRIMARY KEY (idSchedule), \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE \n\
  ) AUTO_INCREMENT = "+auto_increment+", ENGINE="+engine+" COLLATE "+collate+""); 

  }
  if(boDropOnly) return SqlTabDrop;
  else return array_merge(SqlTabDrop, SqlTab);
}


app.SetupSql.prototype.createFunction=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlFunctionDrop=[], SqlFunction=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite];
  
  var site=Site[siteName]; 
  var {Prop, TableName, ViewName}=site;
  var {scheduleTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));

  var strIPEnum="ENUM('"+Enum.IP.join("', '")+"')";


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"save");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"save(IIP "+strIPEnum+", IidIP VARCHAR(128), IlastActivity INT(4), IidSchedule INT(8), IcodeSchedule VARCHAR(20), Ititle VARCHAR(128), IMTab TEXT, Iunit ENUM('l', 'h', 'd', 'w'), IfirstDayOfWeek INT(1), IdateAlwaysInWOne INT(1), Istart INT(4), IvNames TEXT, IhFilter VARCHAR(65), IdFilter VARCHAR(65)) \n\
      proc_label:BEGIN \n\
        DECLARE Vc, VboOld, VidUser INT; \n\
        #DECLARE Vnow TIMESTAMP; \n\
        IF ISNULL(IMTab) THEN SET IMTab=''; END IF;\n\
        IF ISNULL(IvNames) THEN SET IvNames=''; END IF;\n\
\n\
        IF ISNULL(IidSchedule) THEN \n\
          INSERT INTO "+userTab+" (IP,idIP) VALUES (IIP, IidIP) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser); \n\
          SET VidUser=LAST_INSERT_ID(); \n\
          SET IcodeSchedule=SUBSTR(RAND(), 3); \n\
          INSERT INTO "+scheduleTab+" (idUser,codeSchedule,lastActivity,MTab,vNames) VALUES (VidUser, IcodeSchedule, now(), '', ''); \n\
          SET IidSchedule=LAST_INSERT_ID(); \n\
        ELSE \n\
          SELECT UNIX_TIMESTAMP(lastActivity)>IlastActivity INTO VboOld FROM "+scheduleTab+" WHERE idSchedule=IidSchedule AND codeSchedule=IcodeSchedule; \n\
          SET Vc=ROW_COUNT(); \n\
          IF Vc!=1 THEN SELECT CONCAT('Got ', Vc, ' rows') AS mess;  LEAVE proc_label; END IF; \n\
          IF VboOld THEN SELECT 'boOld' AS mess;  LEAVE proc_label; END IF; \n\
        END IF; \n\
\n\
        #SET Vnow=now(); \n\
        UPDATE "+scheduleTab+" SET title=Ititle, MTab=IMTab, unit=Iunit, firstDayOfWeek=IfirstDayOfWeek, dateAlwaysInWOne=IdateAlwaysInWOne, start=FROM_UNIXTIME(Istart), vNames=IvNames, hFilter=IhFilter, dFilter=IdFilter, lastActivity=now() WHERE idSchedule=IidSchedule AND codeSchedule=IcodeSchedule; \n\
        SELECT ROW_COUNT() AS nUpd; \n\
        #SELECT UNIX_TIMESTAMP(Vnow) AS lastActivity, IidSchedule AS idSchedule, IcodeSchedule AS codeSchedule; \n\
        SELECT UNIX_TIMESTAMP(lastActivity) AS lastActivity, idSchedule, codeSchedule FROM "+scheduleTab+" WHERE idSchedule=IidSchedule; \n\
      END");
  // CALL syncameetingLsave('fb', '12345', 1.4e9, null, null, 'myTitle', 'abcdMTab', 'd', 0, 4, 1.4e9, 'abcnames', 'abchFilt', 'abcdfilt')
  // CALL syncameetingLsave('fb', '12345', 1.5e9, 1, '4885819884842094', 'myNTitle', 'abcdMTab', 'd', 0, 4, 1.4e9, 'abcnames', 'abchFilt', 'abcdfilt')
  // CALL syncameetingLdelete(1,1)

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"delete");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"delete(IIP "+strIPEnum+", IidIP VARCHAR(128), IidSchedule INT(8)) \n\
      proc_label:BEGIN \n\
        DECLARE Vc, VidUser INT; \n\
\n\
        SELECT idUser INTO VidUser FROM "+userTab+" WHERE IP=IIP AND idIP=IidIP;\n\
        SELECT ROW_COUNT() INTO Vc; \n\
        IF Vc!=1 THEN SELECT CONCAT(Vc, ' rows with that ID') AS err;  LEAVE proc_label; END IF; \n\
\n\
        DELETE FROM "+scheduleTab+"  WHERE idUser=VidUser AND idSchedule=IidSchedule; \n\
        SELECT ROW_COUNT() INTO Vc; \n\
        #IF Vc!=1 THEN SELECT CONCAT(Vc, ' rows deleted') AS err;  LEAVE proc_label; END IF; \n\
        SELECT Vc AS nDelete; \n\
  \n\
        SELECT COUNT(*) INTO Vc FROM "+scheduleTab+"  WHERE idUser=VidUser;\n\
        IF Vc=0 THEN \n\
          DELETE FROM "+userTab+"  WHERE idUser=VidUser; \n\
        END IF; \n\
      END");

  }
  var SqlA=this.funcGen(boDropOnly);
  if(boDropOnly) var SqlB=SqlFunctionDrop;
  else var SqlB=array_merge(SqlFunctionDrop, SqlFunction);
  return array_merge(SqlA, SqlB);
}


app.SetupSql.prototype.funcGen=function(boDropOnly){
  var SqlFunction=[], SqlFunctionDrop=[];
  if(boDropOnly) return SqlFunctionDrop;
  else return array_merge(SqlFunctionDrop, SqlFunction);
}
app.SetupSql.prototype.createDummies=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  var SqlDummies=[];
  return SqlDummies;
}
app.SetupSql.prototype.createDummy=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  var SqlDummy=[];
  return SqlDummy;
}

app.SetupSql.prototype.truncate=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlTableTruncate=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]
  var site=Site[siteName]; 

  var StrTabName=object_values(site.TableName);

  var SqlTmp=[];
  for(var i=0;i<StrTabName.length;i++){
    SqlTmp.push(StrTabName[i]+" WRITE");
  }
  var tmp="LOCK TABLES "+SqlTmp.join(', ');
  SqlTableTruncate.push(tmp);
  for(var i=0;i<StrTabName.length;i++){
    SqlTableTruncate.push("DELETE FROM "+StrTabName[i]);
    SqlTableTruncate.push("ALTER TABLE "+StrTabName[i]+" AUTO_INCREMENT = 1");
  }
  SqlTableTruncate.push('UNLOCK TABLES');
  }
  return SqlTableTruncate;
}

  // Called when --sql command line option is used
app.SetupSql.prototype.doQuery=function(strCreateSql){
  //var StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'truncate', 'createDummy', 'createDummies'];
  if(StrValidSqlCalls.indexOf(strCreateSql)==-1){var tmp=strCreateSql+' is not valid input, try any of these: '+StrValidSqlCalls.join(', '); console.log(tmp); return; }
  var Match=RegExp("^(drop|create)?(.*?)$").exec(strCreateSql);
  if(!Match) { debugger;  return; }
  
  var boDropOnly=false, strMeth=Match[2];
  if(Match[1]=='drop') { boDropOnly=true; strMeth='create'+strMeth;}
  else if(Match[1]=='create')  { strMeth='create'+strMeth; }

  var SqlA=this[strMeth](SiteName, boDropOnly); 
  var strDelim=';', sql=SqlA.join(strDelim+'\n')+strDelim, Val=[], boDoExit=0;  
  
  var fiber = Fiber.current;
  myQueryF(sql, Val, mysqlPool, function(err, results){ 
    var tmp=createMessTextOfMultQuery(SqlA, err, results);  console.log(tmp); 
    if(err){            boDoExit=1;  debugger;         } 
    fiber.run();
  });
  Fiber.yield();  if(boDoExit==1) return;

}



var createMessTextOfMultQuery=function(Sql, err, results){
  var nSql=Sql.length, nResults='na'; if(results instanceof Array) nResults=results.length;
  var StrMess=[];   StrMess.push('nSql='+nSql+', nResults='+nResults);
  if(err){
    StrMess.push('err.index: '+err.index+', err: '+err);
    if(nSql==nResults){
      var tmp=Sql.slice(bound(err.index-1,0,nSql), bound(err.index+2,0,nSql)),  sql=tmp.join('\n');
      StrMess.push('Since "Sql" and "results" seem correctly aligned (has the same size), then here, in the middle, is printed the query with the corresponding index (surounded by the preceding and following query to get a context):\n'+sql); 
    }
  }
  return StrMess.join('\n');
}


/******************************************************************************
 * ReqSql
 ******************************************************************************/
app.ReqSql=function(req, res){
  this.req=req; this.res=res;
  this.StrType=['table', 'fun', 'dropTable', 'dropFun', 'truncate', 'dummy', 'dummies']; 
}
app.ReqSql.prototype.createZip=function(objSetupSql){
  var res=this.res, StrType=this.StrType;

  var zipfile = new NodeZip();
  for(var i=0;i<StrType.length;i++) {
    var strType=StrType[i], SqlA;
    var Match=RegExp("^(drop)?(.*)$").exec(strType), boDropOnly=Match[1]=='drop';
    var SqlA=objSetupSql[Match[2].toLowerCase()](SiteName, boDropOnly);
    var strDelim=';;', sql='-- DELIMITER '+strDelim+'\n'      +SqlA.join(strDelim+'\n')+strDelim      +'\n-- DELIMITER ;\n';
    zipfile.file(strType+".sql", sql, {date:new Date(), compression:'DEFLATE'});
  }

  //var objArg={base64:false}; if(boCompress) objArg.compression='DEFLATE';
  var objArg={type:'string'}; //if(boCompress) objArg.compression='DEFLATE';
  var outdata = zipfile.generate(objArg);


  var outFileName=strAppName+'Setup.zip';
  var objHead={"Content-Type": 'application/zip', "Content-Length":outdata.length, 'Content-Disposition':'attachment; filename='+outFileName};
  res.writeHead(200,objHead);
  res.end(outdata,'binary');
}
ReqSql.prototype.toBrowser=function(objSetupSql){
  var req=this.req, res=this.res, StrType=this.StrType;
  var Match=RegExp("^(drop)?(.*?)(All)?$").exec(req.pathNameWOPrefix), boDropOnly=Match[1]=='drop', strMeth=Match[2].toLowerCase(), boAll=Match[3]=='All', SiteNameT=boAll?SiteName:[req.siteName];
  var StrValidMeth=['table', 'fun', 'truncate',  'dummy', 'dummies'];
  //var objTmp=Object.getPrototypeOf(objSetupSql);
  if(StrValidMeth.indexOf(strMeth)!=-1){
    var SqlA=objSetupSql[strMeth](SiteNameT, boDropOnly); 
    var strDelim=';;', sql='-- DELIMITER '+strDelim+'\n'      +SqlA.join(strDelim+'\n')+strDelim      +'\n-- DELIMITER ;\n';
    res.out200(sql);
  }else{ var tmp=req.pathNameWOPrefix+' is not valid input, try: '+this.StrType+' (suffixed with "All" if you want to)'; console.log(tmp); res.out404(tmp); }
}  





app.createDumpCommand=function(){ 
  var strCommand='', StrTabType=["schedule","user"];
  for(var i=0;i<StrTabType.length;i++){
    var strTabType=StrTabType[i], StrTab=[];
    for(var j=0;j<SiteName.length;j++){
      var siteName=SiteName[j];
      StrTab.push(siteName+'_'+strTabType);
    }
    strCommand+='          '+StrTab.join(' ');
  }
  strCommand="mysqldump mmm --user=root -p --no-create-info --hex-blob"+strCommand+'          >tracker.sql';

  return strCommand;
}







// When reinstalling, to keep the table content, run these mysql queries in for example phpmyadmin:
// CALL "+siteName+"dupMake(); // After this, verify that the duplicate tables have the same number of rows
// (then do the install (run createTable.php))
// CALL "+siteName+"dupTrunkOrgNCopyBack();    // After this, verify that the tables have the same number of rows as the duplicates
// CALL "+siteName+"dupDrop();

