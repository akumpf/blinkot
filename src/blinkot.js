// - - - - - - - - - - - - - - - -
// Say hello to Blinkot! :)
// --
// In a nutshell, blinkot is a simple way to embed
// arbitrary HTML is a URL-contained wrapper that
// can be shared easily.
// --
// Requiring the link to remain < 2048 characters
// allows it to be posted on most social media sites
// and URL shorteners with minimal overhead.
// This leads to ~1440 characters of content.
// --
// Inherent in each blinkot is also the ability to
// modify and create new blinkots. Since the content
// is contained in the URL's hash ("#..."), no data
// needs to be transferred to the minimalistic site
// hosting the blinkot's viewer/editor code.
// --
// The URL's hash has 4 parts and looks like this...
// http://.../#TITLE_THEME_CONTENTTYPE_CONTENT_DATE
// TITLE:       base64 encoded title text
// THEME:       single letter (l,d)   - see: themeNames
// CONTENTTYPE: single letter (h,r,t) - see: typeNames
// TITLE:       base64 encoded content text
// DATE:        base32 -- new Date().getTime().toString(32);
// - - - - - - - - - - - - - - - - 

// -- Low-level browser info.
window.isInIFrame = (window.location != window.parent.location) ? true : false;

// -- Encode/Decode Base64 with unicode handling
function enc64(str){
  // characters will be in range: A-Z, a-z, 0-9, +, /, =
  return window.btoa(unescape(encodeURIComponent(str||"")));
}
function dec64(str){
  return decodeURIComponent(escape(window.atob(str||"")));
}

// -- Helpful utility functions
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
function clone(obj){
    if(obj === null || typeof(obj) != 'object') return obj;
    var temp = obj.constructor(); // changed
    for(var key in obj) temp[key] = clone(obj[key]);
    return temp;
}
function forEach(obj,cb){
  for (var key in obj) {
    if (obj.hasOwnProperty(key)){
      cb(key, obj[key]);
    }
  }
}
function randEl(arr){
  arr = arr||[];
  if(arr.length <= 0) return null;
  return arr[Math.floor(arr.length*Math.random())];
}
function moveArrayElement(arr, old_index, new_index){
  if(new_index >= arr.length){
    var k = new_index - arr.length;
    while ((k--) + 1) arr.push(undefined);
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}
function escapeHTML(msg){
  return ((msg||"")+"").replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
function linebreaksToBR(str){
  return (str||"").replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\n/g,"<br/>");
}
function doubleLinebreaktsToMarker(str, marker){
  return (str||"").replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\n\n/g, marker);
}
function stripExtraWhitespace(str){
  // limits: 2 sequential linebreaks, 
  return (str||"").replace(/\n\s*\n\s*\n/g, '\n\n').replace(/  +/g, " ").trim(); 
}
function stripScripts(html){
  var div = document.createElement('div');
  div.innerHTML = html;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}
function autoEmbedKnownURLS(html){
  html = html||"";
  html = html.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)(.+)/g, '<iframe src="//www.youtube.com/embed/$1"></iframe>');
  html = html.replace(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/([0-9]+)/g, '<iframe src="//player.vimeo.com/video/$1"></iframe>'); 
  return html;
}
function wrapIframes(html){
  var div = document.createElement('div');
  div.innerHTML = html;
  var iframes = div.getElementsByTagName('iframe');
  var i = iframes.length;
  while (i--) {
    var iframe = iframes[i];
    var newif  = document.createElement('iframe');
    newif.setAttribute("src",iframe.src);
    newif.setAttribute("frameborder",0);
    newif.setAttribute("allowfullscreen",true);
    var newifwrapper = document.createElement("div");
    newifwrapper.setAttribute("class","mediablk100");
    newifwrapper.innerHTML = "<div class='sizer16x9'></div>";
    newifwrapper.appendChild(newif);
    iframe.parentNode.replaceChild(newifwrapper, iframe);
  }
  return div.innerHTML;
}
function autoLink(html){
  var div = document.createElement('div');
  div.innerHTML = html;
  linkify(div);
  return div.innerHTML;
}

// -- THEMES
var themeNames = {
  a:"Light (default)",
  b:"Dark",
};

// -- CONTENT RENDERERS
var typeNames = {
  h:"HTML",
  r:"Raw HTML",
  t:"Text",
  m:"Markdown",
};

