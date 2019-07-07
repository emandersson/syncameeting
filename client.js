/*
\$\('<([^>]+)>'
createElement('\1'

\$\("<([^>]+)>"
createElement('\1'

\.val\('([^\)]*)'\)
.value='\1'

\.val\(\)
.value

\.val\(([^\)]*)\)
.prop('value',\1)
.value=\1

\$\(([a-zA-Z0-9]+)\)
\$([a-zA-Z0-9]+)\[0\]
\1

$r
elR

$
(this)
parent()
clone
body
.index
.each
add
click
keypress
change
append
html
text
[]

.eq
\.eq\(([^\)]*)\)
[\1]
mouseover mouseout
.add(
.push(
nth-of-type
bind
data
\(([a-zA-Z0-9]+)\)\.
eq
append ->myAppend

index
not()
before
after
setVis
width()
height()
majax
pop
next()
.hasClass
.is(':empty')
originalEvent

myText\([^\)\,]+,[^\)]+\)
filter
.find

.children
.children.forEach

oAJAX
* extend
*/



"use strict"
window.onload=function(){


  //
  // History stuff
  //

app.histGoTo=function(view){}
app.doHistBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0, indNew);
  history.StateMy[indNew]=obj;
}
app.doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
app.changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
app.getHistStatName=function(){
  return history.StateMy[history.state.ind].view.toString();
}
history.distToGoal=function(viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var view; if(typeof obj=='object') view=obj.view; else continue;
    if(view===viewGoal) {indGoal=i; break;}
  }
  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function(viewGoal, boRefreshHash){
  var dist=history.distToGoal(viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}



var createColJIndexNamesObj=function(arrName){
  var o={};
  for(var i=0;i<arrName.length;i++){ 
    var tmp="j"+arrName[i][0].toUpperCase()+arrName[i].substr(1);       o[tmp]=i;
  }
  return o;
}


var createChildInd=function(arrI){
  var arrO=[]; for(var i=0;i<arrI.length;i++){  var itmp=arrI[i];  arrO[itmp]=i;  }  return arrO;
}

Date.prototype.dayOfYear=function(){
  var tjJan1 = new Date(this.getFullYear(),0,1);
  var daynum = Math.floor(    (   this.getTime()-tjJan1.getTime() - (this.getTimezoneOffset()-tjJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;
  return daynum;
}

//
// Returns the week number for this date. 
// Parameters:
// firstDayOfWeek can be from 0 to 6. If firstDayOfWeek (0 is Sunday, 1 is Monday ...).
// dateAlwaysInWOne is the date in January that is always in week 1 (For US: 1, for IS08601: 4)
// boRewriteWeekNames should be true if one would like to rewrite the year-shift-week to have a single name (belonging to what ever year it lies mostly in) (For US: 0, for IS08601: 1)
//
Date.prototype.getWeek = function (firstDayOfWeek=0,dateAlwaysInWOne=1,boRewriteWeekNames=0) {
        // tj="javascript time", dow="day of week"
  //firstDayOfWeek = typeof firstDayOfWeek != 'undefined' ? firstDayOfWeek : 0; //default firstDayOfWeek to zero
  var tjJan1 = new Date(this.getFullYear(),0,1);
  var DOWJan1=(tjJan1.getDay()-firstDayOfWeek+7)%7; 
  var dayNow = Math.floor(    (   this.getTime()-tjJan1.getTime() - (this.getTimezoneOffset()-tjJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;
  
  var DOWNow=DOWJan1+dayNow-1;
  var DOWDateAlwaysInW1=DOWJan1+dateAlwaysInWOne-1;
  var weekDateAlwaysInW1Floor=Math.floor(DOWDateAlwaysInW1/7); //if one just makes a floor one gets this value
  var weekErr=1-weekDateAlwaysInW1Floor;  //Error (difference between the real value and the (erratic) floored value)

  var weeknum = Math.floor((DOWJan1+dayNow-1)/7)+weekErr;

  if(boRewriteWeekNames){
    if(weeknum >= 52) { //This "if" is for crude selection only (saves a bit com computaion though)
      var tjNextJan1 = new Date(this.getFullYear()+1,0,1);
      var DOWNextJan1 = (tjNextJan1.getDay()-firstDayOfWeek+7)%7;
      var dayNextNow = Math.floor(    (   this.getTime()-tjNextJan1.getTime() - (this.getTimezoneOffset()-tjNextJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;  
      var dayDiff=1-dayNextNow;
      if(dayDiff<=DOWNextJan1 && DOWNextJan1<=3 ){weeknum=1; }  // If close to next year shift and (next years) Jan1 is early in the week
    }
    else if(weeknum <= 1) { //This "if" is for crude selection only (saves a bit com computaion though)
      var tjDec31 = new Date(this.getFullYear()-1,11,31);
      var weekDec31=tjDec31.getWeek(firstDayOfWeek,dateAlwaysInWOne,boRewriteWeekNames);
      //var tjPrevJan1 = new Date(this.getFullYear()-1,0,1);
      //var DOWPrevJan1 = (tjPrevJan1.getDay()-firstDayOfWeek+7)%7;
      var dayDiff=dayNow-1;
      var daysOfWeekRemainingAtJan1=6-DOWJan1; // Week days remaining at Jan1  
      if(dayDiff<=daysOfWeekRemainingAtJan1 && DOWJan1>=3 ){weeknum=weekDec31; }  // If close to prev year shift and Jan1 is late in the week
    }
  }

  return weeknum;
};  

// Test code: t1=new Date('2008-12-27');sch.start=t1.valueOf()/1000




/*******************************************************************************************************************
 * My popup
 *******************************************************************************************************************/


var popUpExtend=function(el){
  el.openPop=function() {
    el.append(spanMessageText);
    container.empty().append(el);  elBody.append(blanket);  elBody.append(container);
  }
  el.closePop=function() {  el.remove();  container.remove();  blanket.remove();  elBody.append(spanMessageText);  }

  el.addClass('Center');
  var blanket=createElement('div').addClass('blanket');
  var container=createElement('div').addClass('Center-Container');
  return el;
}




var toggleButtonExtend=function(el){
  el.setStat=function(bo1){
    if(bo1==0) {el.css(o0);} else {el.css(o1);} 
    el.attr({boOn:bo1});
  }
  var o0={background:'url('+uVipp0+') no-repeat'}, o1={background:'url('+uVipp1+') no-repeat'};
    
  el.attr({boOn:0});
  el.css({'background':'url('+uVipp0+') no-repeat',height:'33px',width:'90px',zoom:'60%','vertical-align':'-0.5em',cursor:'pointer',display:'inline-block'}).addClass('unselectable');
  el.on('click',function(){var t=1-el.attr('boOn');   el.setStat(t);});
  return el;
}


/*******************************************************************************************************************
 * Some loose functions
 *******************************************************************************************************************/
 
var spanMessageTextCreate=function(){
  var el=createElement('span');
  var spanInner=createElement('span');
  el.appendChild(spanInner, imgBusy)
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    spanInner.myText(' ');
    imgBusy.hide();
  }
  el.setMess=function(str,time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    imgBusy.toggle(Boolean(boRot));
  };
  el.setHtml=function(str,time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    imgBusy.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');//.css({'z-index':8100,position:'fixed'});
  return el;
}


var loginReturnList=function(){  //   after 'loginbutt'->'loginScreen' or 'delete'->'loginScreen'
  if(isSetObject(userInfoFrIP)) {var vec=[['listSchedule']]; majax(oAJAX,vec); }
}

app.loginReturn=function(userInfoFrIPT,userInfoFrDBT,fun,strMess,CSRFCodeT){
  CSRFCode=CSRFCodeT;

  var tmp=['idIP','IP','nameIP','nickIP']; userInfoFrIP={};
  for(var i=0; i<tmp.length ;i++){ userInfoFrIP[tmp[i]]=userInfoFrIPT[tmp[i]];   }
  
  var tmp=['idUser','IP','idIP','nameIP','nickIP','created'];
  if(typeof userInfoFrDBT.customer == 'undefined' || typeof userInfoFrDBT.customer == 'unknown' || typeof userInfoFrDBT.customer == 'number') {}else{
    userInfoFrDB.customer={};
    for(var i=0; i<tmp.length ;i++){ userInfoFrDB.customer[tmp[i]]=userInfoFrDBT.customer[tmp[i]];   }   
  }
  
  resetMess();
  loginInfo.setStat();
  toggleSpecialistButts(isSetObject(userInfoFrIP));
  loginDiv.closeFunc();

  if(loginReturn2) loginReturn2();
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * loginDivExtend
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var loginDivExtend=function(el){ //popup for logging in as admin/sponsor...

  var popupWin=function(IP,openid) {
    //e.preventDefault();
    pendingMess.show(); cancelMess.hide();
    
    //var strFile='loginStart.php';
    var strFile=leafLogin;
    //var arrQ=['IP='+IP, 'fileReturn='+encodeURIComponent(leafLogin+'?fun='+strType+'Fun')];
    var strType='customer'
    var arrQ=['IP='+IP, 'fileReturn='+leafLogin,'fun='+strType+'Fun'];
    if(IP==='openid') arrQ.push('openid_identifier='+encodeURIComponent(openid));
    var uPop=strFile+'?'+arrQ.join('&');
    el.win=window.open(uPop, 'popup', 'width=580,height=400');

    clearInterval(timerClosePoll);
    timerClosePoll = setInterval(function() { if(el.win.closed){ clearInterval(timerClosePoll); pendingMess.hide(); cancelMess.show(); }  }, 500);  
    return 0;
  }

  el.openFunc=function(){
    pendingMess.hide(); cancelMess.hide(); 
    el.openPop();  
  }
  el.setLoggedIn=function(){  }
  el.setLoggedOut=function(){   }
  el.setLoggedStat=function(){ 
    clearInterval(timerClosePoll);  //pendingMess.hide(); cancelMess.hide(); 
  }
  el.setHead=function(str){
    head.myText(str);
    return el;
  }
  el.closeFunc=function(){ clearInterval(timerClosePoll);   el.closePop();    }
  var timerClosePoll;
  
  el=popUpExtend(el); 
  el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em'});  
  //el.css({ width:'25em', padding: '1.2em'});  
  
  var strType;
  
  var headHelp=imgHelp.cloneNode().css({'margin-left':'1em'}),  bub=createElement('div').myHtml(langHtml.loginDiv.headHelp);     popupHover(headHelp,bub);  
  var head=createElement('span').myAppend(langHtml.loginDiv.loginMethods);
  var pHead=createElement('p').myAppendB(head,headHelp);

  
  var strButtonSize='2em';
  var fbIm=createElement('img').on('click', function(){popupWin('fb','');}).prop({src:uFB}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize});
  var fbHelp=imgHelp.cloneNode().css({margin:'0 0 0 1em'}),  bub=createElement('div').myHtml(langHtml.loginDiv.fbComment);     popupHover(fbHelp,bub);  

  var googleIm=createElement('img').prop({src:uGoogle}).on('click', function(){popupWin('google','');}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em'}); 

  var openIDIm=createElement('img').prop({src:uOID22}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em',background:'white'}); 
  openIDIm.on('click', function(){p2.toggle();});
  var p1=createElement('p').myAppend(fbIm); // ,googleIm,openIDIm

  var cancel=createElement('button').on('click', function(){el.closePop();}).myText(langHtml.Cancel);//.css({'margin-top':'1.5em'});
  //if(boSharp) p2='';
  [p1,cancel].forEach(ele=>ele.css({'margin-top':'1.5em', 'margin-right':'1.5em'})); // p2
  
  var pendingMess=createElement('span').hide().myAppend(langHtml.loginDiv.pendingMess,' ',imgBusy.cloneNode());
  var cancelMess=createElement('span').hide().myAppend(langHtml.loginDiv.cancelMess);
  
  el.append(pHead,p1,cancel,pendingMess,cancelMess);  //,p2
  el.css({'text-align':'left'});
  return el;

}




/*******************************************************************************************************************
 * top-line-div
 *******************************************************************************************************************/
var loginInfoExtend=function(el){
  el.setStat=function(){
    var boShow=0,arrKind=[];
    var boShow=isSetObject(userInfoFrIP);
    if(boShow){
      spanName.myText(userInfoFrIP.nameIP);
      //spanKind.myText('('+arrKind.join(', ')+')');
      //el.css({visibility:''});
      el.show();
    }else {
      //el.css({visibility:'hidden'});
      el.hide();
    } 
  }
  var spanName=createElement('span'), spanKind=createElement('span'); 
  var logoutButt=createElement('button').myText(langHtml.loginInfo.logoutButt).css({'float':'right','font-size':'90%'});
  logoutButt.on('click', function(){ 
    userInfoFrIP={}; 
    var vec=[['logout']];   majax(oAJAX,vec); 
    //idSchedule=null; codeSchedule=''; lastActivity=0;
    return false;
  });
  
  el.myAppend(spanName,' ',spanKind,' ',logoutButt);
  el.hide();
  return el;
}





var toggleSpecialistButts=function(boIn){
  var boIn=Boolean(boIn);  
  scheduleList.toggle(boIn); loginButt.toggle(!boIn);
  //if(boIn) {scheduleList.show(); loginButt.hide();}  else {scheduleList.hide(); loginButt.show();}
}


var scheduleExtend=function(el){
  var dayStart=function(tu){
    var tj=new Date(tu*1000),st=Number(tj.setHours(0,0,0,0))/1000; return st; }
  var weekStart = function(tu) {
    var tj=new Date(tu*1000);
    var DOW=(tj.getDay()-el.firstDayOfWeek+7)%7;
    var st=Number(tj.setHours(0,0,0,0))/1000 - DOW*24*60*60;     
    return st;
  }
  
  el.calcStart=function(tApprox,unit){
    if(tApprox===0) {var tmp=new Date(); tApprox=tmp/1000;} 
    if(unit=='w') tmp=weekStart(tApprox); else tmp=dayStart(tApprox); return tmp;
  }

  el.M2Table=function(){
    //el.thead.empty();  
    el.tbody.empty().detach();
    //var fragment = document.createDocumentFragment();
    
    if(el.vTime!=null) {
      var elRY=createElement('tr').myAppend(createElement('th').myText('Year')), elRM=createElement('tr').myAppend(createElement('th').myText('Month')), elRD=createElement('tr').myAppend(createElement('th').myText('Date'));
      var elRW=createElement('tr').myAppend(createElement('th').myText('Week')), elRN=createElement('tr').myAppend(createElement('th').myText('Day')), elRH=createElement('tr').myAppend(createElement('th').myText('Hour'));
      if(el.unit=='l') elRH.children[0].myText('Lecture');
      var tHl='', tNl='', tWl='', tDl='', tMl='', tYl='';
      var cSpanH=1,cSpanN=1,cSpanW=1,cSpanD=1,cSpanM=1,cSpanY=1;
      for(var j=0;j<el.vTime.length;j++) { 
        var tmp,t=new Date(el.vTime[j]*1000);
        var boRewriteWeekNames=0; if(el.dateAlwaysInWOne==4) {boRewriteWeekNames=1;}
        var tH=t.getHours(), tN=arrDayName[t.getDay()], tW=t.getWeek(el.firstDayOfWeek,el.dateAlwaysInWOne,boRewriteWeekNames), tD=t.getDate(), 
            tM=arrMonthName[t.getMonth()], tY=t.getFullYear();
        if(tH!==tHl) {var hH=createElement('th').myText(tH); elRH.append(hH);cSpanH=1;} else {cSpanH++;hH.attr({colspan:cSpanH});}
        if(tN!==tNl) {var hN=createElement('th').myText(tN); elRN.append(hN);cSpanN=1;} else {cSpanN++;hN.attr({colspan:cSpanN});}
        if(tW!==tWl) {var hW=createElement('th').myText(tW); elRW.append(hW);cSpanW=1;} else {cSpanW++;hW.attr({colspan:cSpanW});}
        if(tD!==tDl) {var hD=createElement('th').myText(tD); elRD.append(hD);cSpanD=1;} else {cSpanD++;hD.attr({colspan:cSpanD});}
        if(tM!==tMl) {var hM=createElement('th').myText(tM); elRM.append(hM);cSpanM=1;} else {cSpanM++;hM.attr({colspan:cSpanM});}
        if(tY!==tYl) {var hY=createElement('th').myText(tY); elRY.append(hY);cSpanY=1;} else {cSpanY++;hY.attr({colspan:cSpanY});}
        tHl=tH;tNl=tN;tWl=tW;tDl=tD;tMl=tM;tYl=tY;
      }
      if(el.unit=='d') elRH='';
      if(el.unit=='w') {elRD=''; elRN=''; elRH='';}
      el.thead.empty().append(elRY,elRM,elRD,elRW,elRN,elRH);
    }
    var makeKeyUpFunc=function(i){return function(){ el.vNames[i]=this.value;}}
    if(el.MTab!=null && el.vNames!=null) {
      for(var i=0;i<el.MTab.length;i++) {
        
        var del=createElement('div').myAppend('✖').css(cssDeleteButtonMouseOut).css({cursor:'pointer', 'font-size':'1.5em', display:'inline-block','margin-left':'0.5em'}).on('click', makeRemovePersonFunc(i))
                .on('mouseover', function(){this.css(cssDeleteButtonMouseOver);}).on('mouseout', function(){this.css(cssDeleteButtonMouseOut);});
        var input=createElement('input').prop({type:'text', placeholder:"Name"}).prop('value',el.vNames[i]).on('keyup', makeKeyUpFunc(i));
        
        var row=createElement('tr'),td=createElement('td').myAppend(del,' ',input).css({'white-space':'nowrap'});
        row.append(td); 
        for(var j=0;j<el.MTab[i].length;j++) { 
          var tmp,eTmp=el.MTab[i][j];
          if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
          var td=createElement('td').css({'background-color':tmp}).on('click', makeCellClickFunc(i,j));
          //td.myState=eTmp;
          
          row.append(td); 
        }
        el.tbody.append(row);
      }
    }
    var button=createElement('button').myText('+').on('click', addPerson), td=createElement('td').css({'text-align':'center'}).myAppend(button), row=createElement('tr').myAppend(td);

    el.tbody.append(row);
    el.append(el.tbody);
    

    
  }
  
  var addPerson=function(){
    var nRows=el.MTab.length,nCols=el.vTime.length;
    var arrTmp=[]; for(var j=0;j<nCols;j++){arrTmp[j]=enumVoid;}
    el.MTab.push(arrTmp); el.vNames.push('');   el.M2Table();
  }
  var makeRemovePersonFunc=function(iRemove){
    return function(){
      var nRows=el.MTab.length,nCols=el.vTime.length, nRowsN=nRows-1;
      var MTabN=[], vNamesN=[];
      for(var i=0;i<nRows;i++){ 
        if(i!=iRemove){
          MTabN.push(el.MTab[i]);
          vNamesN.push(el.vNames[i]);
        }
      }
      el.MTab=MTabN;el.vNames=vNamesN;   el.M2Table();
    }
  }
  var makeCellClickFunc=function(i,j){ return function(){
    //var eTmp=(this.myState+1)%2, tmp;
    var eTmp=(el.MTab[i][j]+1)%2,tmp;
    el.MTab[i][j]=eTmp;      
    //this.myState=eTmp;
    //if(eTmp==enumY) tmp='classYes'; else if(eTmp==enumN) tmp='classNo'; else tmp='';
    if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
    this.css({'background-color':tmp});
  }}
   

  el.calcVTime= function(startN,unitN,nCols,nStChange,nColsChange){ 
    var vTimeN=[], endN;
    if(startN==='') startN=el.vTime[0];
    if(unitN==='') unitN=el.unit;
    //var dirStChange=sign(nStChange), absStChange=Math.abs(nStChange);
    var dirStChange=nStChange>0?1:-1, absStChange=Math.abs(nStChange);
    var iChange=0;
    var startT=new Date(startN*1000);
    
    var iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=el.dFilter[day] || unitN=='w';
      if(boTmp1 && boTmp2) { if(iChange==absStChange){ startN=startT/1000; break;} else iChange++;} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+dirStChange); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+dirStChange); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+dirStChange*7); }
      if(iAvoidInfiniteLoop>10000) debugger;
    }
    el.start=startN;

    if(nCols==='') nCols=el.MTab[0].length; nCols+=nColsChange; if(nCols<0) nCols=0;
    var startT=new Date(startN*1000);
    iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=el.dFilter[day] || unitN=='w';
      if ( boTmp1 && boTmp2) { var tmp=startT/1000; vTimeN.push(tmp); if(vTimeN.length>=nCols){endN=tmp;break;}} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+1); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+1); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+7); };
       if(iAvoidInfiniteLoop>10000) debugger;
    }
    return vTimeN;
  }

  el.convertMTab= function(unitN,vTimeN){  //el.unit, el.hFilter, el.dFilter   => el.start, vTime, el.MTab, 
    var nRows=el.MTab.length;
    var MTabN=[], nColsN=vTimeN.length;   
    if(unitN==='') unitN=el.unitN;
    if(unitN==el.unitN){      
      for(var i=0;i<nRows;i++){ 
        MTabN[i]=[];
        for(var j=0;j<nColsN;j++){
          var tmp=vTimeN[j];
          //confirm(el.vTime +' '+ tmp);  
          
          var jO=el.vTime.indexOf(tmp); 
          if(jO!=-1) tmp=el.MTab[i][jO]; else tmp=enumVoid;   MTabN[i][j]=tmp;    
        }
      }
    }else{
      for(var i=0;i<nRows;i++){  MTabN[i]=[];  for(var j=0;j<nColsN;j++){MTabN[i][j]=enumVoid;}  }
    }
    el.MTab=MTabN;
  }
  el.setDefaultHFilter=function(){for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i>=8 && i<=16) el.hFilter[i]=1;}  }
  el.setDefaultHFilterL=function(){for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i>=1 && i<=8) el.hFilter[i]=1;}  }
  el.setDefaultDFilter=function(){for(var i=0;i<7;i++){el.dFilter[i]=0;  if(i>=1 && i<=5) el.dFilter[i]=1;}  }
  el.setDefaultFilters=function(){
    if(el.unit=='l') { el.setDefaultHFilterL();}    else if(el.unit=='h') {el.setDefaultHFilter(); } 
    if(el.unit=='l' || el.unit=='h' || el.unit=='d') {el.setDefaultDFilter();} 
  }
  el.setFilterUI=function(){
    lectureFilter.hide(); hourFilter.hide(); dayFilter.hide();
    if(el.unit=='l') {  lectureFilter.show();  lectureFilter.setUpSel();  }  
    else if(el.unit=='h') {  hourFilter.show();  hourFilter.setUpButtStat();  } 

    if(el.unit=='l' || el.unit=='h' || el.unit=='d') {dayFilter.show(); dayFilter.setUpButtStat(); } 

    firstDayOfWeek.setUp(el.firstDayOfWeek);
    dateAlwaysInWOne.setUp(el.dateAlwaysInWOne);

    var tmp="input[value='"+el.unit+"']";
    unitSelector.querySelector(tmp).attr({checked:1});
  }
  
  el.save=function(e){
    //e.stopPropagation();
    if(isSetObject(userInfoFrIP) || idSchedule)     {
      var o={unit:el.unit, firstDayOfWeek:el.firstDayOfWeek, dateAlwaysInWOne:el.dateAlwaysInWOne, start:el.start, lastActivity:lastActivity};
      if(idSchedule!==null) o.idSchedule=idSchedule;
      if(codeSchedule!=='') o.codeSchedule=codeSchedule;
      o.title=inpTitle.value.trim();
      o.MTab=JSON.stringify(sch.MTab);
      o.vNames=JSON.stringify(sch.vNames);
      o.hFilter=JSON.stringify(sch.hFilter);
      o.dFilter=JSON.stringify(sch.dFilter);
      setMess('saving',10,1);
      var vec=[['saveSchedule',o],['listSchedule']]; 
      majax(oAJAX,vec);  
    }
    else {
      loginReturn2=function(){
        sch.save();
      }
      loginDiv.openFunc();
    }
  }
  window.saveScheduleRet=function(data){
    idSchedule=data.idSchedule;
    codeSchedule=data.codeSchedule;
    lastActivity=data.lastActivity;
  }

  
  el.getScheduleRet=function(data){
    var row=data.row;
    //confirm(print_r(row)); 
    for(var k in row){
      if(k!='idSchedule' && k!='codeSchedule' && k!='unit' && k!='title') {
        var data; try{ data=JSON.parse(row[k]); }catch(e){ setMess(e);  return; }
        row[k]=data;
      }
      //confirm(print_r(row[k])); 
    }
    if(typeof row!=='undefined') {
       
      idSchedule=row.idSchedule;
      codeSchedule=row.codeSchedule;
      //IP=row.IP;   idIP=row.idIP;
      lastActivity=row.lastActivity;

      inpTitle.value=row.title;
      el.MTab=row.MTab;
      el.unit=row.unit;
      el.firstDayOfWeek=row.firstDayOfWeek;
      el.dateAlwaysInWOne=row.dateAlwaysInWOne;
      el.start=row.start;
      el.vNames=row.vNames;
      el.hFilter=row.hFilter;
      el.dFilter=row.dFilter;
    } else row=[]; 

    el.start=el.calcStart(el.start,el.unit);
    el.vTime=el.calcVTime(el.start,'','',0,0);
    el.setFilterUI();
    el.M2Table();

  }
  el.revert=function(){
    if(idSchedule) vec[2]=['getSchedule',{idSchedule:idSchedule},el.getScheduleRet];   majax(oAJAX,vec); 
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  el.inputTitle=createElement('input').prop({'type':'text', placeholder:"Title"});
  el.butTitle=createElement('button').myAppend('✎');
  //el.caption=createElement('caption').myAppend(el.inputTitle, el.butTitle);
  el.tbody=createElement('tbody'); el.thead=createElement('thead');
  el.append(el.thead,el.tbody);
  
  el.hFilter=[],el.dFilter=[],el.MTab=[],el.vNames=[],el.firstDayOfWeek=1,el.dateAlwaysInWOne=4,el.unit='d';
  
  for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i<16 && i>=8) el.hFilter[i]=1;}
  for(var i=0;i<7;i++){el.dFilter[i]=0;  if(i>=1 && i<=5) el.dFilter[i]=1;}

  el.MTab=[];el.vNames=[];
  for(var i=0;i<5;i++){
    el.vNames[i]=""; el.MTab[i]=[];
    for(var j=0;j<14;j++){ el.MTab[i][j]=enumVoid; }
  }
  var tmp=new Date();
  el.start=el.calcStart(tmp/1000,el.unit);
  el.vTime=el.calcVTime(el.start,'','',0,0);
  el.M2Table();

  return el;
}
///////////////////////////////////////////////////////////////////////////////
// End of scheduleExtend
///////////////////////////////////////////////////////////////////////////////

