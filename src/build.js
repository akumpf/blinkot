//
// Blinkot index.html builder.
//
// Run using node.js from the commandline.
//
// --
console.log(".---------------------------.");
console.log("| Building Blinkot from src |");
console.log("| ensure: NPM install -g ...|");
console.log("|         uglify-js, less   |");
console.log("`---------------------------'");
// --

var compressCSS = true;
var compressJS  = true;
var absSrcDir   = ".";
var absOutDir   = "../";
var absOutFile  = "../index.html"; 

// --
var fs      = require('fs');
var less    = require('less');
var uglify  = require('uglify-js');
// --

// Read HTML
var indexStr  = fs.readFileSync(absSrcDir+"/index.html",  {encoding: "utf-8"})||"";
console.log("READ: index.html:            "+indexStr.length);

// Read LESS
var lessStr   = fs.readFileSync(absSrcDir+"/blinkot.less", {encoding: "utf-8"})||"";
console.log("READ: blinkot.less:          "+lessStr.length);

// Convert LESS -> CSS and minify.
var cssStr = "";
try{
  var parser = new less.Parser({});
  parser.parse(lessStr, function(err, cssTree){
    if(err) return console.log(less.writeError(err, options));
    // Create the CSS from the cssTree
    cssStr = cssTree.toCSS({
      compress   : compressCSS,
      yuicompress: false
    });
    if(!compressCSS){
      cssStr = cssStr.replace(/\n\ \ /g, "\n"); 
    }else{
      cssStr = cssStr.replace(/\}/g, "}\n"); // drastically helps readability.
    }
  });
}catch(ex){
  console.log(" ** Error parsing less file. **");
  console.log(ex);
  return process.exit();
} 
console.log("READ: -> blinkot.css:        "+cssStr.length);

// Read JS
var jsStr    = fs.readFileSync(absSrcDir+"/blinkot.js",  {encoding: "utf-8"})||"";
console.log("READ: blinkot.js:            "+jsStr.length);

// Minify JS?
if(compressJS){
  try{
    var result  = uglify.minify(jsStr, {fromString: true});
    jsStr       = result.code;
    console.log("READ: --> blinkot.js.min:    "+jsStr.length);
  }catch(ex){
    console.log("** ERROR: JS parse error during minify. **");
    console.log(ex);
    return process.exit();
  }
}

//  CSS Replacement
indexStr = indexStr.replace('<!-- LESS -->',"<!-- CSS via LESS -->");
indexStr = indexStr.replace('<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.0/less.min.js"></script>\n',"");
indexStr = indexStr.replace('<link rel="stylesheet/less" type="text/css" href="blinkot.less" />', "<style>\n"+cssStr+"\n</style>"); 
console.log("READ: index.html + css:      "+indexStr.length);

// JS Replacement
indexStr = indexStr.replace('<!-- JS -->',"<!-- Minified JS -->");
indexStr = indexStr.replace('<script src="./blinkot.js"></script>', "<script>\n"+jsStr+"\n</script>");
console.log("READ: index.html + css + js: "+indexStr.length);

// Write to outpu file
console.log(" - - - - WRITING FILE - - - -");
fs.writeFileSync(absOutFile, indexStr, 'utf8');

// minify modules...
var modsToLoad = ["m"];
for(var i=0; i<modsToLoad.length; i++){
  var modLetter = modsToLoad[i];
  var jsModStr    = fs.readFileSync(absSrcDir+"/mod_"+modLetter+".js",  {encoding: "utf-8"})||"";
  console.log("READ:  mod_"+modLetter+".js:             "+jsModStr.length);
  if(compressJS){
    try{
      var result  = uglify.minify(jsModStr, {fromString: true});
      jsModStr    = result.code;
      //console.log("READ: --> mod_"+modLetter+".js.min:    "+jsModStr.length);
    }catch(ex){
      console.log("** ERROR: JS parse error during minify. **");
      console.log(ex);
      return process.exit();
    }
  }
  console.log("WRITE: mod_"+modLetter+".js:             "+jsModStr.length);
  fs.writeFileSync(absOutDir+"mod_"+modLetter+".js", jsModStr, 'utf8');
}

console.log(" - - - - - D O N E! - - - - -");




