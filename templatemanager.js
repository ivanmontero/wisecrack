/**
 * templatemanager.js handles the loading and accessing of templates. It 
 * precompiles all the templates, and stores them so they can be reused rather 
 * than recreated each time.
 */

// Imports
var fs = require("fs");
var handlebars = require("handlebars");

/** The directory where all templates are located */
const TEMPLATE_DIR = __dirname + "/templates/";

var templates = null;

module.exports = function() {
    if(templates == null) {
        templates = {};
        var files = fs.readdirSync(TEMPLATE_DIR);
        for(var file of files) {    
            var src = fs.readFileSync(TEMPLATE_DIR + file, "utf8");
            var template = handlebars.compile(src);
            templates[file.substring(0, file.indexOf(".html"))] = template;
        }
        Object.freeze(templates);
    }

    this.getTemplate = function(name, data = {}) {
        return templates[name](data);
    }
}
