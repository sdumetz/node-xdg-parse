var path = require("path");
var fs = require("fs");
var parse = require("../index.js")
var cases = [
  {name:'fooview',infile:'fooview.desktop',outfile:"fooview.json"}
, {name:'desktop theme',infile:'index.theme',outfile:"index.json"}
, {name:'desktop theme [sv]',infile:'index.theme',outfile:"index_sv.json",locale:"sv"}
]


function loader (obj){
  return Promise.all([
    new Promise(function(resolve, reject) {
      fs.readFile(path.resolve(__dirname,"fixtures",obj.infile),{encoding:'utf8'},function(err,data){
        if(err)return reject(err);
        resolve(data);
      });
    }),
    new Promise(function(resolve, reject) {
      fs.readFile(path.resolve(__dirname,"fixtures",obj.outfile),{encoding:'utf8'},function(err,data){
        if(err)return reject(err);
        resolve(JSON.parse(data));
      });
    })
  ]).then(function(r){return {in:r[0],out:r[1]}});
}

describe("parseXdgFile",function(){
  cases.forEach(function(obj){
    it("parse : "+obj.name+((obj.locale)?" ["+obj.locale+"]":""),function(done){
      loader(obj).then(function(data){
        expect(parse(data.in,obj.locale)).to.deep.equal(data.out);
        done();
      }).catch(function(e){process.nextTick(done.bind(this,e))});
    })
  });
})
