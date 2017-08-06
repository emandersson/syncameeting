"use strict"


/******************************************************************************
 * ReqBE
 ******************************************************************************/
var ReqBE=app.ReqBE=function(req, res, callback){
  this.req=req; this.res=res; this.callback=callback||function(){}; this.site=req.site; this.Str=[]; 
  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
}



ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(str){
  if(str) this.Str.push(str);
  this.GRet.strMessageText=this.Str.join(', ');
  this.GRet.userInfoFrIP=this.sessionMain.userInfoFrIP;
  this.res.end(JSON.stringify(this.Out));	
}
ReqBE.prototype.mesEO=function(errIn){
  var GRet=this.GRet;
  var boString=typeof errIn=='string';
  var err=errIn; 
  if(boString) { this.Str.push('E: '+errIn); err=new MyError(errIn); } 
  else{  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);  }
  console.log(err.stack);
  GRet.strMessageText=this.Str.join(', ');
  GRet.userInfoFrIP=this.sessionMain.userInfoFrIP; 

  this.res.writeHead(500, {"Content-Type": "text/plain"}); 
  this.res.end(JSON.stringify(this.Out));	
}




ReqBE.prototype.checkIfUserInfoFrIP=function(){ 
  if('IP' in this.sessionMain.userInfoFrIP){ return true; }
  else{ 
    resetSessionMain.call(this); return false;
  }
}
ReqBE.prototype.checkIfAnySpecialist=function(){
  var tmpEx=this.sessionMain.userInfoFrDB
  return Boolean(tmpEx.customer);
}
ReqBE.prototype.clearSession=function(){
  //this.sessionMain.userInfoFrIP={};
  resetSessionMain.call(this);
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
}

ReqBE.prototype.specSetup=function(callback,inObj){
  var self=this, req=this.req, Ou={};
  var Role=null; if(typeof inObj=='object' && 'Role' in inObj) Role=inObj.Role;
  if(!this.checkIfUserInfoFrIP()) { callback(null,[Ou]); return } 
  var tmp=this.sessionMain.userInfoFrIP, IP=tmp.IP, idIP=tmp.idIP;
  var fiber = Fiber.current; self.boDoExit=0;
  runIdIP.call(this, IP, idIP, Role, function(err,res){
    if(err){self.mesEO(err);  callback('exited'); self.boDoExit=1; return; }
    else{   
      extend(self.GRet.userInfoFrDBUpd,res);    extend(self.sessionMain.userInfoFrDB,res);
    }
    fiber.run();
  });
  Fiber.yield();  if(self.boDoExit==1) return;

  setSessionMain.call(self);
  if(!self.checkIfAnySpecialist()){self.clearSession();} // If the user once clicked login, but never saved anything then logout
  callback(null,[Ou]);
}



ReqBE.prototype.logout=function(callback,inObj){
  var self=this, req=this.req;
  resetSessionMain.call(this); 
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  self.mes('Logged out'); callback(null,[0]); return;
}
    
ReqBE.prototype.getSchedule=function(callback,inObj){
  var self=this, req=this.req, site=req.site, siteName=req.siteName;
  var scheduleTab=site.TableName.scheduleTab;
  var Ou={}, Sql=[];
 
    // Delete all old schedules
  Sql.push("DELETE FROM "+scheduleTab+" WHERE date_add(lastActivity, INTERVAL 1 MONTH)<now();");
  Sql.push("SELECT idSchedule,codeSchedule,title,MTab,unit,firstDayOfWeek,dateAlwaysInWOne,UNIX_TIMESTAMP(start) AS start,vNames,hFilter,dFilter,UNIX_TIMESTAMP(lastActivity) AS lastActivity,UNIX_TIMESTAMP(created) AS created \n\
  FROM "+scheduleTab+" WHERE idSchedule=? AND codeSchedule=?;"); 

  var sql=Sql.join('\n'),   Val=[inObj.idSchedule, inObj.codeSchedule]; 
  myQueryF(sql, Val, mysqlPool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var c=results[1].length; if(c!=1) { self.mesO(c+" rows found for that idSchedule/codeSchedule"); callback('exited');  return;}
      Ou.row=results[1][0]; 
      callback(null, [Ou]);
    }
  });
}

ReqBE.prototype.listSchedule=function(callback,inObj){
  var self=this, req=this.req, site=req.site, siteName=req.siteName, sessionMain=this.sessionMain, {userTab, scheduleTab}=site.TableName;
  var Ou={}, Sql=[];
  
  if(!isSetObject(sessionMain.userInfoFrIP)){ callback(null,[Ou]); return; }

  Ou.tab=[];
  //Sql.push("SELECT idSchedule,codeSchedule,title,UNIX_TIMESTAMP(created) AS created,UNIX_TIMESTAMP(lastActivity) AS lastActivity FROM "+scheduleTab+" s JOIN "+userTab+" u ON s.idUser=u.idUser WHERE u.idUser=?;"); 
  Sql.push("SELECT idSchedule,codeSchedule,title,UNIX_TIMESTAMP(created) AS created,UNIX_TIMESTAMP(lastActivity) AS lastActivity FROM "+scheduleTab+" s JOIN "+userTab+" u ON s.idUser=u.idUser WHERE u.IP=? AND u.idIP=?;"); 
  
  var sql=Sql.join('\n'),   Val=[sessionMain.userInfoFrIP.IP, sessionMain.userInfoFrIP.idIP];  //Val=[idUser]; 
  myQueryF(sql, Val, mysqlPool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var n=results.length;
      for(var i=0;i<n;i++) {
        var row=results[i], len=listCol.KeyCol.length, rowN=Array(len);
        for(var j=0;j<len;j++){ var key=listCol.KeyCol[j]; rowN[j]=row[key]; }
        Ou.tab.push(rowN);
      }   
      callback(null, [Ou,'listScheduleRet']);
    }
  });
}

