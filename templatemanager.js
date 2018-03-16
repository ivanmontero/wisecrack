/**
 * templatemanager.js handles the loading and accessing of templates. It 
 * precompiles all the templates, and stores them so they can be reused rather 
 * than recreated each time.
 */

/***** Module Imports *****/
var fs = require("fs");
var handlebars = require("handlebars");

/** The directory where all templates are located */
const TEMPLATE_DIR = __dirname + "/templates/";

/** Contains all the templates in a single instance */
var templates = null;

/** Export the getTempaltes function */
module.exports = function() {
    // Loads all the templates into memory, if needed.
    if(templates == null) {
        templates = {};
        // Loads all templates in directory
        var files = fs.readdirSync(TEMPLATE_DIR);
        for(var file of files) {    
            var src = fs.readFileSync(TEMPLATE_DIR + file, "utf8");
            // Compiles the tempalates
            var template = handlebars.compile(src);
            // Stores templates by their name
            templates[file.substring(0, file.indexOf(".html"))] = template;
        }
        // Makes the templates object immutable
        Object.freeze(templates);
    }

    /**
     * Returns the template assocated with the passed-in name, and evaluated
     * with the optional data.
     * 
     * @param {string} name The name of the desired template
     * @param {object} data The data to load into the template
     */
    this.getTemplate = function(name, data = {}) {
        return templates[name](data);
    }
}
