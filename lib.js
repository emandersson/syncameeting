
boBrowser=(typeof window != 'undefined' && window.document);

thisChanged=function(func,selfT){return function(){return func.apply(selfT,arguments);}}

thisChangedWArg=function(func,selfT,inObj){
  return function(){ var Arg = Array.prototype.slice.call(arguments); Arg.push(inObj); return func.apply(selfT,Arg);}
}




MyAsync=function(Func,finF){
  var self=this;
  if(typeof Func=='undefined') Func=[]; if(typeof finF=='undefined') finF=[]; 
  this.Func=Func;   this.iSeries=0; this.Res=[]; this.resLast=undefined, this.finF=finF; 
  this.cb=function(err,res){ 
    self.storeRes(err,res);
    self.iSeries++; 
    //console.log(self.iSeries+'/'+self.Func.length);
    //if(err) console.log('Err '+err);
    if(err || self.iSeries>=self.Func.length) {  self.finF(err,self.Res); return;} // console.log('Exit'); 
    self.Func[self.iSeries](self.cb);
  };
}
MyAsync.prototype.storeRes=function(err,res){ 
  this.Res[this.iSeries]=res; this.resLast=res;
};
MyAsync.prototype.go=function(){
  this.Func[this.iSeries](this.cb);
}
MyAsync.prototype.doneNTrunk=function(err,res){this.Res[this.iSeries]=res;  this.Func=[]; this.iSeries=0; this.finF(err,self.Res);}
MyAsync.prototype.trunkNoFin=function(){}






var getColor = function(val, range) {  var s=100, l=50, a=1,    h = 240-Math.round((240 / range) * val);      return "hsla("+h+","+s+"%,"+l+"%,"+a+")";    };

htmlDecode=function(input){ var e = document.createElement('div');    e.innerHTML = input;     return e.childNodes[0].nodeValue;  }

print_r=function(o,boHTML){
  var tmp=JSON.stringify(o,null,'\t');
  if(typeof(boHTML) !='undefined' && boHTML) tmp=tmp.replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;'); return tmp;
}


//
// String
//


ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  }
lcfirst=function(string){  return string.charAt(0).toLowerCase() + string.slice(1);  }
isAlpha=function(star){  var regEx = /^[a-zA-Z0-9]+$/;  return str.match(regEx); } 
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g,"");}

//function pad2(n){ return ('0'+n).slice(-2);}
pad2=function(n) {return (n<10?'0':'')+n;}


//
// Array
//


arr_max=function(arr){return Math.max.apply(null, arr);}
arr_min=function(arr){return Math.min.apply(null, arr);}

array_flip=function(A){ var B={}; for(var i=0;i<A.length;i++){B[A[i]]=i;} return B;}
array_fill=function(n, val){ return Array.apply(null, new Array(n)).map(String.prototype.valueOf,val); }
array_merge=function(){  return Array.prototype.concat.apply([],arguments);  } // Does not modify origin
//array_mergeM=function(a,b){  a.push.apply(a,b); return a; } // Modifies origin (first argument)
array_mergeM=function(){var t=[], a=arguments[0], b=t.slice.call(arguments, 1), c=t.concat.apply([],b); t.push.apply(a,c); return a; } // Modifies origin (first argument)

mySplice1=function(arr,iItem){ var item=arr[iItem]; for(var i=iItem, len=arr.length-1; i<len; i++)  arr[i]=arr[i+1];  arr.length = len; return item; }  // GC-friendly splice
myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; for(var i=0, len=brr.length; i<len; i++)  arr[i]=brr[i];  arr.length = len; return arr; }  // GC-friendly copy

is_array=function(a){return a instanceof Array;}
in_array=function(needle,haystack){ return haystack.indexOf(needle)!=-1;}
array_filter=function(A,f){f=f||function(a){return a;}; return A.filter(f);}

array_removeInd=function(a,i){a.splice(i,1);}


arrValMerge=function(arr,val){  var indOf=arr.indexOf(val); if(indOf==-1) arr.push(val); }
//arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) arr.splice(indOf,1); }
arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) mySplice1(arr,indOf); }



if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
  }
}
addIndexColumn=function(M){    var Mt=Array();     for(var i=0;i<M.length;i++){  var tmp=[(i+1).toString()];   Mt[i]=tmp.concat(M[i]);  }       return Mt;      }
arrCopy=function(A){return [].concat(A);}

arrarrCopy=function(B){var A=[]; for(var i=0;i<B.length;i++) { A[i]=[].concat(B[i]);} return A; }

eliminateDuplicates=function(arr) {
  var i, len=arr.length, out=[], obj={};
  for (i=0;i<len;i++) { obj[arr[i]]=0; }
  for (i in obj) { out.push(i); }
  return out;
}
arrArrange=function(arrV,arrI){
  var arrNew=[]; if(typeof arrV=='String') arrNew='';
  //for(var i=0;i<arrI.length;i++){    arrNew.push(arrV[arrI[i]]);    }
  for(var i=0;i<arrI.length;i++){    arrNew[i]=arrV[arrI[i]];    }
  return arrNew;
}

//
// Str (Array of Strings)
//

StrComp=function(A,B){var lA=A.length; if(lA!==B.length) return false; for(var i=0;i<lA;i++){ if(A[i]!==B[i]) return false;} return true;}

//
// Object
//