// -- MODULE LOADING / RENDERING
var mods = { // additionally populated when modules load.
  h: function renderFriendlyHTML(c){
    c = c||"";
    c = stripScripts(c);
    c = autoEmbedKnownURLS(c);
    c = wrapIframes(c); 
    c = "<div class='dp'>"+doubleLinebreaktsToMarker(c,"</div><div class='dp'>")+"</div>";
    c = linebreaksToBR(c); 
    c = autoLink(c);
    return c;
  },
  r: function renderRawHTML(c){
    c = c||"";
    c = stripScripts(c);
    return c;
  },
  t: function renderText(c){
    c = c||"";
    c = "<div class='dtxt'>"+escapeHTML(c)+"</div>";
    return c;
  }
}; 
var modsRequested = {};
window.onModReady = function(modLetter){
  console.log("Mod is ready: "+modLetter);
  renderBlinkot();
};
function requestMod(modLetter){
  if(modsRequested[modLetter]) return console.log("Mod already requested: "+modLetter);
  // --
  modsRequested[modLetter] = true;
  console.log("Requesting mod: "+modLetter);
  var js = document.createElement("script");
  js.type = "text/javascript";
  js.src = "./mod_"+modLetter+".js";
  document.body.appendChild(js);
}

// -- LOCATION HASH
var lastHash = (window.location.hash||"#").substring(1);
function updateHash(newHash,addToHist,allowReload){
  // This changes the hash with/without adding to browser history.
  newHash = newHash||"";
  if(!addToHist){
    window.location.replace(('' + window.location).split('#')[0]+'#'+newHash);
  }else{
    window.location.hash = '#'+newHash;
  }
  if(!allowReload) lastHash = newHash;
}
window.onhashchange = function () {
  currHash = (window.location.hash||"#").substring(1);
  if(currHash !== lastHash){
    console.log("New hash we didn't know about -> reloading.");
    window.location.reload();
  }
};
function getURLHashAsObject(){
  var h = (location.hash||"#").substring(1)||"";
  window.hashhash = h.hashCode(); // set the hashhash! :)
  var o = {};
  if(h){
    var hs = h.split("_")||[];
    if(hs.length == 5){
      try{
        o.title = dec64(hs[0])||"";
        o.theme = hs[1]       ||"a"; 
        o.type  = hs[2]       ||"h";
        o.c     = dec64(hs[3])||"";
        o.time  = parseInt(hs[4], 32);
      }
      catch(ex){console.log("Hash decode error.",ex);}
    }else{
      console.log("Bad hash.", h, hs);
    }
  }else{
    console.log("No hash yet."); 
  }
  // --
  return o;
}
var o = getURLHashAsObject();
console.log(o);

// -- STATE
function loadState(){
  if(!window.localStorage){
    console.log("No localStorage to load!");
    return {};
  }
  var strState  = localStorage.getItem(hashhash)||"{}";
  var s         = {};
  try{s = JSON.parse(strState);}
  catch(ex){console.log("JSON parse error.",ex);} 
  // --
  console.log("state loaded.");
  return s;
}
function saveState(s){
  if(!window.localStorage){
    console.log("No localStorage to save!");
    return {};
  }
  s = s||{};
  try{
    str = JSON.stringify(s);
    localStorage.setItem(hashhash,str);
  }catch(ex){
    console.log("JSON stringify error.",ex);
  }
  console.log("state saved.");
}
var s = loadState()||{};

// -- SHOW CONTENT
function _isTeaser(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  if(window.isInIFrame && (w < 300 || h <= 300)) return true;
  return false; 
}
function renderBlinkot(){
  var dCreated      = o.time?new Date(o.time):new Date(); 
  var dCreatedDate  = dCreated.getFullYear()+"/"+(dCreated.getMonth()+1)+"/"+dCreated.getDate();
  document.title    = (o.title||"No title...") + " - " + dCreated;
  var navtitle      = escapeHTML(o.title)||"<i>No title...</i>";
  document.getElementById("otitle").innerHTML = navtitle;
  // --
  var themeClass = (o.theme&&themeNames[o.theme])?"th_"+o.theme:"";
  document.body.setAttribute("class",themeClass);
  // --
  var typetxt = typeNames[o.type]||"??";
  document.getElementById("otype").innerHTML  = typetxt;
  document.getElementById("otype2").innerHTML = typetxt;
  // --
  if(_isTeaser()){
    // --
    console.log("SHOW AS TEASER");
    var h   = window.innerHeight;
    var lh  = h;
    document.getElementById("otitle2").style.lineHeight = lh+"px";
    document.getElementById("otype2").style.lineHeight  = lh+"px";
    document.getElementById("bigclickr").style.display  = "block";
    document.getElementById("bigclickra").href    = window.location.href;
    document.getElementById("bigclickra").title   = navtitle;
    document.getElementById("otitle2").innerHTML  = navtitle;
    // --
  }else{
    // --
    console.log("SHOW AS VIEW");
    document.getElementById("otitle").innerHTML   = navtitle;
    document.getElementById("mainviewtop").style.display  = "block";
    document.getElementById("mainscroller").style.display = "block";
    // --
    var html = "";
    if(typeNames[o.type] && mods[o.type]){
      console.log("Rendering: "+typeNames[o.type]);
      html = mods[o.type](o.c);
    }else{
      requestMod(o.type);
    } 
    document.getElementById("ocontent").innerHTML = html;
    // --
    if(!o.title){
      console.log("No title --> jump to editing (first time here?)");
      setTimeout(openEditor,50); 
    }
    // --
  }
  // --
  document.getElementById("mainscroller").scrollTop = 0;
}

