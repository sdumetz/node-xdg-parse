var path = require("path");
var fs = require("fs");
var parse = require("../index.js")
var cases = [
  {name:'fooview',infile:'fooview.desktop',outfile:"fooview.json"}
, {name:'desktop theme',infile:'index.theme',outfile:"index.json"}
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
    describe("parse"+obj.name,function(){
      var data = {in:"",out:{}};
      before(function(done){
        loader(obj).then(function(readdata){
          data = readdata;
          done();
        }).catch(function(e){process.nextTick(done.bind(this,e))});
      });

      it("without locale",function(){
        expect(parse(data.in)).to.deep.equal(data.out);
      })

    })
  });
})
