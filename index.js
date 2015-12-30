var rs = /^\[([^\]]*)\]/;
var rl = /^([\w\s]*)(?:\[(\w*)\])?=(.*)$/;
module.exports = function(content,locale){
  var lines = content.split("\n");
  var obj = {};
  var currentSection;
  var tmp;
  lines.forEach(function(line){
    if(line.indexOf(";") == 0){
      return ; //Comment line
    }else if(rs.test(line)){
      currentSection = rs.exec(line)[1];
      obj[currentSection] = {};
    }else{
      tmp = rl.exec(line);
      if(tmp && tmp[1] && tmp[3] && typeof obj[currentSection][tmp[1]] == "undefined"){
        obj[currentSection][tmp[1]] = tmp[3]
      }else{
        //Ignore silent lines
      }
    }
  });
  return obj;
}
