const match_section = /^\[([^\]]*)\]/;
const match_line = /^([^\[=]*)(?:\[(\w*)\])?=(.*)$/;
const match_comment = /^[;#]/;
const match_arrval = /(^|[^\\]);/g;
const cleanup = function(val){ //remove leading spaces, trailing spaces and ";"
  return val.replace(/([\s;]+$)|(^\s*)/g,"");
}
function parse(content,locale){
  if(typeof content !== "string"){
    throw new Error(`data must be a string. got ${typeof content}`)
  }
  var lines = content.split("\n");
  var obj = {};
  var currentSection;
  var tmp;
  lines.forEach(function(line, lineNumber){
    if(match_comment.test(line) || line.length == 0){
      return ; //Comment or empty line
    }else if(match_section.test(line)){
      //Open new section
      currentSection = cleanup(match_section.exec(line)[1]);
      obj[currentSection] = {};
    }else{
      //Add a line to current section
      tmp = match_line.exec(line);
      if(tmp && tmp[1] && tmp[3]){
        tmp[1] = cleanup(tmp[1]);
        tmp[3] = cleanup(tmp[3]);
        if(match_arrval.test(tmp[3])){
          tmp[3] = splitArrayValue(tmp[3]);
        }
        if(typeof obj[currentSection][tmp[1]] == "undefined" || !tmp[2] && !locale){
          //re-definition of a line is sort-of permitted
          obj[currentSection][tmp[1]] = tmp[3]
        } else if(tmp[2] && locale && cleanup(tmp[2]).toUpperCase() == locale.toUpperCase()){
          obj[currentSection][tmp[1]] = tmp[3]
        } else {
          // line's locale is set, but no locale was requested 
          // we don't care about this value
        }
      }else{
        throw new Error(`Malformed data (line ${lineNumber}) : ${line} is not a valid line`);
      }
    }
  });
  return obj;
}

function splitArrayValue(val) {
  sep = 'SPLIT-MARK-' + Math.random();
  val = val.replace(/([^\\]);$/g, '$1').replace(match_arrval, '$1'+sep).split(sep);
  return val;
}

function serialize(obj){
  const top_keys = Object.keys(obj);
  const lines = [];
  for(let top_key of top_keys){
    const items = obj[top_key]
    if(!items) continue;
    const int_keys = Object.keys(items);
    lines.push(`[${top_key}]`, ... int_keys.map((key)=> `${key}=${items[key]}`))
  }
  return lines.join("\n");
}

module.exports = {parse, serialize};
