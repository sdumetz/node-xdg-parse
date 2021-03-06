'use strict';
var path = require("path");
const fs = require("fs");
const {readFile} = fs.promises;

const {parse, serialize} = require("../index.js")

let cases = fs.readdirSync(path.resolve(__dirname, "fixtures"));


function load(file){
  return readFile(path.resolve(__dirname,"fixtures", file), {encoding: "utf8"});
}

describe("parse : ",function(){

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
  it("parse string with only whitespaces", function(){
    expect(parse("      ")).to.deep.equal({});
  })

  it("Force array value for known plural key", function(){
    expect(parse(`
      [Desktop Entry]
      Categories=OneCategory
      UnknownPlural=val1;val2;
      UnknownSingular=OneValue
    `))
    .to.deep.equal({
      'Desktop Entry': {
        Categories: ['OneCategory'],
        UnknownPlural: ['val1', 'val2'],
        UnknownSingular: 'OneValue'
      }
    });
  })

  it("split multiple line breaks", function(){
    expect(parse(`[FOO]\n\nbar=hello world`)).to.deep.equal({FOO:{bar:"hello world"}});
  })
  it("ignore trailing line break", function(){
    expect(parse(`[FOO]\n\nbar=hello world\n`)).to.deep.equal({FOO:{bar:"hello world"}});
  })
  it("split CRLF lines (duh!)", function(){
    expect(parse(`[FOO]\r\nbar=hello world`)).to.deep.equal({FOO:{bar:"hello world"}});
  })

  it("parse boolean types", function(){
    expect(parse(`[FOO]\nbar=true`)).to.deep.equal({FOO:{bar:true}});
  })

  it("can parse empty string values", function(){
    expect(parse(`[FOO]\nbar=\n`)).to.deep.equal({FOO:{bar:""}});
  })

  it("can parse a locale", function(){
    return load(path.resolve(__dirname, "fixtures", "index.theme"))
    .then((data)=>{
      expect(parse(data, "sv")).to.matchSnapshot();
      expect(parse(data, "fr")).to.matchSnapshot();
    })
  })

  it("can parse a locale with country, encoding and modifier",  function(){
    const de = `[FOO]\n
      Name[fr]=couleur\n
      Name[en]=color\n
      Name[en_GB]=colour\n
    `;
    expect(parse(de, "en")).to.deep.equal({FOO:{Name:"color"}});
    expect(parse(de, "en_GB")).to.deep.equal({FOO:{Name:"colour"}});
    //Should be matching closest locale
    //expect(parse(de, "en_AU")).to.deep.equal({FOO:{Name:"color"}});
  })

  cases.forEach(function(file){
    it(`parse(${file})`, function(){
      return load(file).then(function(data){
        //Update snapshots with CHAI_JEST_SNAPSHOT_UPDATE_ALL=true
        expect(parse(data)).to.matchSnapshot();
      });
    })
  });

})

describe("serialize : ",function(){
  cases.forEach(function(file){
    it(`serialize ${file}`, function(){
      return load(file)
      .then(d => parse(d))
      .then(function(data){
        const output_data = parse(serialize(data));
        expect(output_data).to.deep.equal(data);
      });
    });
  });
})