ReqBE.prototype.saveSchedule=function(callback,inObj){
  var self=this, req=this.req, site=req.site, siteName=req.siteName, sessionMain=this.sessionMain;
  var scheduleTab=site.TableName.scheduleTab;
  var Ou={}, Sql=[];

  var IP='fb', idIP='';  if(isSetObject(sessionMain.userInfoFrIP)){ IP=sessionMain.userInfoFrIP.IP; idIP=sessionMain.userInfoFrIP.idIP }
  var Val=[IP, idIP];
  var lastActivity=0, idSchedule=null, codeSchedule='';
  //if('idSchedule' in inObj )   eval(extractLocSome('inObj',['lastActivity', 'idSchedule', 'codeSchedule']));
  if('idSchedule' in inObj )   { lastActivity=inObj.lastActivity; idSchedule=inObj.idSchedule; codeSchedule=inObj.codeSchedule;}   Val.push(lastActivity, idSchedule, codeSchedule);

  //eval(extractLocSome('inObj',['title','MTab','unit','firstDayOfWeek','dateAlwaysInWOne','vNames','hFilter','dFilter','start']));
  var tmp=objectValuesSome(inObj, ['title','MTab','unit','firstDayOfWeek','dateAlwaysInWOne','start', 'vNames','hFilter','dFilter']);  array_mergeM(Val,tmp);

  Sql.push("CALL "+siteName+"save(?,?,?,?,?, ?,?,?,?,?,?,?,?,?);");
  //var Val=[]; Val.push(IP, idIP, lastActivity, idSchedule, codeSchedule, title, MTab, unit, firstDayOfWeek, dateAlwaysInWOne, start, vNames, hFilter, dFilter);
  var sql=Sql.join('\n'); 
  myQueryF(sql, Val, mysqlPool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var len=results.length; 
      if(len==2){
        var strTmp=results[0][0].mess; if(results[0][0].mess=='boOld') {strTmp="Someone else has changed the table, use reload to get the latest version";  } 
        self.mesO(strTmp);  callback('exited');  return;
      }
      var c=results[0][0].nUpd; if(c!=1) { self.mesO("updated rows: "+c); callback('exited');  return; }
      var rowA=results[len-2][0];
      rowA.lastActivity=
      copySome(Ou,rowA,['lastActivity', 'idSchedule', 'codeSchedule']);  
      callback(null, [Ou,'saveScheduleRet']);
    }
  });
}

ReqBE.prototype.deleteSchedule=function(callback,inObj){
  var self=this, req=this.req, site=req.site, siteName=req.siteName, sessionMain=this.sessionMain, {userTab, scheduleTab}=site.TableName;
  var Ou={}, Sql=[];

  if(isSetObject(sessionMain.userInfoFrIP)){
    var IP=sessionMain.userInfoFrIP.IP, idIP=sessionMain.userInfoFrIP.idIP, idSchedule=inObj.idSchedule;//,  idUser=sessionMain.userInfoFrDB.customer.idUser;

    Sql.push("CALL "+siteName+"delete(?,?,?);");
    //var Val=[]; Val.push(idUser, lastActivity, idSchedule, codeSchedule, title, MTab, unit, firstDayOfWeek, dateAlwaysInWOne, start, vNames, hFilter, dFilter);
    var Val=[]; Val.push(IP, idIP, idSchedule);
    var sql=Sql.join('\n'); 
    myQueryF(sql, Val, mysqlPool, function(err, results) {
      if(err){self.mesEO(err); callback('exited');  return; } 
      else{
        var len=results.length, rowLast=results[len-2];
        if('mess' in rowLast) { self.mesO(rowLast.mess); callback('exited');  return; }
        var c=results[0][0].nDelete; if(c!=1) { self.mesO(c+" schedules deleted"); callback('exited');  return; }
        callback(null, [Ou]);
      }
    });
  }  
}




