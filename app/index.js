// JSCatalyst Generator
let Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    ncp = require('ncp'),
    path = require('path'),
    npmAddScript = require('npm-add-script'),
    _ = require('lodash'),
    extend = _.merge;

const NPM_DEPS = {
    deps: ['vue', 'jscatalyst'],
    devDeps: ['@vue/cli-plugin-babel', '@vue/cli-service', 'vue-template-compiler']
};



// The generator to be exported.
module.exports = class extends Generator {
    // Set up prompts.
    prompting() {
        this.log(yosay('Welcome to the JSCatalyst generator!'));
    }

    // Call the vue cli to create an empty vue project.
    configuring() {
        return new Promise( (resolve, reject) => {
            this.log("Creating a new vue project...");

            let npmCmd = this.spawnCommand('npm', ['init']);

            npmCmd.on('close', (code) => {
                // Add the vue scripts needed.
                try {
                    npmAddScript({
                        key: 'serve', value: 'vue-cli-service serve'
                    });

                    npmAddScript({
                        key: 'build', value: 'vue-cli-service build'
                    });

                    resolve();
                } catch (e) {
                    if (e.code === 'ENOENT') {
                        this.log("There was an error adding the Vue CLI scripts to your package.json");
                        reject();
                    }
                }
            });
        });
    }

    // Copy over the JSCatalyst setup files.
    writing() {
        this.log("Copying over files...");
        
        return new Promise( (resolve, reject) => {
            // Copy over the template files.
            ncp(this.sourceRoot(), this.destinationRoot(), (err) => {
                this.log("Done copying files!");
                resolve();
            })
        });
    }

    // NPM Dependencies installation.
    install () {
        if (!this.options['skip-install']) {
            this.log('Installing dependencies...');
            this.npmInstall(NPM_DEPS.deps, { 'save': true })
            
            return this.npmInstall(NPM_DEPS.devDeps, { 'save-dev': true });
        }
    }

    // Closing ceremony
    end() {
        this.log(yosay("Your JSCatalyst project is set up and ready to go!"));
        this.log('Run `npm run serve` and navigate to http://localhost:8080 to see your app.');
        this.log('An example Line Chart Component has been created for you as a reference point.');
        this.log('Check out the github for more information: https://github.com/EikosPartners/jscatalyst');
    }
}