var loginButtExtend=function(el){
  el.myText('Login').on('click', function(){loginReturn2=loginReturnList; loginDiv.openFunc();});
  return el;
}

var unitSelectorExtend=function(el){
  el.setUpButtStat=function(){
    //var b=el.children("input[value='"+sch.unit+"']"); b.attr({checked:1});
    //sch.setUnit(sch.unit);
    sch.setFilterUI();
    //for(var i=0;i<4;i++){  var b=el.children('input:eq('+i+')');  if(sch.hFilter[i]==1) b.css(el.colOn); else b.css(el.colOff);  }
  }
  var makeFunc=function(u){return function(){ 
    //sch.setUnit(u);
    sch.unit=u; sch.setDefaultFilters(); sch.setFilterUI();
    var startN=sch.calcStart(0,u), vTimeN=sch.calcVTime(startN,'',20,0,0);
    sch.convertMTab(u,vTimeN);  sch.unit=u; sch.vTime=vTimeN;
    sch.M2Table(); return 0;}}
  el.empty();
  var buttL=createElement('input').attr({type:'radio',name:'unit'}).prop('value','l').on('change', makeFunc('l'));
  var buttH=createElement('input').attr({type:'radio',name:'unit'}).prop('value','h').on('change', makeFunc('h'));
  var buttD=createElement('input').attr({type:'radio',name:'unit'}).prop('value','d').on('change', makeFunc('d'));
  var buttW=createElement('input').attr({type:'radio',name:'unit'}).prop('value','w').on('change', makeFunc('w'));
  var divLabel=createElement('div').myText('Calender resolution:').css({'font-weight':'bold'});
  el.myAppend(divLabel ,buttL,'lectures ',buttH,'hours ',buttD,'days ',buttW,'weeks');
  return el;
}

