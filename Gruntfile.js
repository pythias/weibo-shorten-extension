module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: { 
                "browser": true,
                "moz": true,
                "strict": false,
                "esversion": 6,
                "globals": {
                    "chrome": false, 
                    "shortenOnNewTab": true,
                    "alert": false
                }
            },
            all: ["src/*.js", "Gruntfile.js"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("travis", ["jshint"]);
};
  