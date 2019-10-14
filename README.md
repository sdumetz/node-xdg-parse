# node-xdg-parse
XDG configuration files syntax parser

### Usage :

    var {parse} = require("xdg-parse");
    fs.readFile("your_conf_file",function(err,data){
      if(err){
        //Do something
      }
      var conf = parse(data);
    })

### Localized entries

Freedesktop offers the possibility to localize comments, names, etc... like :

    [Section]
    Name=app name
    Name[fr]= nom du programme

By giving xdg-parse an extra *locale* argument, one can retrieve those lines instead of the default when available.

    parse(data,"fr"); //locale is case insensitive

### Serialization

data can be serialized back to a text file. However it is not compliant with the specification as the serialized file is stripped of its comments and blank lines.

### Improvements

Array are not parsed. That's because I could not find strong evidence under which circumstances a comma / semicolon separated list of values should be considered an array. It seems to be up to the implementor to choose which keys are to be a list and which are to be plain text.


### Contributing

feel free to provide any test material that might prove this parser faulty.
