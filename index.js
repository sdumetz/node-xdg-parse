const match_section = /^\[([^\]]*)\]/;
const match_line = /^([^\[=]*)(?:\[(\w*)\])?=(.*)$/;
const match_comment = /^[;#]/;
const cleanup = function(val){ //remove leading spaces, trailing spaces and ";"
  return val.replace(/([\s;]+$)|(^\s*)/g,"");
}
module.exports = function(content,locale){
  var lines = content.split("\n");
  var obj = {};
  var currentSection;
  var tmp;
  lines.forEach(function(line){
    if(match_comment.test(line)){
      return ; //Comment line
    }else if(match_section.test(line)){
      currentSection = cleanup(match_section.exec(line)[1]);
      obj[currentSection] = {};
    }else{
      tmp = match_line.exec(line);
      if(tmp && tmp[1] && tmp[3]){
        tmp[1] = cleanup(tmp[1]);
        tmp[3] = cleanup(tmp[3]);
        if(typeof obj[currentSection][tmp[1]] == "undefined"){
          obj[currentSection][tmp[1]] = tmp[3]
        }else if(tmp[2] && locale && cleanup(tmp[2]).toUpperCase() == locale.toUpperCase()){
          obj[currentSection][tmp[1]] = tmp[3]
        } //Undocumented behaviour if we have twice the same key in a section?
        //We just ignore
      }else{
        //Ignore silent lines
      }
    }
  });
  return obj;
}
