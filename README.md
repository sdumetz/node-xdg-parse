# node-xdg-parse
XDG configuration files syntax parser

### Usage :

    var parser = require("xdg-parse");
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

### Contributing

feel free to provide any test material that might prove this parser faulty.
