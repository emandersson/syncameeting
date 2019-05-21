"use strict"

var getItem=function(name) {    var tmp=localStorage.getItem(name);   if(tmp!==null) tmp=JSON.parse(tmp);  return tmp;   }
var setItem=function(name,value) {  localStorage[name]=JSON.stringify(value); }
var getItemS=function(name) {    var tmp=sessionStorage.getItem(name);    if(tmp!==null) tmp=JSON.parse(tmp);   return tmp;   }
var setItemS=function(name,value) {  sessionStorage[name]=JSON.stringify(value); }


var getBrowser=function() {
    var ua=navigator.userAgent.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var brand=match[ 1 ] || "";
    var version=match[ 2 ] || "0";
    
    return {brand:brand,version:version};
};
var detectIE=function() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


//$.fn.push = function(selector) {
    //Array.prototype.push.apply(this, $.makeArray($(selector)));
    //return this;
//};

$.fn.pushOne = function(selector){
    Array.prototype.push.apply(this, $.makeArray($(selector)));
    return this;
};
$.fn.push = function(){
  for(var i=0; i<arguments.length; i++){
    this.pushOne(arguments[i]);
  }
  return this;
}



/*******************************************************************************************************************
 * autocompleteFieldExtend
 *******************************************************************************************************************/

var autocompleteFieldExtend=function($el,storeID,func){
"use strict"
  var createMenu=function(){ 
    var wid=$el.width(), hei=32;
    var pos = $el.position(), x=pos.left+3, y=pos.top+hei;
    $menu.empty().css({'min-width':wid});
    for(var i=0;i<nEntriesSub;i++){
      var makeFunc=function(d){ return function(){ $el.val(d); closeFunc(); $el.focus();} }     
      var $r=$('<div>').html(entriesSub[i]);
      if(i===iSub) $r.css({background:'#ccc'});
      $r.click(makeFunc(entriesSub[i]));
      $menu.append($r);
    }
    $el.after($menu);
    $menu.css({position:'absolute',top:y+'px',left:x+'px',background:'#fff',border:'solid 1px','z-index':45});
  }
  var createEntriesSub=function(){
    //entriesSub=[];
    entriesSub.length=0;
    var val=$el.val(), valLen=val.length;
    for(var i=0;i<nEntries;i++){
      var cur=entries[i], curLen=cur.length;
      if(curLen>=valLen){
        var strSub=cur.substr(0,valLen);
        if(strSub===val){
          entriesSub.push(entries[i]); 
        }
      }
    }
    nEntriesSub=entriesSub.length;
  }
  var closeFunc=function(){  $menu.detach();  }
  var fieldKeyUp=function(e){ 
    var c=e.which;   //$menuessageText.append('<b>'+c+'</b>');
    if(c==13){
      var val=$el.val(); 
      //var ind=entries.indexOf(val);   if(ind==-1){  entries.push(val); }
      closeFunc();
      $el.store();   func($el.val());
      return; 
    }
    else if(c==40){ if(iSub==='') iSub=0; else{iSub++;if(iSub==nEntriesSub) iSub--;} $el.val(entriesSub[iSub]); }
    else if(c==38){ if(iSub!==''){iSub--;if(iSub<0) iSub++;} $el.val(entriesSub[iSub]); }
    else{iSub=''; createEntriesSub();}
    //$entriesSubDump.html(print_r(entriesSub));
    createMenu();
  }
  //$el.getEntries=function(){return entries;}
  $el.entryMerge=function(){ }
  $el.store=function(){
    var val=$el.val(), ind=entries.indexOf(val);   if(ind==-1){  entries.push(val); } 
    //localStorage[storeID]=JSON.stringify(entries);
    setItem(storeID,entries);
    //$entriesDump.html(print_r(entries));
  }
  var entries=getItem(storeID);   if(entries===null) entries=[]; 
  //var tmp=entries.indexOf(''); if(tmp!=-1) entries.splice(tmp,1);
  var tmp=entries.indexOf(''); if(tmp!=-1) mySplice1(entries,tmp);

  //ind=entries.indexOf(''); if(ind!=-1) entries.splice(ind,1);
  var nEntries=entries.length;

  var entriesSub=entries.concat([]), nEntriesSub=entriesSub.length;
  var iSub='';
  var $menu=$('<div>').css({cursor:'default'}).addClass('unselectable');
  //$menu.mouseenter(function(){$el.off('blur',closeFunc);}).mouseleave(function(){$el.on('blur',closeFunc);});
  
  $el.click(function(e){createEntriesSub();createMenu();e.stopPropagation();});
  $el.keyup( fieldKeyUp );
  $('html').click(closeFunc);
  
  return $el;
}

  
var extend=function(out) {
  out=out||{};
  for(var i=1; i<arguments.length; i++) {
    if(!arguments[i]) continue;
    for(var key in arguments[i]) {    if(arguments[i].hasOwnProperty(key)) out[key]=arguments[i][key];     }
  }
  return out;
};

/*******************************************************************************************************************
 * DOM handling (non-jQuery)
 *******************************************************************************************************************/

var findPos=function(el) {
  var rect = el.getBoundingClientRect();
  return {top:rect.top+document.body.scrollTop, left:rect.left + document.body.scrollLeft};
}
var findPos=function(el) {
  var curleft = 0, curtop = 0;
  while(1){
    curleft += el.offsetLeft; curtop += el.offsetTop;
    if(el.offsetParent) el = el.offsetParent; else break;
  }
  return { x: curleft, y: curtop };
}

