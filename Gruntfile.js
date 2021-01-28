module.exports = function (grunt) {
    grunt.initConfig({
        pkg: require('./package.json'),
        manifest: require('./src/manifest.json'),
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
        },
        crx: {
            options: {
                privateKey: "dist/shorten.pem"
            },
            staging: {
                src: [
                    "src/**/*",
                    "!*.pem"
                ],
                dest: "dist/staging/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
            },
            production: {
                files: {
                    "dist/production/<%= pkg.name %>-<%= manifest.version %>.zip": [
                        "src/**/*",
                        "!*.pem"
                    ],
                    "dist/production/<%= pkg.name %>-<%= manifest.version %>.crx": [
                        "src/**/*",
                        "!*.pem"
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-crx");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("travis", ["jshint"]);
    grunt.registerTask("build", ["jshint", "crx"]);
};