var lectureFilterExtend=function(el){
  el.setUpSel=function(){
    var iSel=0;
    for(var i=0;i<nLec;i++){
      if(sch.hFilter[i]) iSel=i;
    }
    //var o=el.find('option:eq('+(iSel-1)+')'); 
    var o=sel[iSel-1];  // This looks a bit ugly, but I think it works because iSel will never be 0. (sch.hFilter[0] will always be 0)
    o.attr('selected', 1);
  }
  var nLec=10;
  var sel=createElement('select');
  for(var i=0;i<nLec;i++){  
    var opt=createElement('option').prop('value',i+1).myText(i+1);
    sel.append(opt);
  }
  sel.on('change', function(){
    var arrtmp=[], tmp=sel.value;
    for(var i=0;i<24;i++) {if(i>=1 && i<=tmp) arrtmp[i]=1; else arrtmp[i]=0;}; 
    sch.hFilter=arrtmp;
    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
    el.setUpSel();
  });
  var spanLabel=createElement('span').myText('Number of lectures per day: ').css({'font-weight':'bold'});
  el.append(spanLabel,sel);
  
  return el;
}

var hourFilterExtend=function(el){
  el.setUpButtStat=function(){
    for(var i=0;i<24;i++){
      //var b=el.children('button:eq('+i+')');
      var b=arrButt[i];
      if(sch.hFilter[i]==1) b.css(el.colOn); else b.css(el.colOff);
    }
  }
  el.colOn={background:'#4f4'};el.colOff={background:'#eee'};
  var makeFunc=function(i){ return function(){ 
    sch.hFilter[i]=1-sch.hFilter[i]; 
    var anyOn=0; for(var j=0;j<sch.hFilter.length;j++){if(sch.hFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {sch.hFilter[i]=1-sch.hFilter[i]; } // At least one has to be 'on'

    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
    el.setUpButtStat();
    
  };  } 
  var spanLabel=createElement('span').myText('Only include certain hours: ').css({'font-weight':'bold'});
  el.append(spanLabel);
  var arrButt=Array(24);
  for(var i=0;i<24;i++){ var but=createElement('button').myText(i).on('click', makeFunc(i));  arrButt[i]=but; el.append(but);}
  
  return el;
}

var dayFilterExtend=function(el){
  el.setUpButtStat=function(){
    for(var i=0;i<7;i++){
      //var b=el.children('button:eq('+i+')');
      var b=arrButt[i];
      if(sch.dFilter[i]==1) b.css(el.colOn); else b.css(el.colOff);
    }
  }
  var makeFunc=function(i){ return function(){
    sch.dFilter[i]=1-sch.dFilter[i]; 
    var anyOn=0; for(var j=0;j<7;j++){if(sch.dFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {sch.dFilter[i]=1-sch.dFilter[i]; } // At least one has to be 'on'
    if(sch.dFilter[i]) this.css(el.colOn); else this.css(el.colOff);
    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
  };  } 
  el.colOn={background:'#4f4'};el.colOff={background:'#eee'};
  var divLabel=createElement('div').myText('Mark the week days to be included: ').css({'font-weight':'bold'});
  el.append(divLabel);
  var arrButt=Array(7);
  for(var i=0;i<7;i++){ var but=createElement('button').myText(arrDayName[i]).css({'margin-right':'0.70em', width:'1.5em', padding:'1px 0'}).on('click', makeFunc(i));  arrButt[i]=but;  el.append(but);}
  return el;
}



var firstDayOfWeekExtend=function(el){
  el.setUp=function(i){
    //var o=el.find('option:eq('+i+')'); 
    var o=sel[i]; 
    o.attr('selected', 1);
  }
  var sel=createElement('select').css({'font-size':'95%', 'letter-spacing':'-0.05em'}).on('change', function(){
    sch.firstDayOfWeek=Number(sel.value); 
    sch.M2Table();});
  var arrWeekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  for(var i=0;i<arrWeekDays.length;i++) {
    var opt=createElement('option').prop('value',i).myText(arrWeekDays[i]); sel.append(opt);
  }
  //sel.children('option:eq(1)').attr('selected', 1);
  sel[1].selected=1; 
  var spanLabel=createElement('span').myText('First day of the week: ').css({'font-weight':'bold'});
  el.append(spanLabel,sel);
  return el;
}

var dateAlwaysInWOneExtend=function(el){
  el.setUp=function(i){
    var o=el.querySelector("[type='radio'][value='"+i+"']"); 
    o.attr('checked', true);
  }
  var makeFunc=function(d){return function(){ 
    sch.dateAlwaysInWOne=Number(d);    sch.M2Table(); return 0;
  }}
  var elR0=createElement('input').attr({type:'radio',name:'dateAlwaysInWOne'}).prop('value',1).on('change', makeFunc(1));
  var elR1=createElement('input').attr({type:'radio',name:'dateAlwaysInWOne'}).prop('value',4).on('change', makeFunc(4));
  
  
  var spanLabel=createElement('span').myAppend('Week numbering: ').css({'font-weight':'bold'});
  var d0=createElement('div').myAppend(elR0,"Week #1 is the week that contains Jan 1 (used in America, Asia ...)");
  var d1=createElement('div').myAppend(elR1,"Week #1 is the first week that mainly lies in the new year (the week that contains Jan 4) (used in some EU countries)");
  var tmp=[d0,d1]; tmp.forEach(ele=>ele.css({margin:'1em 0'}));
  el.append(spanLabel, ...tmp);
  elR1.attr('checked',1);
  return el;
}


var settingsDivExtend=function(el){
  var spanLabelStart=createElement('span').myAppend('Change start of period: ').css({'font-weight':'bold'});
  var spanLabelLength=createElement('span').myAppend('Change length of period: ').css({'font-weight':'bold'});
  var divStart=createElement('div').myAppend(spanLabelStart, buttStEarlier, buttStLater).css({margin:'1em 0'});
  var divLength=createElement('div').myAppend(spanLabelLength, buttDecCols, buttIncCols);
  var peroidDiv=createElement('div').myAppend(divStart, divLength);

  //✖
  //var butClose=createElement('button').myText('≪').css({margin:'0em', position:'relative', right:'-50%', 'font-size':'1.5em', width:'1.5em', height:'1.5em', bottom:'0.75em'}).on('click',function(){
    //history.back();
  //});
  var butClose=createElement('button').myText('≪').css({margin:'0em', position:'relative', right:'-50%', 'font-size':'inherit'}).on('click',function(){
    history.back();
  }); //, 'border-radius':'50%', border:'solid 1px grey'
  //var divClose=createElement('div').myAppend(butClose).css({ display:'flex', 'flex-direction':'row-reverse'});

  var tmp=[unitSelector, dayFilter, firstDayOfWeek, dateAlwaysInWOne, lectureFilter, hourFilter, peroidDiv];  // titleInp
  tmp.forEach(ele=>ele.css({'margin':'1em 0.4em 1em 0.4em'}));
  unitSelector.css({'margin':'1.5em 0.4em 1em 0.4em'})
  //titleInp.css({'margin-top':'0em'});
  //divClose.css({'margin':'0em'});
  el.append(...tmp);
  var divCont=createElement('div').addClass('contDiv').myAppend(...tmp);
  var divFoot=createElement('div').myAppend(butClose).addClass('footDiv').css({'justify-content':'center', 'align-items':'flex-end', height:'0px', padding:'0em', 'border-top':'0px', 'font-size':'1.5em'}); //,overflow:'hidden'
  
  el.append(divCont, divFoot);
  el.css({display:'flex', 'flex-direction':'column'});
  return el;
}





var deleteConfirmPopExtend=function(el){
  var el=popUpExtend(el);
  el.setup=function(idScheduleRowT){idScheduleRow=idScheduleRowT;}
  el.yes=createElement('button').myText('Yes').on('click', function(){
    var vec=[['deleteSchedule',{idSchedule:idScheduleRow}],['listSchedule']];   majax(oAJAX,vec);
    if(idScheduleRow===idSchedule) { idSchedule=''; codeSchedule='';}
    el.closePop();
  });
  var idScheduleRow;
  var cancel=createElement('button').myText("Cancel").on('click', el.closePop);
  var divA=createElement('div').myText("Do you really want to delete this schedule?");
  el.append(divA,el.yes,cancel);
  el.css({padding:'1.1em'});
  return el;
}

var scheduleListExtend=function(el){
  var makeDeleteFunc=function(i){return function(){ 
    if(isSetObject(userInfoFrIP)){
      deleteConfirmPop.setup(i); deleteConfirmPop.openPop(); deleteConfirmPop.yes.focus();
    }
    else {
      loginReturn2=loginReturnList;
      loginDiv.openFunc();
    }
  };}
  window.listScheduleRet=function(data){
    //return;
    tmp=data.tab;   if(typeof tmp==="undefined") tmp=[]; tab=tmp; el.tab=tab;
    tbody.empty();
    
    for(var i=0;i<tab.length;i++){   
      var idSchedule=tab[i][jIdSchedule], tmp2=tab[i][jCodeSchedule];
      var tmp=uFE+'?idSchedule='+idSchedule+'&codeSchedule='+tmp2;
      var alink=createElement('a').attr({href:tmp}).myAppend(tmp);
      var del=createElement('div').myText('✖').css(cssDeleteButtonMouseOut).css({cursor:'pointer', 'font-size':'1.5em'}).on('click', makeDeleteFunc(idSchedule))
                .on('mouseover', function(){this.css(cssDeleteButtonMouseOver);}).on('mouseout', function(){this.css(cssDeleteButtonMouseOut);});
      var arrRow=[createElement('td').myAppend(del), createElement('td').myAppend(alink), createElement('td').myAppend(tab[i][jTitle]), createElement('td').myAppend(swedDate(tab[i][jCreated])),
        createElement('td').myAppend(swedDate(tab[i][jLastActivity]))];
      var tr=createElement('tr').myAppend(...arrRow);
      tbody.append(tr);
    }
    table.toggle(Boolean(tab.length));
    toggleSpecialistButts(isSetObject(userInfoFrIP));
    var Td=tbody.querySelectorAll('td:nth-child(1)'); Td.forEach(ele=>ele.css({'padding-left':'0.5em'}));
  }
  var tab=[]; el.tab=tab;
  //idSchedule,codeSchedule,unit,UNIX_TIMESTAMP(start) AS start,UNIX_TIMESTAMP(lastActivity) AS lastActivity,UNIX_TIMESTAMP(created) AS created 
  var arrRow=[createElement('th'), createElement('th').myText('Link to send to the meeting participants.'), createElement('th').myText('Title'), createElement('th').myText('Created'), createElement('th').myText('Last activity')];
  var elRow=createElement('tr').myAppend(...arrRow), thead=createElement('thead').myAppend(elRow);
  var caption=createElement('caption').myText('Saved meetings').attr("contenteditable", "true");
  var tbody=createElement('tbody');
  var table=createElement('table').myAppend(caption, thead, tbody).css({'font-size':'100%'});
  el.append(table);
  return el;
}



var cssDeleteButtonMouseOver={color:'white', 'text-shadow':'-2px 0 red, 2px 0 red, 0 -2px red, 0 2px red, -1px -1px red, 1px 1px red, -1px 1px red, 1px -1px red'};
var cssDeleteButtonMouseOut={color:'grey', 'text-shadow':''};




/*******************************************************************************************************************
 * LoadTab-callbacks
 *******************************************************************************************************************/


//var majax=function(oAJAX,vec){  // Each argument of vec is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  //var makeRetF=function(vecT){ return function(data,textStatus,jqXHR){ 
      //var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [argument,altFunc]
      //delete data.dataArr;
      //beRet(data,textStatus,jqXHR);
      //for(var i=0;i<dataArr.length;i++){ 
        //var r=dataArr[i];
        //if(r.length==1) {var f=vecT[i][2]; if(f) f(r[0]);} 
        //else { window[r[1]].call(window,r[0]);   } 
      //}   
    //}; 
  //}
  //$.ajaxSetup(oAJAX);
  //var vecN=$.extend(true, [], vec);
  //for(var i=0; i<vecN.length; i++){delete vecN[i][2];}
  //vecN.push(['CSRFCode',CSRFCode]);
  //var tmp=JSON.stringify(vecN);
  
  //if(oAJAX.crossDomain) tmp=o;
  //var func=makeRetF(vec),   ajaxHnd=$.ajax({success:func,data:tmp});
  //return ajaxHnd;
//}
var majax=function(trash, vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  vecIn.push(['CSRFCode',CSRFCode]);
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else { var dataOut=JSON.stringify(vecIn); }
  
  xhr.onload=function () {
    var dataFetched=this.response;
    var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
    
    var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
    delete data.dataArr;
    beRet(data);
    for(var i=0;i<dataArr.length;i++){
      var r=dataArr[i];
      if(r.length==1) {var f=arrRet[i]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
    }
  }
  xhr.onerror=function(e){ var tmp='statusText : '+xhr.statusText;  setMess(tmp); console.log(tmp);   throw 'bla';}
  
  xhr.send(dataOut); 
  busyLarge.show();
}


var beRet=function(data,textStatus,jqXHR){
  if(typeof jqXHR!='undefined') var tmp=jqXHR.responseText;
  for(var key in data){
    window[key].call(this,data[key]); 
  }
  busyLarge.hide();
}

app.GRet=function(data){
  var tmp;
  //tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.strMessageText;   if(typeof tmp!="undefined") {setMess(tmp); if(/error/i.test(tmp)) navigator.vibrate(100);}
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp; 
  tmp=data.userInfoFrIP; if(typeof tmp!="undefined") {userInfoFrIP=tmp;}
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }   }
  
  loginInfo.setStat(); 
  toggleSpecialistButts(isSetObject(userInfoFrIP)); 
  
  resetMess(10);
}




window.elHtml=document.documentElement;  window.elBody=document.body;
elBody.css({height:'100%'});
elHtml.css({height:'100%'});
var browser={brand:'bla'};

window.boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;

var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
window.boAndroid = uaLC.indexOf("android") > -1;
window.boFF = uaLC.indexOf("firefox") > -1; 
//var boIE = uaLC.indexOf("msie") > -1; 
var versionIE=detectIE();
window.boIE=versionIE>0; if(boIE) browser.brand='msie';

window.boChrome= /chrome/i.test(uaLC);
window.boIOS= /iPhone|iPad|iPod/i.test(uaLC);
window.boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround

window.boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

if(boTouch){
  if(boIOS) {
    var tmp={height:"100%", "overflow-y":"hidden", "-webkit-overflow-scrolling":"touch"};  //, overflow:'hidden'
    elBody.css(tmp);  elHtml.css(tmp);
  }  
} 

var boHistPushOK='pushState' in history;
if(!boHistPushOK) { alert('This browser does not support history'); return;}
var boStateInHistory='state' in history;
if(!boStateInHistory) { alert('This browser does not support history.state'); return;}


assignSiteSpecific();

var oVersion=getItem('version'); app.boNewVersion=version!==oVersion;        setItem('version',version);

var userInfoFrDB=extend({}, specialistDefault);
//userInfoFrIP=extend({}, specialistDefault);
var userInfoFrIP=null;

var CSRFCode='';


var strScheme='http'+(boTLS?'s':''),    strSchemeLong=strScheme+'://',    uSite=strSchemeLong+site.wwwSite,     uCommon=strSchemeLong+wwwCommon,       uBE=uSite+"/"+leafBE;

var uBE=uSite+"/"+leafBE;
var uFE=uSite;
var wseImageFolder='/'+flImageFolder+'/';
var uImageFolder=uCommon+wseImageFolder;

var uImCloseW=uImageFolder+'triangleRightW.png';
var uImOpenW=uImageFolder+'triangleDownW.png';
var uImCloseB=uImageFolder+'triangleRight.png';
var uImOpenB=uImageFolder+'triangleDown.png';

var uHelpFile=uImageFolder+'help.png';
var uVipp0=uImageFolder+'vipp0.png';
var uVipp1=uImageFolder+'vipp1.png';
var uGoogle=uImageFolder+'google.jpg';
var uFB=uImageFolder+'fb.png';
var uFBFacebook=uImageFolder+'fbFacebook.png';
//uIncreasing=uImageFolder+'increasing.png';
//uDecreasing=uImageFolder+'decreasing.png';
var uOpenId=uImageFolder+'openid-inputicon.gif';
var uOID22=uImageFolder+'oid22.png';
var uBusy=uImageFolder+'busy.gif';
var uBusyLarge=uImageFolder+'busyLarge.gif';
var uDelete=uImageFolder+'delete.png';
var uDelete1=uImageFolder+'delete1.png';


  //
  // History
  //
  
var strHistTitle='syncAMeeting';
var uCanonical=uSite;

var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateLoadedNew={hash:randomHash(), ind:tmpi};
history.replaceState(stateLoadedNew, '', uCanonical);
var stateTrans=stateLoadedNew;
history.StateMy=[];

window.on('popstate', function(event) {
  var dir=history.state.ind-stateTrans.ind;
  //if(Math.abs(dir)>1) {debugger; alert('dir=',dir); }
  var boSameHash=history.state.hash==stateTrans.hash;
  if(boSameHash){
    var tmpObj=history.state;
    if('boResetHashCurrent' in history && history.boResetHashCurrent) {
      tmpObj.hash=randomHash();
      history.replaceState(tmpObj, '', uCanonical);
      history.boResetHashCurrent=false;
    }

    var stateMy=history.StateMy[history.state.ind];
    if(typeof stateMy!='object' ) {
      var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy)+', history.state.ind:'+history.state.ind+', history.StateMy.length:'+history.StateMy.length+', Object.keys(history.StateMy):'+Object.keys(history.StateMy);
      if(!boEpiphany) alert(tmpStr); else  console.log(tmpStr);
      debugger;
      return;
    }
    var view=stateMy.view;
    view.setVis();
    if(typeof view.getScroll=='function') {
      var scrollT=view.getScroll();
      setTimeout(function(){window.scrollTop(scrollT);}, 1);
    } else {
      //var scrollT=stateMy.scroll;  setTimeout(function(){  window.scrollTop(scrollT);}, 1);
    }
    
    if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
    else{
      if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
    }

    stateTrans=extend({}, tmpObj);
  }else{
    stateTrans=history.state; extend(stateTrans, {hash:randomHash()}); history.replaceState(stateTrans, '', uCanonical);
    history.go(sign(dir));
  }
});
if(boFF){
  window.on('beforeunload', function(){   });
}





langClientFunc(); 

var tmp=createColJIndexNamesObj(listCol.KeyCol); extend(listCol,tmp); extend(window,tmp);
listCol.sel=createChildInd(listCol.backSel);   
listCol.vis=createChildInd(listCol.backVis);   

var colMenuBOn='#616161', colMenuBOff='#aaa';



var imgBusy=createElement('img').prop({src:uBusy});
var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)
spanMessageText.css({font:'courier'});

var busyLarge=createElement('img').prop({src:uBusyLarge}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
elBody.append(busyLarge);

var imgHelp=createElement('img').attr({src:uHelpFile}).css({'vertical-align':'-0.4em'});


var arrDayName=['Su','M','Tu','W','Th','F','Sa'];
var arrMonthName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

 




elBody.css({padding:'0 0 0 0'});
elBody.css({margin:'0 0 0 0'});



//$.ajaxSetup({
  //url: uBE,
  //global: false,
  //type: "POST",
  ////dataType:'json',
  //contentType:'application/json',
  //processData:false,
  //success: beRet,
  ////success: function(data){alert('ss');},
  //error: function(jqXHR, textStatus, errorThrown){
    //setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
  //}
//});

//var oAJAX={url:uBE,type: "POST",dataType:'json', processData:false,success: beRet};

var oAJAX={};



var maxWidth='800px';

var colButtAllOn='#9f9', colButtOn='#0f0', colButtOff='#ddd', colFiltOn='#bfb', colFiltOff='#ddd', colFontOn='#000', colFontOff='#777', colActive='#65c1ff', colStapleOn='#f70', colStapleOff='#bbb';

elBody.css({visibility:'visible',background:'#fff'});
elBody.css({display:'flex','flex-direction':'column'});

//loginInfo=loginInfoExtend(createElement('div'));  loginInfo.css({padding:'0px 0px 0px 0px',height:'0.9em'});
var loginInfo=loginInfoExtend(createElement('div'));  loginInfo.css({padding:'0em 0em 0em 0em','font-size':'75%'});
  
//var H1=$('h1:eq(0)');
var H1=elBody.querySelector('h1:nth-of-type(1)');


//var titleInp=titleInpExtend(createElement('div')).css({margin:'0em 1em 1em 1em'});

var unitSelector=unitSelectorExtend(createElement('div'));   
var dayFilter=dayFilterExtend(createElement('div'));  
var lectureFilter=lectureFilterExtend(createElement('div'));  
var hourFilter=hourFilterExtend(createElement('div')); 
//boxWeek=boxWeekExtend(createElement('div'));  
var firstDayOfWeek=firstDayOfWeekExtend(createElement('div'));  
var dateAlwaysInWOne=dateAlwaysInWOneExtend(createElement('div'));  


var makeFunc=function(nStChange,nColsChange){return function(){
  var vTimeN=sch.calcVTime('','','',nStChange,nColsChange);  sch.convertMTab('',vTimeN);  sch.vTime=vTimeN;  sch.M2Table();
};};
var buttStEarlier=createElement('button').myText('<').css({'margin-right':'1em'}).on('click', makeFunc(-1,0));
var buttStLater=createElement('button').myText('>').on('click', makeFunc(1,0));
var buttDecCols=createElement('button').myText('-').css({'margin-right':'1em'}).on('click', makeFunc(0,-1));
var buttIncCols=createElement('button').myText('+').on('click', makeFunc(0,1));

// ☰≡
var settingsButton=createElement('button').myText('⚙').css({'margin-right':'1em'}).on('click',function(){
  settingsDiv.setVis();
  doHistPush({view:settingsDiv});
})
var settingsDiv=settingsDivExtend(createElement('div'));  //settingsDiv.addClass('mainDiv');
//padding:5 10;
var divBlanket=createElement('div').css({position:'fixed', 'background-color':'#000', width:'100%', 'z-index':1, opacity:'0.5', height:'100%', top:'0px', left:'0px'}).hide().on('click',function(){ history.back(); });
settingsDiv.css({position:'fixed', 'background-color':'#ccc', border:'1px solid', width:'calc(100% - 2.5em)', 'box-sizing':'border-box', 'z-index':2, opacity:'0.92', 'max-height':'100%', top:'0px', 'max-width':'360px', height:'100%', 'font-size':'0.95em'}); // , 'overflow-y':'scroll'
if(boIOS) {[settingsDiv, divBlanket].forEach(ele=>ele.css({'-webkit-transform':'translate3d(0,0,0)'})); }
settingsDiv.hide();

//var settingsDivOuter=menuCurtainExtend(createElement('div').myAppend(settingsButton,settingsDiv),[],0).css({margin:'0em auto'});
var settingsDivOuter=createElement('div').myAppend(divBlanket, settingsDiv).css({margin:'0em auto'});
//settingsDivW=createElement('div').myAppend(settingsButton,settingsDiv).css({display:'flex', 'flex-direction':'row', 'z-index':1, 'align-items':'flex-start', position:'absolute'});
//settingsDivOuter=createElement('div').myAppend(settingsDivW).css({margin:'0.5em auto 1em auto', position:'relative'});

H1.remove();
const urlParams = new URLSearchParams(window.location.search), myParam = urlParams.get('idSchedule');
var strTitleHelp; if(myParam) strTitleHelp='Mark when you are busy and click save'; else strTitleHelp='Mark when you are busy, click save, and email the returned link to the other meeting participants.';

var imgH=imgHelp.cloneNode().css({margin:'0 0 0 0.5em', 'vertical-align':'-0.3em'}),  bub=createElement('div').myHtml(strTitleHelp);     popupHover(imgH,bub); 
var divH1=createElement('div').myAppendB(H1.textContent, imgH).css({flex:'0 0 auto', 'letter-spacing':'0.15em', 'text-shadow':'-1px 0 grey, 1px 0 grey, 0 -1px grey, 0 1px grey, -1px -1px grey, 1px 1px grey, -1px 1px grey, 1px -1px grey'});
//var divSpace=createElement('div').css({flex:'0 0 4em'});
settingsButton.css({flex:'0 0 auto'});
//var divHW=createElement('div').myAppend().css({display:'flex', 'justify-content':'space-between', 'align-items':'center'});


var sch=scheduleExtend(createElement('table')).css({margin:'0 auto'});
unitSelector.setUpButtStat();  hourFilter.setUpButtStat();  dayFilter.setUpButtStat();


//var title=createElement('div').css({'font-weight':'bold','font-size':'150%'}); //,'margin-bottom':'0.5em','border-bottom':'1px solid', ,'padding':'0.4em'
var inpTitle=createElement('input').prop({type:'text', placeholder:"Title"}).css({'font-weight':'bold','font-size':'130%', 'text-align':'center', 'max-width':'100%'});
var divTitle=createElement('div').css({'text-align':'center', margin:'0.3em'}).myAppend(inpTitle); //,'margin-bottom':'0.5em','border-bottom':'1px solid', ,'padding':'0.4em'

var deleteConfirmPop=deleteConfirmPopExtend(createElement('div'));
var loginDiv=loginDivExtend(createElement('div'));   loginDiv.setHead('Need an identity'); var loginReturn2=loginReturnList;
var scheduleList=scheduleListExtend(createElement('div')).hide().css({margin:'0.2em auto 0.6em'});

var schW=createElement('div').myAppend(divH1, divTitle, sch, scheduleList).css({flex:'1 1 auto', 'overflow-y':'scroll', height:'100%'});


var saveButton=createElement('button').myText('Save').on('click', sch.save).css({'margin-right':'0.5em', flex:'0 0 auto'});
var spanRed=createElement('span').css({"background":"#f00",border:'black solid 1px', height:'1em', width:'1em', display:'inline-block', 'vertical-align':'bottom'});
var spanBusy=createElement('span').css({'float':"right"}).myAppend(spanRed,' = Busy'); 
var loginButt=loginButtExtend(createElement('button')).css({flex:'0 0 auto'});



var strTmp='https://emagnusandersson.com/syncAMeeting'; 
var aLink=createElement('a').attr({href:strTmp}).myText('More info');
var divLink=createElement('a').myAppend(aLink).css({'font-size':'100%','font-weight':'bold', flex:'1 1 auto'});
//var iframe=$('<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fsyncameeting.eu01.aws.af.cm&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=511686352189575" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>');
//iframe.css({'vertical-align':'middle','margin-left':'1em'});
var divFoot=createElement('div').myAppend(settingsButton, saveButton, loginButt, divLink, spanBusy);  
divFoot.css({bottom:'0px', display:'flex', 'flex-direction':'row', width:'100%', padding:'1em', 'text-align':'center', 'border-top':'1px solid', background:'white', flex:'0 0 auto'}); 


var MainDiv=[loginInfo, settingsDivOuter, schW, divFoot]; //, saveDiv, scheduleList
elBody.append(...MainDiv);


//if(boTouch) H1.remove();
MainDiv.forEach(ele=>ele.css({'text-align':'left',background:'#fff','max-width':maxWidth,'margin-left':'auto','margin-right':'auto', 'box-sizing':'border-box', width:'100%'}));

divH1.css({'text-align':'center',color:'black','font-size':'130%','font-weight':'bold',
    padding:'0.3em 0.2em',margin:'0.2em auto 0.2em auto'}); //,background:'#ff0',border:'solid 1px'
divFoot.css({'text-align':'center'});
divTitle.css({'text-align':'center'}); 
//divBread.css({'text-align':'center'}); //,background:'lightgrey'

//sch.css({'width':'auto','text-align':''});

history.StateMy[history.state.ind]={view:schW};

schW.setVis=function(){
  settingsDiv.hide(); divBlanket.hide();
  //settingsDiv.css({'-webkit-overflow-scrolling':'auto'});
  //var tmp={height:"100%"}; elBody.css(tmp);  elHtml.css(tmp);
  return true;
}
settingsDiv.setVis=function(){
  settingsDiv.show();divBlanket.show();
  //settingsDiv.css({'-webkit-overflow-scrolling':'touch'});
  //var tmp={height:""}; elBody.css(tmp);  elHtml.css(tmp);
  //schW.css('position',''); setTimeout(function(){schW.css('position','fixed');},100);
  return true;
}

var lastActivity=0;
//firstAJAXCall();

var vec=[['specSetup'],['listSchedule']];
if(idSchedule!==null) vec.push(['getSchedule',{idSchedule:idSchedule,codeSchedule:codeSchedule}, sch.getScheduleRet]);
majax(oAJAX,vec);
setMess('Fetching data ',0,true);

toggleSpecialistButts(0);





}



