



MySessionRegister=function(){  this.objReg={}; this.lastClense=0;   }
MySessionRegister.prototype.getSession=function(req,res){
  var cookies = parseCookies(req), sessionID;
  if(!('sessionID' in cookies)) {
    var sessionID=randomHash(); 
    this.objReg[sessionID]={};
    res.setHeader("Set-Cookie", "sessionID="+sessionID);
  } else {  sessionID=cookies.sessionID;  }
  if(!(sessionID in this.objReg)) { this.objReg[sessionID]={};}
  this.objReg[sessionID].lastAccess=unixNow();
  return this.objReg[sessionID];
}
MySessionRegister.prototype.clense=function(maxAge){
  var now=unixNow();
  for(var id in this.objReg){    if(this.objReg[id].lastAccess<now-maxAge) {delete this.objReg[id];}    }
}
MySessionRegister.prototype.clenseConditional=function(tClensePeriod,maxAge){
  var now=unixNow();
  if(this.lastClense<now-tClensePeriod) { this.clense(maxAge); this.lastClense=now;}
}
MySessionRegister.prototype.clearSingle=function(session){
  session.lastAccess=0;
}





runIdIP=function(IP,idIP){ //check  idIP against the vendor-table and return diverse data
"use strict"
  var siteName=this.req.siteName, site=this.site, TableName=site.TableName, userTab=TableName.userTab;
  var nArg=arguments.length, callback=arguments[nArg-1];
  var userInfoFrDBUpd={};

  var Sql=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE IP=? AND idIP=?;");
  var sql=Sql.join('\n'), Val=[IP, idIP];
  myQueryF(sql, Val, mysqlPool, function(err, results) {
    if(err) {callback(err);}
    else{
      var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
      callback(null, userInfoFrDBUpd); 
    }
  });
}



createSiteSpecificClientJSAll=function() {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific; 
    [err]=CacheUri.set(keyCache, buf, 'js', true, true);
  }
}

createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite;

  var StrSkip=['TableName', 'googleAnalyticsTrackingID', 'serv'];
  var siteSkip={}; for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; siteSkip[name]=site[name]; delete site[name];}

  var Str=[];
  Str.push("assignSiteSpecific=function(){\n\
\n\
boDbg="+JSON.stringify(boDbg)+";\n\
urlPayPal="+JSON.stringify(urlPayPal)+";\n\
\n\
version="+JSON.stringify(version)+";\n\
intMax="+JSON.stringify(intMax)+";\n\
leafBE="+JSON.stringify(leafBE)+";\n\
\n\
wwwSite="+JSON.stringify(wwwSite)+";\n\
wwwCommon="+JSON.stringify(wwwCommon)+";\n\
\n\
siteName="+JSON.stringify(siteName)+";\n\
site="+JSON.stringify(site)+";\n\
\n\
leafLogin="+JSON.stringify(leafLogin)+";\n\
listCol="+JSON.stringify(listCol)+";\n\
specialistDefault="+JSON.stringify(specialistDefault)+";\n\
flImageFolder="+JSON.stringify(flImageFolder)+";\n\
\n\
enumVoid="+JSON.stringify(enumVoid)+";\n\
enumY="+JSON.stringify(enumY)+";\n\
enumN="+JSON.stringify(enumN)+";\n\
strBTC="+JSON.stringify(strBTC)+";\n\
ppStoredButt="+JSON.stringify(ppStoredButt)+";\n\
}");

  for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; site[name]=siteSkip[name]; }

  var str=Str.join('\n');
  return str;


}