// -- EDITOR
var editingChanged  = false; // something changed since editor opened?
var editObjAtOpen   = {};    // original object before editing.
var maxLenContent   = 1920;
var maxLenTitle     = 88; 
// editor: openers
function openEditor(){
  editingChanged        = false;
  editObjAtOpen         = clone(o);
  updateEditorView();
  document.getElementById("zeditor").style.display = "block";
}
// editor: closers
function _preCloseRootPropSync(){
  var title   = stripExtraWhitespace(document.getElementById("ititle").value||"");
  if(o.title != title){o.title = title; editingChanged = true;}
  var c       = stripExtraWhitespace(document.getElementById("icontent").value||"");
  if(o.c     != c){o.c = c; editingChanged = true;}
  var type    = document.getElementById("itype").value||"h";
  if(o.type  != type){o.type = type; editingChanged = true;}
  var theme   = document.getElementById("itheme").value||"a";
  if(o.theme != theme){o.theme = theme; editingChanged = true;}
} 
function closeEditor(dontconfirm){
  console.log("Closing editor.");
  _preCloseRootPropSync();
  if(!o.title) return alert("You must include a title.");
  if(!o.c)     return alert("You must include some content.");
  // --
  if(editingChanged && !dontconfirm && !confirm("Close without saving changes?")) return;
  if(editingChanged){
    if(!editObjAtOpen.title) return alert("You must include a title.");
    if(!editObjAtOpen.c)     return alert("You must include some content.");
    console.log("EditingChanged, but canceled -> reverting to original o.");
    o = editObjAtOpen;
  }
  // --
  document.getElementById("maineditor").scrollTop = 0;
  document.getElementById("zeditor").style.display = "none";
}
function saveAndCloseEditor(){
  console.log("Saving and closing editor."); 
  _preCloseRootPropSync();
  if(!o.title) return alert("You must include a title.");
  if(!o.c)     return alert("You must include some content.");
  if((enc64(o.c)||"").length > maxLenContent)   return alert("Your Content is too long.");
  if((enc64(o.title)||"").length > maxLenTitle) return alert("Your Title is too long.");
  // --
  if(!editingChanged){
    console.log("no changes in editor. just closing.");
    document.getElementById("maineditor").scrollTop = 0;
    document.getElementById("zeditor").style.display = "none";
    return;
  }
  // --
  console.log("CHANGED -> Will save, update, and reload.");
  var date32 = new Date().getTime().toString(32);
  var newHash = enc64(o.title||"")+"_"+o.theme+"_"+o.type+"_"+enc64(o.c||"")+"_"+date32;
  window.hashhash = newHash.hashCode(); 
  delete s.shortURL; 
  saveState(s);
  updateHash(newHash,true,false);
  renderBlinkot();
  // --
  document.getElementById("maineditor").scrollTop = 0;
  document.getElementById("zeditor").style.display = "none"; 
}
function onEditorCloseBtnDn(){
  closeEditor();
}
// editor: viewing
function updateEditorView(){
  document.getElementById("ititle").value   = o.title||"";
  document.getElementById("icontent").value = o.c||"";
  document.getElementById("itype").value    = o.type||"h";
  document.getElementById("itheme").value   = o.theme||"a";
  onContentChanged();
  onTitleChanged();
}
var lastContent   = null; 
function onContentChanged(el){
  if(!el) el = document.getElementById("icontent");
  var txt = el.value||"";
  if(txt == lastContent) return;
  lastContent = txt;
  // --
  var len       = (enc64(txt)||"").length;
  var charLeft  = Math.floor((maxLenContent - len)*0.75);
  document.getElementById("icontentcount").innerHTML = "~ "+Math.abs(charLeft);
  var leftClass = null;
  if(charLeft < 100 && charLeft >= 0) leftClass = "close";
  if(charLeft < 0) leftClass = "over";
  document.getElementById("icontentcount").setAttribute("class", leftClass);
}
var lastTitle     = null;
function onTitleChanged(el){
  if(!el) el = document.getElementById("ititle");
  var txt = el.value||"";
  if(txt == lastTitle) return;
  lastTitle = txt;
  // --
  var len       = (enc64(txt)||"").length;
  var charLeft = Math.floor((maxLenTitle - len)*0.75);
  document.getElementById("ititlecount").innerHTML = "~ "+Math.abs(charLeft);
  var leftClass = null;
  if(charLeft < 10 && charLeft >= 0) leftClass = "close";
  if(charLeft < 0) leftClass = "over";
  document.getElementById("ititlecount").setAttribute("class", leftClass);
}

