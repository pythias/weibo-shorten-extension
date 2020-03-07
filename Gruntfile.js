module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: ["src/*.js", "Gruntfile.js"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("travis", ["jshint"]);
};
  