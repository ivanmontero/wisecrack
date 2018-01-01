var fs = require("fs");
var handlebars = require("handlebars");

const TEMPLATE_DIR = __dirname + "/templates/";

var templates = null;

module.exports = function() {
    console.log(templates==null);
    if(templates == null) {
        templates = {};
        var files = fs.readdirSync(TEMPLATE_DIR);
        for(var file of files) {    
            var src = fs.readFileSync(TEMPLATE_DIR + file, "utf8");
            var template = handlebars.compile(src);
            templates[file.substring(0, file.indexOf(".html"))] = template;
        }
    }

    return templates;
}