var removeChildren=function(myNode){
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}
var jQueryObjToFragment=function($items){
"use strict"
  var fragment = createFragment();
  for(var i=0; i<$items.length; i++){ fragment.append($items[i]); }
  return fragment;
}

var scrollTop=function(){ return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop; }
var scrollLeft=function(){ return window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft; }


EventTarget.prototype.on=EventTarget.prototype.addEventListener;
EventTarget.prototype.off=EventTarget.prototype.removeEventListener;
if(!Node.prototype.append) Node.prototype.append=Node.prototype.appendChild;
if(!Node.prototype.prepend) Node.prototype.prepend=function(el){ this.insertBefore(el, this.firstChild);  }

Node.prototype.appendChildren=function() {
  for(var i=0; i<arguments.length; i++)
    this.append(arguments[i]);
  return this;
}
Node.prototype.css=function(styles, boChildren=false){
  if(this instanceof DocumentFragment) boChildren=true;
  if(!boChildren) Object.assign(this.style, styles);
  else 
    this.childNodes.forEach(function(elA){ Object.assign(elA.style, styles);  });
  return this;
}
var createTextNode=function(str){ return document.createTextNode(str); }
var createElement=function(str){ return document.createElement(str); }
var createFragment=function(str){ return document.createDocumentFragment(); }

var isVisible=function(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
}


/*******************************************************************************************************************
 * popupHover: popup a elBubble when you hover over elArea
 *******************************************************************************************************************/
var popupHover=function(elArea,elBubble){
  elBubble.css({position:'absolute', 'box-sizing':'border-box', margin:'0px'}); //
  var setBubblePos=function(e){
    var xClear=6, yClear=6;
    var x = e.pageX, y = e.pageY;

    var borderMarg=10;
    //var $win = $(window), $doc=$(document);
    //var winW=$win.width(),winH=$win.height(),   bubW=$(elBubble).width(),bubH=$(elBubble).height(),   scrollX=$doc.scrollLeft(),scrollY=$doc.scrollTop();
    var winW=window.innerWidth,winH=window.innerHeight,   bubW=elBubble.clientWidth,bubH=elBubble.clientHeight,   scrollX=scrollLeft(),scrollY=scrollTop();


    var boRight=true, boBottom=true;

    var boMounted=Boolean(elBubble.parentNode);
    if(boMounted){
      var xFar=x+xClear+bubW, xBorder=scrollX+winW-borderMarg;
      if(xFar<xBorder){ 
        x=x+xClear;
      } else {
        x=x-bubW-xClear;  // if the bubble doesn't fit on the right side then flip to the left side
        //x=x-xClear; boRight=false;
      }
        
      var yFar=y+yClear+bubH, yBorder=scrollY+winH-borderMarg;
      if(yFar<yBorder) {
        y=y+yClear;
      }else{ 
        y=y-bubH-yClear;   // if the bubble doesn't fit below then flip to above
        //y=y-yClear; boBottom=false;
      }
    } else {
      x=x+xClear;
      y=y+yClear;
    }
    if(x<scrollX) x=scrollX;
    if(y<scrollY) y=scrollY;
    elBubble.style.top=y+'px'; elBubble.style.left=x+'px';
    //if(boRight) {elBubble.style.left=x+'px'; elBubble.style.right='';} else {elBubble.style.left=''; elBubble.style.right=x+'px'; }
    //if(boBottom) {elBubble.style.top=y+'px'; elBubble.style.bottom='';} else {elBubble.style.top=''; elBubble.style.bottom=y+'px'; } 
  };
  var closeFunc=function(){ 
    if(boTouch){ 
      elBubble.remove(); 
      if(boIOS) elBlanket.remove();
    } 
    else { elBubble.remove();  }
  }
  var elBlanket;
  if(boIOS){
    //$blanket=$('<div>').css({'background':'#555',opacity:0,'z-index': 9001,top:'0px',left:'0px',width:'100%',position:'fixed',height:'100%'}).click(closeFunc);
    elBlanket=document.createElement('div'); elBlanket.css({'background':'#555',opacity:0,'z-index': 9001,top:'0px',left:'0px',width:'100%',position:'fixed',height:'100%'});
    elBlanket.on('click', closeFunc);
  }
  if(boTouch){
    elArea.on('click', function(e){ e.stopPropagation();  elBody.appendChild(elBubble); setBubblePos(e); setTimeout(closeFunc, 4000); if(boIOS) elBody.appendChild(elBlanket);  });
    elBubble.on('click', function(e){ closeFunc(); });
    elHtml.on('click', function(e){ closeFunc(); });
    
  }else{
    elArea.on('mousemove', setBubblePos);  
    elArea.on('mouseenter', function(e){elBody.appendChild(elBubble);});
    elArea.on('mouseleave', function(){elBubble.remove();});
  }
  elBubble.classList.add('popupHover'); 
}

  // Wrappers of popupHover
var popupHoverM=function(elArea,elBubble){
  elBubble.css({'z-index':9005,'text-align':'left',padding:'0.4em'}); 
  popupHover(elArea,elBubble);    
  return elArea;
}
var popupHoverJQ=function($area,$bubble){
  $bubble.css({'z-index':9005,'text-align':'left',padding:'0.4em'});  
  popupHover($area[0],$bubble[0]);    
  return $area;
}

