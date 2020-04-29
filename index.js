const match_section = /^\[([^\]]*)\]/;
const match_line = /^([^\[=]*)(?:\[([-\w@]+)\])?=(.*)$/;
const match_comment = /^[;#]/;
const match_arrval = /(^|[^\\]);/g;
function cleanup (val){ //remove leading spaces, trailing spaces and ";"
  return val.replace(/([\s;]+$)|(^\s*)/g,"");
}

function interpolate(val){
  switch(val){
    case "true":
      return true;
    case "false":
      return false;
    default:
      return /^(?:\d*\.)?\d+$/.test(val)?  parseFloat(val) : val;
  }
}


function parse(content,locale){
  if(typeof content !== "string"){
    throw new Error(`data must be a string. got ${typeof content}`)
  }
  var lines = content.split(/\r?\n/);
  var obj = {};
  var currentSection;
  lines.forEach(function(line, lineNumber){
    line = line.trim();
    if(match_comment.test(line) || line.length == 0){
      return ; //Comment or empty line
    }else if(match_section.test(line)){
      //Open new section
      currentSection = cleanup(match_section.exec(line)[1]);
      obj[currentSection] = {};
    }else{
      //Add a line to current section
      let tmp = match_line.exec(line);
      if(tmp && tmp[1]){
        const key = cleanup(tmp[1]);
        const key_locale = tmp[2]? cleanup(tmp[2]): undefined;
        let value = cleanup(tmp[3] || "");
        if(match_arrval.test(value)){
          value = splitArrayValue(value);
        }

        if(["Version"].indexOf(key) === -1){
          /* Manually define a list of known-to-be-a-strings keys*/
          value = interpolate(value);
        }

        if(typeof obj[currentSection][key] == "undefined" || !key_locale && !locale){
          //re-definition of a line is sort-of permitted
          obj[currentSection][key] = value;
        } else if(key_locale && locale && key_locale.toUpperCase() == locale.toUpperCase()){
          obj[currentSection][key] = value;
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
    lines.push(`[${top_key}]`, ... int_keys.map((key)=> {
      if(Array.isArray(items[key])){
        return `${key}=${items[key].join(";")}`;
      }else{
        return `${key}=${items[key]}`
      }
    }))
  }
  return lines.join("\n");
}

module.exports = {parse, serialize, interpolate, splitArrayValue};
