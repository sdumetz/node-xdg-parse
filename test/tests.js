var path = require("path");
var fs = require("fs");
var {parse, serialize} = require("../index.js")
var cases = [
  {infile:'fooview.desktop',outfile:"fooview.json"}
, {infile:'index.theme',outfile:"index.json"}
, {infile:'index.theme',outfile:"index_sv.json",locale:"sv"}
, {infile:'index.theme',outfile:"index_fr.json",locale:"fr"}
, {infile:'mimeapps.list',outfile:"mimeapps.json"}
, {infile:'comments.desktop',outfile:"comments.json"}
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

describe("parse : ",function(){
  cases.forEach(function(obj){
    it(obj.infile+((obj.locale)?" ["+obj.locale+"]":""),function(){
      return loader(obj).then(function(data){
        expect(parse(data.in, obj.locale)).to.deep.equal(data.out);
      });
    })
  });

  it("throw on invalid parameter", function(){
    expect(()=>{ parse(null)}).to.throw(Error);
    expect(()=>{ parse({})}).to.throw(Error);
  })
  it("throw on invalid line", function(){
    expect(()=>{ parse("hello world")}).to.throw(Error);
  })

  it("parse empty string", function(){
    expect(parse("")).to.deep.equal({});
  })

})
describe("serialize : ",function(){
  cases.forEach(function(obj){
    if(obj.locale) return;
    it(obj.infile, function(){
      return loader(obj).then(function(data){
        const output_data = parse(serialize(data.out));
        expect(output_data).to.deep.equal(data.out);
      });
    });
  });
})