// -- SHARING (uses s = savedSate object).
var lastShareURL = "";
function getShortURL(getShort, cb){
  if(s.shortURL) return cb(s.shortURL);
  // --  
  if(!getShort) return cb(window.location.href);
  // --
  console.log("Using URL shortener...");
  // see: https://developers.google.com/url-shortener/v1/getting_started
  try{
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("POST", "https://www.googleapis.com/urlshortener/v1/url", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function(){
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try{
          var responseJSON = JSON.parse(xmlhttp.responseText);
          var shortURL = (responseJSON||{}).id;
          console.log("URL Shortener: Ready to use --> "+shortURL);
          lastShareURL = shortURL; 
          s.shortURL = shortURL;
          saveState(s);
          cb(shortURL);
        }catch(ex){
          console.log("Couldn't parse URL shortener JSON.", ex, xmlhttp);
          cb(null);
        }
      }
    };
    xmlhttp.onerror = function(err){
      console.log("Request error. ", err);
      cb(null);
    };
    var params = {
      "longUrl": window.location.href
    };
    xmlhttp.send(JSON.stringify(params));
  }catch(ex){
    console.log("Error fetching URL shortener. Cancel share.", ex); 
    cb(null);
  }
}
function showShare(forceShortener){
  document.getElementById("zsharebox").style.display      = "none";
  document.getElementById("zshareboxembed").style.display = "none";
  document.getElementById("zshare").style.display         = "block";
  document.getElementById("zsharewait").innerHTML         = "";
  document.getElementById("zshareurl").innerHTML          = ""; 
  // --
  getShortURL(forceShortener, function(shortURL){
    if(!shortURL){
      console.log("Bummer. no share URL.");
      document.getElementById("zsharewait").innerHTML = "Try again later.";
      setTimeout(hideShare, 200);
      hideShare();
      return;
    }
    // --
    document.getElementById("zshareshrtreq").style.display = s.shortURL?"none":"block";
    // --
    console.log("OK, share away via: "+shortURL);
    // --
    var toTweet     = o.title; //+" by "+o.by;
    var toToTweet   = toTweet.replace(/ /gi, "+");
    var mediaURL    = encodeURIComponent(shortURL);
    var hashtags    = "blinkot"; // related twitter #hashtag when sharing if desired.
    var relatedUser = ""; // releated twitter @user when sharing if desired.
    // --
    var urlTwitter  = 'http://twitter.com/intent/tweet?'+
      'text='+encodeURIComponent(toTweet)+
      (hashtags?'&hashtags='+hashtags:'')+
      (relatedUser?'&related='+relatedUser:'')+
      '&url='+mediaURL;
    var urlFacebook = "http://www.facebook.com/sharer.php?t="+encodeURIComponent(toTweet+" #blinkot")+"&u="+mediaURL;
    var urlGplus    = "https://plus.google.com/share?url="   +mediaURL;
    // --
    document.getElementById("sharelink_direct").href      = shortURL;
    document.getElementById("sharelink_twitter").href     = urlTwitter;
    document.getElementById("sharelink_facebook").href    = urlFacebook;
    document.getElementById("sharelink_googleplus").href  = urlGplus;
    // --
    document.getElementById("embedtextarea").innerHTML  = "<iframe src='"+shortURL+"' frameborder='0' style='width:320px; height:45px;'></iframe>";
    document.getElementById("zsharebox").style.display  = "block";
    document.getElementById("zshareurl").innerHTML      = escapeHTML(shortURL);
  });
}
function showShareEmbedcode(){
  console.log("TODO: show embed code;");
  document.getElementById("zshareboxembed").style.display = "block";
}
function hideShareEmbedcode(){
  document.getElementById("zshareboxembed").style.display = "none";
}
function hideShare(){
  document.getElementById("zshare").style.display = "none";
}

// -- READY: Setup main view and show the current step.
function onReady(){
  renderBlinkot();
}
// --
if(document.addEventListener) {
  document.addEventListener("DOMContentLoaded", function(){
    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
    if(window.innerHeight && window.innerWidth) onReady();
    else setTimeout(onReady,70);
  }, false);
}else{
  console.log("Warn: is this IE?");
  if(window.innerHeight && window.innerWidth) onReady();
  else setTimeout(onReady,70);
}