//extractLoc=function(obj,strObjName){   // Ex: eval(extractLoc(objMy,'objMy'));
  //var Str=[];  for(var key in obj) Str.push(key+'='+strObjName+'.'+key);
  //var str=''; if(Str.length) str='var '+Str.join(', ')+';';  return str;
//}
////extract=function(obj){  for(var key in obj){  window[key]=obj[key];  }  }
//extract=function(obj,par){
  //if(typeof par=='undefined') par=app; for(var key in obj){
    //par[key]=obj[key];
  //}
//}
//extractLocSome=function(strObjName,arrSome){  // Ex: eval(extractLocSome('objMy',['a','b']));
  //if(typeof arrSome=='string') arrSome=[arrSome];
  //var len=arrSome.length, Str=Array(len);  for(var i=0;i<len;i++) { var key=arrSome[i]; Str[i]=key+'='+strObjName+'.'+key; }
  //return 'var '+Str.join(', ')+';';
//}





copy=function(o, isdeep) {
    if (o===undefined || o===null || ['string', 'number', 'boolean'].indexOf(typeof o)!==-1)
        return o;
    var n= o instanceof Array? [] : {};
    for (var k in o)
        if (o.hasOwnProperty(k))
            n[k]= isdeep? copy(o[k], isdeep) : o[k];
    return n;
}
copySome=function(a,b,Str){for(var i=0;i<Str.length;i++) { var name=Str[i]; a[name]=b[name]; } return a; }
object_values=function(obj){
  var arr=[];      for(var name in obj) arr.push(obj[name]);
  return arr;
}
objectValuesSome=function(obj,arrSome){
  var len=arrSome.length, arr=Array(len);  for(var i=0;i<len;i++) { var key=arrSome[i]; arr[i]=obj[key]; }
  return arr;
}

// 
// JQuery
//

//isSetObject=function(obj){return !jQuery.isEmptyObject(obj);} // {}, null => false
isSetObject=function(obj){if(typeof obj!='object' || obj===null) return false;   return Boolean(Object.keys(obj).length); } // {}, null => false

//
// Date
//

swedDate=function(tmp){ if(tmp) {tmp=UTC2JS(tmp);  tmp=tmp.getFullYear()+'-'+pad2(tmp.getMonth()+1)+'-'+pad2(tmp.getDate());}  return tmp;}
UTC2JS=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);  return tmp;  }
UTC2Readable=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);   tmp=tmp.toLocaleString();   return tmp; }  

Date.prototype.toUnix=function(){return Math.round(this.valueOf()/1000);}
Date.prototype.toISOStringMy=function(){return this.toISOString().substr(0,19);}
unixNow=function(){return (new Date()).toUnix();}
approxTimeDuration=function(sWhole,boLong,boArr){  
  if(typeof boLong !='undefined' && boLong==1) {} else boLong=0;
  if(typeof boArr !='undefined' && boArr==1) {} else boArr=0;
  var unit=langHtml['timeUnit'];
  var n, ii, j1=0; j2=1; if(boLong==1) {j1=2; j2=3;} 
  aSWhole=Math.abs(sWhole);
  if(aSWhole>60*60*24*365*2) {n=Math.round(sWhole/(60*60*24*365)); ii='y';} //
  else if(aSWhole>60*60*24*2) {n=Math.round(sWhole/(60*60*24)); ii='d';}
  else if(aSWhole>60*60*2) {n=Math.round(sWhole/(60*60)); ii='h';}
  else if(aSWhole>60*2) {n=Math.round(sWhole/60); ii='min';}
  else {n=sWhole; units=unit['s'][j1]; ii='s';}
  var units=unit[ii][j1]; if(n!=1) units=unit[ii][j2];
  if(boArr==1) return Array(n,units); else return n+' '+units;
}

UTC2ReadableDiff=function(utcTime,curTime,dirDiffSign,boLong,boArr){
  var ttmp=utcTime-curTime;  ttmp=dirDiffSign*ttmp; 
  if(typeof boLong !='undefined' && boLong==1) {} else boLong=0;
  if(typeof boArr !='undefined' && boArr==1) {} else boArr=0;
  var tmp;  tmp=approxTimeDuration(ttmp,boLong,boArr);
  
  if(boArr==1) {
    return tmp;
  }
  else {
    if(ttmp<0) tmp='-';
    return tmp;
  }
}

UTC2ReadableTmp=function(utcTime,curTime,boUseDiff, dirDiffSign){
  var tmp; 
  if(boUseDiff) { tmp=UTC2ReadableDiff(utcTime,curTime,dirDiffSign); }
  else {tmp=UTC2Readable(utcTime); }
  return tmp;
}


//
// Random
//

randomInt=function(min, max){    return min + Math.floor(Math.random() * (max - min + 1));  }
randomHash=function(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);}


//
// Math
//

isNumber=function(n) { return !isNaN(parseFloat(n)) && isFinite(n);}
sign=function(val){if(val<0) return -1; else if(val>0) return 1; else return 0;}


bound=function(value, opt_min, opt_max) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

closest2Val=function(v, val){
  var bestFit=Number.MAX_VALUE, curFit, len=v.length, best_i;
  for(var i=0;i<len;i++){
    curFit=Math.abs(v[i]-val);
    if(curFit<bestFit) {bestFit=curFit; best_i=i;}
  }
  return [v[best_i],best_i];
}

