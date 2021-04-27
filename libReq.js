

"use strict"

var mesOMake=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(str);
}}
var mesEOMake=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  this.Str.push('E: '+err.syscal+' '+err.code);
  var str=this.Str.join(glue); this.res.end(str);	
}}
var mesOMakeJSON=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(serialize(str));
}}
var mesEOMakeJSON=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);
  var str=this.Str.join(glue); this.res.end(serialize(str));	
}}



/******************************************************************************
 * reqIndex
 ******************************************************************************/
app.reqIndex=function*() {
  var {req, res}=this; 
  var flow=req.flow;
  var siteName=req.siteName, site=req.site, uSite=req.uSite, wwwSite=req.wwwSite;
  var objQS=req.objQS;
  //var uuid=null; if('uuid' in objQS) { uuid=objQS.uuid;}
  var uuid=objQS.uuid||null;


  var requesterCacheTime=getRequesterTime(req.headers);

  res.setHeader("Cache-Control", "must-revalidate");  res.setHeader('Last-Modified',tIndexMod.toUTCString());

  if(requesterCacheTime && requesterCacheTime>=tIndexMod && 0) { res.statusCode=304; res.end(); return false;   } 
  res.statusCode=200;   
  
 
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"
xmlns="http://www.w3.org/1999/xhtml"
xmlns:og="http://ogp.me/ns#"
xmlns:fb="http://www.facebook.com/2008/fbml">`);
  Str.push('<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');

  if(uuid!=null)  Str.push('<meta name="robots" content="noindex">');


  var ua=req.headers['user-agent']||''; ua=ua.toLowerCase();
  var boMSIE=RegExp('msie').test(ua);
  var boAndroid=RegExp('android').test(ua);
  var boFireFox=RegExp('firefox').test(ua);
  //var boIOS= RegExp('iPhone|iPad|iPod','i').test(ua);
  var boIOS= RegExp('iphone','i').test(ua);

  
  

  var srcIcon16=site.SrcIcon[IntSizeIconFlip[16]];
  var srcIcon114=site.SrcIcon[IntSizeIconFlip[114]];
  Str.push('<link rel="icon" type="image/png" href="'+srcIcon16+'" />');
  Str.push('<link rel="apple-touch-icon" href="'+srcIcon114+'"/>');


  var strTmp='';  //if(boAndroid && boFireFox) {  strTmp=", width=device-width";}
  //var strTmp=", width=device-width, user-scalable=no";
  Str.push("<meta name='viewport' id='viewportMy' content='initial-scale=1'/>");
  Str.push('<meta name="theme-color" content="#fff"/>');


  var strTitle='Free meeting synchronizer';
  var strH1=wwwSite;
  var strH1='syncAMeeting';
  var strDescription='Free tool for synchronizing a meeting without any particular user commitment';
  var strKeywords='scheduler meeting-synchronizer free schedule synchronize sync calender meeting week day hour lecture';
  var strSummary="";



  Str.push(`
  <meta name="description" content="`+strDescription+`"/>
  <meta name="keywords" content="`+strKeywords+`"/>
  <link rel="canonical" href="`+uSite+`"/>`);

  
  var uIcon200=uSite+site.SrcIcon[IntSizeIconFlip[200]];
  if(!boDbg) {
    Str.push(`
<meta property="og:title" content="`+wwwSite+`"/>
<meta property="og:type" content="website" />
<meta property="og:url" content="http://`+wwwSite+`"/>
<meta property="og:image" content="`+uIcon200+`"/>
<meta property="og:site_name" content="`+wwwSite+`"/>
<meta property="fb:admins" content="100002646477985"/>
<meta property="fb:app_id" content="`+req.rootDomain.fb.id+`"/>
<meta property="og:description" content="`+strDescription+`"/>
<meta property="og:locale:alternate" content="sv_se" />
<meta property="og:locale:alternate" content="en_US" />`);
  }

  
  Str.push(`<script>var app=window;</script>`);
  Str.push(`<style>
:root { --maxWidth:800px; height:100%}
body {margin:0; height:100%; display:flow-root; font-family:arial, verdana, helvetica;}
.mainDivR { box-sizing:border-box; margin: 0em auto; width:100%; display:flex; max-width:var(--maxWidth) }
h1 { font-size:1.6rem; font-weight:bold; letter-spacing:0.15em; text-shadow:-1px 0 grey, 1px 0 grey, 0 -1px grey, 0 1px grey, -1px -1px grey, 1px 1px grey, -1px 1px grey, 1px -1px grey; display:inline-block  }
</style>`);

  var tmp=`
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '`+req.rootDomain.fb.id+`',
      cookie     : true,
      xfbml      : true,
      version    : 'v4.0'
    });
    FB.AppEvents.logPageView();   
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>`;
  Str.push(tmp);


  var uCommon=''; if(wwwCommon) uCommon=req.strSchemeLong+wwwCommon;

    // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes

    // Use normal vTmp on iOS (since I don't have any method of disabling cache on iOS devices (nor any debugging interface))
  var boDbgT=boDbg; if(boIOS) boDbgT=0;
  
  
  var keyTmp=siteName+'/'+leafManifest, vTmp=boDbgT?0:CacheUri[keyTmp].eTag;     Str.push(`<link rel="manifest" href="`+uSite+`/`+leafManifest+`?v=`+vTmp+`"/>`);
  
    // Include stylesheets
  //var pathTmp='/stylesheets/resetMeyer.css', vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');
  var pathTmp='/stylesheets/style.css', vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var uSite=req.strSchemeLong+wwwSite;
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=boDbgT?0:CacheUri[keyCache].eTag;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'" async></script>');

    // Include JS-files
  var StrTmp=['lib.js', 'libClient.js', 'client.js', 'lang/en.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'" async></script>');
  }




  var strTracker, tmpID=site.googleAnalyticsTrackingID||null;
  if(boDbg||!tmpID){strTracker="<script> ga=function(){};</script>";}else{ 
  strTracker=`
