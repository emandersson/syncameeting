
"use strict"

//runIdIP=function(IP,idIP){ //check  idIP against the vendor-table and return diverse data
//"use strict"
  //var siteName=this.req.siteName, site=this.site, TableName=site.TableName, userTab=TableName.userTab;
  //var nArg=arguments.length, callback=arguments[nArg-1];
  //var userInfoFrDBUpd={};

  //var Sql=[];
  //Sql.push("SELECT * FROM "+userTab+" WHERE IP=? AND idIP=?;");
  //var sql=Sql.join('\n'), Val=[IP, idIP];
  //myQueryF(sql, Val, mysqlPool, function(err, results) {
    //if(err) {callback(err);}
    //else{
      //var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
      //callback(null, userInfoFrDBUpd); 
    //}
  //});
//}


//runIdIP=function(IP,idIP){ //check  idIP against the vendor-table and return diverse data
app.runIdIP=function*(flow, IP, idIP){ //check  idIP against the user-table and return diverse data
"use strict"
  var siteName=this.req.siteName, site=this.site, TableName=site.TableName, userTab=TableName.userTab;
  var nArg=arguments.length, callback=arguments[nArg-1];
  var userInfoFrDBUpd={};

  var Sql=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE IP=? AND idIP=?;");
  var sql=Sql.join('\n'), Val=[IP, idIP];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
  return [null, userInfoFrDBUpd]; 
  //myQueryF(sql, Val, mysqlPool, function(err, results) {
    //if(err) {callback(err);}
    //else{
      //var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
      //callback(null, userInfoFrDBUpd); 
    //}
  //});
}



app.checkIfUserInfoFrIP=function*(){ 
  if('userInfoFrIP' in this.sessionCache && 'IP' in this.sessionCache.userInfoFrIP){ return true; }
  else{ 
    this.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
    yield *setRedis(this.req.flow, this.req.sessionID+'_Cache', this.sessionCache, maxUnactivity);
    return false;
  }
}
app.checkIfAnySpecialist=function(){
  var tmpEx=this.sessionCache.userInfoFrDB
  return Boolean(tmpEx.customer);
}

//createSiteSpecificClientJSAll=function() {
  //for(var i=0;i<SiteName.length;i++){
    //var siteName=SiteName[i];
    //var buf=createSiteSpecificClientJS(siteName);
    //var keyCache=siteName+'/'+leafSiteSpecific; 
    //[err]=CacheUri.set(keyCache, buf, 'js', true, true);
  //}
//}
app.createSiteSpecificClientJSAll=function*(flow) {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=yield *CacheUri.set(flow, keyCache, buf, 'js', true, true);
  }
}

var createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite;

  var StrSkip=['TableName', 'googleAnalyticsTrackingID', 'serv'];
  var Key=Object.keys(site), siteSimplified={};
  for(var i=0;i<Key.length;i++){ var name=Key[i]; if(StrSkip.indexOf(name)==-1) siteSimplified[name]=site[name]; }

  var Str=[];
  Str.push("assignSiteSpecific=function(){");

  var StrVar=['boDbg', 'version', 'intMax', 'leafLogin', 'leafBE', 'flImageFolder', 'specialistDefault', 'wwwCommon', 'siteName', 'urlPayPal', 'listCol', 'enumVoid', 'enumY', 'enumN', 'strBTC', 'ppStoredButt' ];
  var objOut=copySome({},app,StrVar);
  //copySome(objOut,site,['wwwSite']);
  objOut.site=siteSimplified;

  Str.push(`var tmp=`+JSON.stringify(objOut)+`;\n extend(window, tmp);`);

  Str.push("}");

  var str=Str.join('\n');
  return str;


}





