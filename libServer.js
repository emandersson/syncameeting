
"use strict"
app.runIdIP=function*(flow, IP, idIP){ //check  idIP against the user-table and return diverse data
  var siteName=this.req.siteName, site=this.site, TableName=site.TableName, userTab=TableName.userTab;
  var nArg=arguments.length, callback=arguments[nArg-1];
  var userInfoFrDBUpd={};

  var Sql=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE IP=? AND idIP=?;");
  var sql=Sql.join('\n'), Val=[IP, idIP];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
  return [null, userInfoFrDBUpd]; 
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


app.createSiteSpecificClientJSAll=function*(flow) {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=yield *CacheUri.set(flow, keyCache, buf, 'js', true, true); if(err) return [err];

    var buf=createManifest(siteName);
    var keyCache=siteName+'/'+leafManifest;
    var [err]=yield *CacheUri.set(flow, keyCache, buf, 'json', true, true); if(err) return [err];
  }
  return [null];
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

  Str.push(`var tmp=`+JSON.stringify(objOut)+`;\n Object.assign(window, tmp);`);

  Str.push("}");

  var str=Str.join('\n');
  return str;


}


app.createManifest=function(siteName){
  var site=Site[siteName], {wwwSite, icons}=site;
  var uSite="https://"+site.wwwSite;
  let objOut={theme_color:"#ff0", background_color:"#fff", display:"minimal-ui", prefer_related_applications:false, short_name:siteName, name:siteName, start_url: uSite, icons }

  //let str=serialize(objOut);
  let str=JSON.stringify(objOut);
  return str;
}

app.createManifestNStoreToCache=function*(flow, siteName){
  var strT=createManifest(siteName);
  var buf=Buffer.from(strT, 'utf8');
  var [err]=yield* CacheUri.set(flow, siteName+'/'+leafManifest, buf, 'json', true, false);   if(err) return [err];
  return [null];
}
app.createManifestNStoreToCacheMult=function*(flow, SiteName){
  for(var i=0;i<SiteName.length;i++){
    var [err]=yield* createManifestNStoreToCache(flow, SiteName[i]);   if(err) return [err];
  }
  return [null];
}