<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', '`+tmpID+`', 'auto');
  ga('send', 'pageview');
</script>`;
  }
  Str.push(strTracker);

  Str.push("</head>");
  Str.push(`<body>
<title>`+strTitle+`</title>
<div id=divEntryBar class="mainDivR" style="align-items:center; min-height:2rem; flex:0 0 auto"></div>
<div id=divH1 class="mainDivR" style="border:solid 1px; color:black;  padding:0em; margin:0 auto 0; flex:0 0 auto; align-items:center; justify-content:center"><h1>`+strH1+`</h1></div>
<noscript><div style="text-align:center">You don't have javascript enabled, so this app won't work.</div></noscript>`);


  Str.push(`<script type="text/javascript" language="JavaScript" charset="UTF-8">
boTLS=`+JSON.stringify(site.boTLS)+`;
uuid=`+JSON.stringify(uuid)+`;
</script>
</body>
</html>`);


  var str=Str.join('\n'); 
  res.setHeader('Content-type', MimeType.html);
  res.end(str); // res.writeHead(200, "OK", {'Content-Type': MimeType.html}); 
   
}




/******************************************************************************
 * ReqLoginBack
 ******************************************************************************/
//app.ReqLoginBack=function(req, res){
  //this.req=req; this.res=res; this.site=req.site; this.mess=[]; this.Str=[]; this.pool=mysqlPool;
//}

app.ReqLoginBack=function(objReqRes){
  Object.assign(this, objReqRes);
  this.site=this.req.site;
  this.mess=[];  this.Str=[];
}
ReqLoginBack.prototype.go=function*(){
  var self=this, req=this.req, flow=req.flow, res=this.res, sessionID=req.sessionID, objQS=req.objQS;

  var redisVar=req.sessionID+'_Login'; 
  this.sessionLogin=yield* getRedis(flow, redisVar,1);
  if(!this.sessionLogin) { res.out500('!sessionLogin');  return; }
  var strFun=this.sessionLogin.fun;

  //var redisVar=this.req.sessionID+'_Login', strTmp=wrapRedisSendCommand('get',[redisVar]);   this.sessionLogin=JSON.parse(strTmp);
  //if(!this.sessionLogin) { res.out500('!sessionLogin');  return; }
  //var strFun=this.sessionLogin.fun;
  

  //getSessionMain.call(this);
  this.sessionCache=yield* getRedis(flow, req.sessionID+'_Cache',1);
  if(!this.sessionCache) { res.out500('!sessionCache');  return; } 
  var redisVar=this.req.sessionID+'_Cache'; // tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
  var tmp=yield* expireRedis(flow, redisVar, maxUnactivity);

  if(!this.sessionCache.userInfoFrDB){
    this.sessionCache.userInfoFrDB=extend({},specialistDefault);
    //setSessionMain.call(this);
    yield *setRedis(flow, req.sessionID+'_Cache', this.sessionCache, maxUnactivity);
  }
  
  
  if('error' in objQS && objQS.error=='access_denied') {this.writeHtml(objQS.error); return}

  //var fiber = Fiber.current;


    // getToken
  var code=req.objQS.code;
  var uLoginBack=req.uSite+"/"+leafLoginBack;

  if(req.objQS.state==this.sessionLogin.state) {
    var uToGetToken=UrlToken.fb+"?client_id="+req.rootDomain.fb.id+"&redirect_uri="+encodeURIComponent(uLoginBack)+"&client_secret="+req.rootDomain.fb.secret+"&code="+code;
    var reqStream=requestMod.get(uToGetToken); 

    var semCB=0, semY=0,  buf, myConcat=concat(function(bufT){ buf=bufT; if(semY) flow.next(); semCB=1;  });    reqStream.pipe(myConcat);    if(!semCB){semY=1; yield}
    try{ var params=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e); return; }
    self.access_token=params.access_token;
    if('error' in params) { var tmp='Error when getting access token: '+params.error.message; console.log(tmp); res.out500(tmp); return; }
  }
  else {
    var tmp="The state does not match. You may be a victim of CSRF.";    res.out500(tmp); return
  }


  var [err, res]=yield* this.getGraph();  if(err){ res.out500(err); return; }


    // interpretGraph
  var objGraph=this.objGraph;  
  if('error' in objGraph) {console.log('Error accessing data from facebook: '+objGraph.error.type+' '+objGraph.error.message+'<br>'); return; }
  var IP='fb', idIP=objGraph.id, nameIP=objGraph.name;

  //if(!objGraph.verified) { var tmp="Your Facebook account is not verified. Try search internet for  \"How to verify Facebook account\".";  res.out500(tmp);   return; }

  if(typeof idIP=='undefined') {console.log("Error idIP is empty");}  else if(typeof nameIP=='undefined' ) {nameIP=idIP;}
  
  if('userInfoFrIP' in this.sessionCache){
    if(this.sessionCache.userInfoFrIP.IP!==IP || this.sessionCache.userInfoFrIP.idIP!==idIP){
      this.sessionCache.userInfoFrDB=extend({},specialistDefault);    
    }
  }
  this.sessionCache.userInfoFrIP={IP,idIP,nameIP};
  
  //setSessionMain.call(this);
  yield *setRedis(flow, req.sessionID+'_Cache', this.sessionCache, maxUnactivity);
  
  this.IP=IP;this.idIP=idIP;


    // setCSRFCode
  var CSRFCode=randomHash();
  var redisVar=this.req.sessionID+'_CSRFCode'+ucfirst(this.sessionLogin.caller);
  //wrapRedisSendCommand('set',[redisVar, CSRFCode]);    var tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
  yield *setRedis(req.flow, redisVar, CSRFCode, maxUnactivity);
  this.CSRFCode=CSRFCode;

  this.writeHtml(null);
}


ReqLoginBack.prototype.getGraph=function*(){
  var req=this.req, flow=req.flow, res=this.res;
  
  var uGraph=UrlGraph.fb+"?access_token="+this.access_token+'&fields=id,name';  //  ,verified
  var reqStream=requestMod.get(uGraph);
  var buf, myConcat=concat(function(bufT){ buf=bufT; flow.next();  });    reqStream.pipe(myConcat);    yield;
  var objGraph=JSON.parse(buf.toString());
  this.objGraph=objGraph;
  return [null,''];
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
  Str.push(`