ReqBE.prototype.go=function(){
  var self=this, req=this.req, res=this.res, site=req.site;

  getSessionMain.call(this); // sets this.sessionMain
  if(!this.sessionMain || typeof this.sessionMain!='object') { resetSessionMain.call(this); }  
  var redisVar=this.req.sessionID+'_Main', tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
    
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  
      //form.uploadDir='tmp';
      
      //var fT=thisChangedWArg(this.myStoreF, this, null);
      //var myStore=concat(fT);
      //form.onPart = function(part) { debugger
      //  if(!part.filename){  form.handlePart(part);  }  // let formidable handle all non-file parts
      //  //part.pipe(myStore);
      // }

      form.parse(req, function(err, fields, files) {
        if(err){self.mesEO(err);  return; } 
        else{
          self.File=files['fileToUpload[]'];
          if('captcha' in fields) self.captchaIn=fields.captcha; else self.captchaIn=''
          if('strName' in fields) self.strName=fields.strName; else self.strName=''
          if(!(self.File instanceof Array)) self.File=[self.File];
          self.jsonInput=fields.vec;
          Fiber( function(){ self.interpretInput.call(self); }).run();
        }
      });

    }else{  
      var myConcat=concat(function(buf){
        self.jsonInput=buf.toString();
        
        Fiber( function(){ self.interpretInput.call(self); }).run();
      });
      req.pipe(myConcat);
    }
  }
  else if(req.method=='GET'){
    var objUrl=url.parse(req.url), qs=objUrl.query||'';  self.jsonInput=urldecode(qs);   
    Fiber( function(){ self.interpretInput.call(self); }).run();
  }
}





ReqBE.prototype.interpretInput=function(){
  var self=this, req=this.req, res=this.res, site=req.site, sessionMain=this.sessionMain;

  res.setHeader("Content-type", "application/json");
    
  var jsonInput=this.jsonInput;
  try{
    var beArr=JSON.parse(jsonInput);
  }catch(e){
    console.log(e); res.out500('Error in JSON.parse, '+e); return;
  } 

    // Remove the beArr[i][0] values that are not functions
  var CSRFIn, caller='index';
  for(var i=beArr.length-1;i>=0;i--){ 
    var row=beArr[i];
    if(row[0]=='CSRFCode') {CSRFIn=row[1]; array_removeInd(beArr,i);}
  }

  var len=beArr.length;
  var StrInFunc=Array(len); for(var i=0;i<len;i++){StrInFunc[i]=beArr[i][0];}
  var arrCSRF, arrNoCSRF, allowed, boCheckCSRF, boSetNewCSRF;

           // Arrays of functions
    // Functions that changes something must check and refresh CSRF-code
  var arrCSRF=['createSchedule','deleteSchedule'];
  var arrNoCSRF=['specSetup','logout','getSchedule','saveSchedule','listSchedule'];
  allowed=arrCSRF.concat(arrNoCSRF);

    // Assign boCheckCSRF and boSetNewCSRF
  boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
  if(StrComp(StrInFunc,['getSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  if(StrComp(StrInFunc,['specSetup','listSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  if(StrComp(StrInFunc,['specSetup','listSchedule','getSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  

    // cecking/set CSRF-code
  var redisVar=this.req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    if(!CSRFIn){ var tmp='CSRFCode not set (try reload page)', error=new MyError(tmp); self.mesO(tmp); return;}
    var tmp=wrapRedisSendCommand('get',[redisVar]);
    if(CSRFIn!==tmp){ var tmp='CSRFCode err (try reload page)', error=new MyError(tmp); self.mesO(tmp); return;}
  }
  if(boSetNewCSRF) {
    var CSRFCode=randomHash();
    var tmp=wrapRedisSendCommand('set',[redisVar,CSRFCode]);   var tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
    self.GRet.CSRFCode=CSRFCode;
  }


/*
  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0]; 
    if(in_array(strFun,allowed)) { 
      var inObj=beArr[k][1];
      var tmpf; if(strFun in self) tmpf=self[strFun]; else tmpf=global[strFun];
      var fT=thisChangedWArg(tmpf, self, inObj);  Func.push(fT);
    }
  } 
  //if(self.checkIfUserInfoFrIP())  Func.push(  thisChangedWArg(self.specSetup, self, {Role:'vendor'})  );
  async.series(Func, function(err, results){
    if(err){ console.log('getData: uri: '+req.uri+', results: '+results+', err: '+err); }
    else {
      self.Out.dataArr=results;
      self.mesO();
    } 
  });
*/


  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0]; 
    if(in_array(strFun,allowed)) { 
      var inObj=beArr[k][1],     tmpf; if(strFun in self) tmpf=self[strFun]; else tmpf=global[strFun];     
      //var fT=thisChangedWArg(tmpf, self, inObj);   Func.push(fT);
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  var fiber = Fiber.current; 
  for(var k=0; k<Func.length; k++){
    var Tmp=Func[k], func=Tmp[0], inObj=Tmp[1];
    Func.semCB=0; Func.semY=0;
    func.call(self, function(err, result) { 
        if(err){ 
          self.boDoExit=1;
          if(err!='exited') { res.out500(err); }
        }
        else {
          self.Out.dataArr.push(result);
        }      
        if(Func.semY) { fiber.run(); } Func.semCB=1;
      }
      , inObj
    );
    if(!Func.semCB) { Func.semY=1; Fiber.yield();}
    if(self.boDoExit==1) return;
  }
  self.mesO();



}