<html lang="en"><head><meta name='robots' content='noindex'>
<link rel='canonical' href='`+uSite+`'/>
</head>
<body>
<script>
var boOK=`+JSON.stringify(boOK)+`;
var strMess=`+serialize(strMess)+`;

if(boOK){
  var userInfoFrIPTT=`+JSON.stringify(this.sessionCache.userInfoFrIP)+`;
  var userInfoFrDBTT=`+JSON.stringify(this.sessionCache.userInfoFrDB)+`;
  var CSRFCodeTT=`+JSON.stringify(this.CSRFCode)+`;
  var fun=`+serialize(this.sessionLogin.fun)+`;
  window.opener.loginReturn(userInfoFrIPTT,userInfoFrDBTT,fun,strMess,CSRFCodeTT);
  window.close();
}
else {
//debugger
  //alert('Login canceled: '+strMess);
  window.close();
}
</script>
</body>
</html>
`);
  var str=Str.join('\n');  this.res.end(str);
}



/******************************************************************************
 * reqDataDelete   // From IdP
 ******************************************************************************/

function parseSignedRequest(signedRequest, secret) {
  var [b64UrlMac, b64UrlPayload] = signedRequest.split('.', 2);
  //var mac = b64UrlDecode(b64UrlMac);
  var payload = b64UrlDecode(b64UrlPayload),  data = JSON.parse(payload);
  var b64ExpectedMac = crypto.createHmac('sha256', secret).update(b64UrlPayload).digest('base64');
  var b64UrlExpectedMac=b64ExpectedMac.replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
  if (b64UrlMac !== b64UrlExpectedMac) {
    return [Error('Invalid mac: ' + b64UrlMac + '. Expected ' + b64UrlExpectedMac)];
  }
  return [null,data];
}


app.deleteOne=function*(user_id){ // 
  var {req}=this, {flow, site}=req, {userTab}=site.TableName;
  var Ou={};

  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idIP=?;"); Val.push(user_id);
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var c=results.affectedRows;

  return [null, c];
}

app.reqDataDelete=function*(){  //
  var {req, res}=this;
  var {flow, objQS, uSite, siteName}=req;

  //if(req.method=='GET' && boDbg){ var objUrl=url.parse(req.url), qs=objUrl.query||'', strData=qs; } else 
  if(req.method=='POST'){
    //var strData=yield* app.getPost.call(this, req.flow, req);
    var buf, myConcat=concat(function(bufT){ buf=bufT; flow.next();  });    req.pipe(myConcat);    yield;
    var strData=buf.toString();
  }
  else {res.outCode(400, "Post request wanted"); return; }
  
  var Match=strData.match(/signed_request=(.*)/); if(!Match) {res.outCode(400, "String didn't start with \"signed_request=\""); return; }
  var strDataB=Match[1];

  var [err, data]=parseSignedRequest(strDataB, req.rootDomain.fb.secret); if(err) { res.outCode(400, "Error in parseSignedRequest: "+err.message); return; }
  var {user_id}=data;

  var [err,c]=yield* deleteOne.call(this, user_id);
  if(c==1) var strPlur='entry'; else var strPlur='entries';
  var mess='User: '+user_id+': '+c+' '+strPlur+' deleted';
  
  console.log('reqDataDelete: '+mess);
  var confirmation_code=genRandomString(32);
  yield *setRedis(flow, confirmation_code+'_DeleteRequest', mess, timeOutDeleteStatusInfo); //3600*24*30

  res.setHeader('Content-Type', MimeType.json); 
  res.end(JSON.stringify({ url: uSite+'/'+leafDataDeleteStatus+'?confirmation_code='+confirmation_code, confirmation_code }));
}

app.reqDataDeleteStatus=function*(){
  var {req, res}=this;
  var {flow, site, objQS, uSite}=req;
  var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=querystring.parse(qs);
  var confirmation_code=objQS.confirmation_code||'';
  var [err,mess]=yield* cmdRedis(flow, 'GET', [confirmation_code+'_DeleteRequest']); 
  if(err) {var mess=err.message;}
  else if(mess==null) {
    var [t,u]=getSuitableTimeUnit(timeOutDeleteStatusInfo);
    //var mess="The delete status info is only available for "+t+u+".\nAll delete requests are handled immediately. So if you pressed delete, you are deleted.";
    var mess="No info of deletion status found, (any info is deleted "+t+u+" after the deletion request).";
  }
  res.end(mess);
}



/******************************************************************************
 * reqStatic
 ******************************************************************************/
app.reqStatic=function*() {
  var {req, res}=this;
  var {flow, siteName, pathName}=req;

  //var RegAllowedOriginOfStaticFile=[RegExp("^https\:\/\/(closeby\.market|gavott\.com)")];
  //var RegAllowedOriginOfStaticFile=[RegExp("^http\:\/\/(localhost|192\.168\.0)")];
  var RegAllowedOriginOfStaticFile=[];
  setAccessControlAllowOrigin(req, res, RegAllowedOriginOfStaticFile);
  if(req.method=='OPTIONS'){ res.end(); return ;}

  var eTagIn=getETag(req.headers);
  var keyCache=pathName; if(pathName==='/'+leafSiteSpecific || pathName==='/'+leafManifest) keyCache=siteName+keyCache;
  if(!(keyCache in CacheUri)){
    var filename=pathName.substr(1);
    var [err]=yield* readFileToCache(flow, filename);
    if(err) {
      if(err.code=='ENOENT') {res.out404(); return;}
      if('host' in req.headers) console.error('Faulty request from'+req.headers.host);
      if('Referer' in req.headers) console.error('Referer:'+req.headers.Referer);
      res.out500(err); return;
    }
  }
  var {buf, type, eTag, boZip, boUglify}=CacheUri[keyCache];
  if(eTag===eTagIn){ res.out304(); return; }
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
 * SetupSql
 ******************************************************************************/
app.SetupSql=function(){
}
app.SetupSql.prototype.createTable=function*(flow, siteName,boDropOnly){
  var site=Site[siteName]; 
  
  var SqlTabDrop=[], SqlTab=[];
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
  SqlTab.push(`CREATE TABLE `+userTab+` (
  idUser INT(4) NOT NULL auto_increment,
  IP `+strIPEnum+` CHARSET utf8 NOT NULL,
  idIP VARCHAR(128) CHARSET utf8 NOT NULL DEFAULT '',
  PRIMARY KEY (idUser),
  UNIQUE KEY (IP,idIP)
  ) AUTO_INCREMENT = `+auto_increment+`, ENGINE=`+engine+` COLLATE `+collate); 




  //uuid BINARY(16) PRIMARY KEY,


    // Create schedule
  SqlTab.push(`CREATE TABLE `+scheduleTab+` (
  uuid VARCHAR(36) PRIMARY KEY,
  idUser INT(4) NOT NULL,
  title VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '',
  MTab TEXT CHARSET utf8 NOT NULL,
  unit ENUM('l', 'h', 'd', 'w') NOT NULL,
  intFirstDayOfWeek INT(1) NOT NULL DEFAULT 1,
  intDateAlwaysInWOne INT(1) NOT NULL DEFAULT 4,
  start TIMESTAMP DEFAULT 0,
  vNames TEXT CHARSET utf8 NOT NULL,
  hFilter VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '',
  dFilter VARCHAR(65) CHARSET utf8 NOT NULL DEFAULT '',
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastActivity TIMESTAMP DEFAULT 0,
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) AUTO_INCREMENT = `+auto_increment+`, ENGINE=`+engine+` COLLATE `+collate); 
  //codeSchedule VARCHAR(20) NOT NULL DEFAULT '',
  //uuid VARCHAR(36) NOT NULL,
  //idSchedule INT(8) NOT NULL auto_increment,
  //UNIQUE KEY (uuid)

  if(boDropOnly) var Sql=SqlTabDrop;
  else var Sql=array_merge(SqlTabDrop, SqlTab);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err) {  return [err]; }
  return [null];
}


app.SetupSql.prototype.createFunction=function*(flow, siteName,boDropOnly){
  var site=Site[siteName]; 
  
  var SqlFunctionDrop=[], SqlFunction=[];
  var {Prop, TableName, ViewName}=site;
  var {scheduleTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));

  var strIPEnum="ENUM('"+Enum.IP.join("', '")+"')";

      
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"save");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`save(IIP `+strIPEnum+`, IidIP VARCHAR(128), IlastActivity INT(4), ICuuid VARCHAR(36), Ititle VARCHAR(128), IMTab TEXT, Iunit ENUM('l', 'h', 'd', 'w'), IintFirstDayOfWeek INT(1), IintDateAlwaysInWOne INT(1), Istart INT(4), IvNames TEXT, IhFilter VARCHAR(65), IdFilter VARCHAR(65))
      proc_label:BEGIN
        DECLARE Vc, VboOld, VidUser INT;
        #DECLARE VBuuid BINARY(16);         # Uncomment when BIN_TO_UUID() becomes available
        DECLARE VBuuid VARCHAR(36);         # Remove when BIN_TO_UUID() becomes available
        #DECLARE Vnow TIMESTAMP;
        IF ISNULL(IMTab) THEN SET IMTab=''; END IF;
        IF ISNULL(IvNames) THEN SET IvNames=''; END IF;
        
        IF ISNULL(ICuuid) THEN
          INSERT INTO `+userTab+` (IP,idIP) VALUES (IIP, IidIP) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser);
          SET VidUser=LAST_INSERT_ID();
          #SET ICuuid=UUID();               # Uncomment when BIN_TO_UUID() becomes available
          #SET VBuuid=UUID_TO_BIN(ICuuid);  # Uncomment when BIN_TO_UUID() becomes available
          #SET ICuuid=SUBSTR(RAND(), 3);     # Remove when BIN_TO_UUID() becomes available
          SET ICuuid=SUBSTR(CONCAT(MD5(RAND()),MD5(RAND())), 1, 36);     # Remove when BIN_TO_UUID() becomes available
          SET VBuuid=ICuuid;                # Remove when BIN_TO_UUID() becomes available
          INSERT INTO `+scheduleTab+` (uuid, idUser, lastActivity, MTab, vNames) VALUES (VBuuid, VidUser, now(), '', '');
        ELSE
          #SET VBuuid=UUID_TO_BIN(ICuuid);  # Uncomment when BIN_TO_UUID() becomes available
          SET VBuuid=ICuuid;                # Remove when BIN_TO_UUID() becomes available
          SELECT UNIX_TIMESTAMP(lastActivity)>IlastActivity INTO VboOld FROM `+scheduleTab+` WHERE uuid=VBuuid;
          SET Vc=ROW_COUNT();
          IF Vc!=1 THEN SELECT CONCAT('Got ', Vc, ' rows') AS mess;  LEAVE proc_label; END IF;
          IF VboOld THEN SELECT 'boOld' AS mess;  LEAVE proc_label; END IF;
        END IF;

        UPDATE `+scheduleTab+` SET title=Ititle, MTab=IMTab, unit=Iunit, intFirstDayOfWeek=IintFirstDayOfWeek, intDateAlwaysInWOne=IintDateAlwaysInWOne, start=FROM_UNIXTIME(Istart), vNames=IvNames, hFilter=IhFilter, dFilter=IdFilter, lastActivity=now() WHERE uuid=VBuuid;
        SELECT ROW_COUNT() AS nUpd;
        SELECT UNIX_TIMESTAMP(lastActivity) AS lastActivity, uuid FROM `+scheduleTab+` WHERE uuid=VBuuid;
      END`);
  // CALL syncameetingLsave('fb', '12345', 1.4e9, null, 'myTitle', 'abcdMTab', 'd', 0, 4, 1.4e9, 'abcnames', 'abchFilt', 'abcdfilt')
  // CALL syncameetingLsave('fb', '12345', 1.5e9, '4885819884842094', 'myNTitle', 'abcdMTab', 'd', 0, 4, 1.4e9, 'abcnames', 'abchFilt', 'abcdfilt')
  // CALL syncameetingLdelete('fb', '12345', '4885819884842094')


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"delete");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`delete(IIP `+strIPEnum+`, IidIP VARCHAR(128), ICuuid VARCHAR(36))
      proc_label:BEGIN
        DECLARE Vc, VidUser INT;

        SELECT idUser INTO VidUser FROM `+userTab+` WHERE IP=IIP AND idIP=IidIP;
        SELECT ROW_COUNT() INTO Vc;
        IF Vc!=1 THEN SELECT CONCAT(Vc, ' rows with that ID') AS err;  LEAVE proc_label; END IF;

        DELETE FROM `+scheduleTab+`  WHERE idUser=VidUser AND uuid=ICuuid;
        SELECT ROW_COUNT() INTO Vc;
        #IF Vc!=1 THEN SELECT CONCAT(Vc, ' rows deleted') AS err;  LEAVE proc_label; END IF;
        SELECT Vc AS nDelete;

        SELECT @nRemaining:=COUNT(*) AS nRemaining FROM `+scheduleTab+`  WHERE idUser=VidUser;
        IF @nRemaining=0 THEN
          DELETE FROM `+userTab+`  WHERE idUser=VidUser;
        END IF;
      END`);

  if(boDropOnly) var Sql=SqlFunctionDrop;
  else var Sql=array_merge(SqlFunctionDrop, SqlFunction);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err) {  return [err]; }
  return [null];
}


app.SetupSql.prototype.funcGen=function*(flow, boDropOnly){
  var SqlFunction=[], SqlFunctionDrop=[];
  if(boDropOnly) var Sql=SqlFunctionDrop;
  else var Sql=array_merge(SqlFunctionDrop, SqlFunction);
  return [null];
}
app.SetupSql.prototype.createDummies=function*(flow, siteName){
  var site=Site[siteName]; 
  var SqlDummies=[];
  return [null];
}
app.SetupSql.prototype.createDummy=function*(flow, siteName){
  var site=Site[siteName]; 
  var SqlDummy=[];
  return [null];
}

app.SetupSql.prototype.truncate=function*(flow, siteName){
  var site=Site[siteName]; 
  
  var Sql=[];

  var StrTabName=object_values(site.TableName);

  var SqlTmp=[];
  for(var i=0;i<StrTabName.length;i++){
    SqlTmp.push(StrTabName[i]+" WRITE");
  }
  Sql.push('SET FOREIGN_KEY_CHECKS=0');
  var tmp="LOCK TABLES "+SqlTmp.join(', ');
  Sql.push(tmp);
  for(var i=0;i<StrTabName.length;i++){
    Sql.push("DELETE FROM "+StrTabName[i]);
    Sql.push("ALTER TABLE "+StrTabName[i]+" AUTO_INCREMENT = 1");
  }
  Sql.push('UNLOCK TABLES');
  Sql.push('SET FOREIGN_KEY_CHECKS=1');
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err) {  return [err]; }
  return [null];
}


  // Called when --sql command line option is used
app.SetupSql.prototype.doQuery=function*(flow, strCreateSql){
  if(StrValidSqlCalls.indexOf(strCreateSql)==-1){var tmp=strCreateSql+' is not valid input, try any of these: '+StrValidSqlCalls.join(', '); return [new Error(tmp)]; }
  var Match=RegExp("^(drop|create)?(.*?)$").exec(strCreateSql);
  if(!Match) { debugger;  return [new Error("!Match")]; }
  
  var boDropOnly=false, strMeth=Match[2];
  if(Match[1]=='drop') { boDropOnly=true; strMeth='create'+strMeth;}
  else if(Match[1]=='create')  { strMeth='create'+strMeth; }
  
  if(strMeth=='createFunction'){ 
    var [err]=yield* this.funcGen(flow, boDropOnly); if(err){  return [err]; }  // Create common functions
  }
  for(var iSite=0;iSite<SiteName.length;iSite++){
    var siteName=SiteName[iSite];
    console.log(siteName);
    var [err]=yield* this[strMeth](flow, siteName, boDropOnly);  if(err){  return [err]; }
  }
  return [null];
}

var writeMessTextOfMultQuery=function(Sql, err, results){
  var nSql=Sql.length, nResults='(single query)'; if(results instanceof Array) nResults=results.length;
  console.log('nSql='+nSql+', nResults='+nResults);
  var StrMess=[];
  if(err){
    StrMess.push('err.index: '+err.index+', err: '+err);
    if(nSql==nResults){
      var tmp=Sql.slice(bound(err.index-1,0,nSql), bound(err.index+2,0,nSql)),  sql=tmp.join('\n');
      StrMess.push('Since "Sql" and "results" seem correctly aligned (has the same size), then 3 queries are printed (the preceding, the indexed, and following query (to get a context)):\n'+sql); 
    }
    console.log(StrMess.join('\n'));
  }
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
  var objHead={"Content-Type": MimeType.zip, "Content-Length":outdata.length, 'Content-Disposition':'attachment; filename='+outFileName};
  res.writeHead(200,objHead);
  res.end(outdata,'binary');
}
ReqSql.prototype.toBrowser=function(objSetupSql){
  var {req, res}=this;
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

