// JSCatalyst Generator
let Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    ncp = require('ncp'),
    path = require('path'),
    npmAddScript = require('npm-add-script'),
    _ = require('lodash'),
    extend = _.merge,
    fs = require('fs');

const NPM_DEPS = {
    deps: ['vue', 'jscatalyst'],
    devDeps: ['@vue/cli-plugin-babel', '@vue/cli-service', 'vue-template-compiler']
};

const CHOICE_VUEX = "Vuex";
const CHOICE_THEME = "Custom Themeing";



// The generator to be exported.
module.exports = class extends Generator {
    // Set up prompts.
    prompting() {
        this.log(yosay('Welcome to the JSCatalyst generator!'));

        const prompts = [
            {
                type: "checkbox",
                name: "extras",
                message: "Which additional services would you like?",
                choices: [CHOICE_VUEX, CHOICE_THEME]
            }
        ];

        return this.prompt(prompts)
                    .then((answers) => {
                        this.extras = answers.extras;
                    });

    }

    // Call the vue cli to create an empty vue project.
    configuring() {
        return new Promise( (resolve, reject) => {
            this.log("Creating a new vue project...");
            
            if (this.extras.includes(CHOICE_VUEX)) {
                NPM_DEPS.deps.push('vuex');
            }

            if (this.extras.includes(CHOICE_THEME)) {
                NPM_DEPS.deps.push('vuetify')
            }

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
                let mainFile = fs.readFileSync(path.join(this.destinationRoot(), 'src/main.js'), 'utf8');

                // Apply vuex templating.
                if (this.extras.includes(CHOICE_VUEX)) {
                    
                    let importVuex  = `import Vuex from 'vuex'`,
                        createStore = `const store = new Vuex.Store({})`,
                        useVuex     = `Vue.use(Vuex)`,
                        configStore = `store`;

                    mainFile = mainFile.replace('{{import_vuex}}', importVuex);
                    mainFile = mainFile.replace('{{create_store}}', createStore);
                    mainFile = mainFile.replace('{{vue_use_vuex}}', useVuex);
                    mainFile = mainFile.replace('{{vue_config_store}}', configStore);

                } else {
                    mainFile = mainFile.replace('{{import_vuex}}', '');
                    mainFile = mainFile.replace('{{create_store}}', '');
                    mainFile = mainFile.replace('{{vue_use_vuex}}', '');
                    mainFile = mainFile.replace('{{vue_config_store}}', '');
                }

                // Apply themeing templating.
                if (this.extras.includes(CHOICE_THEME)) {
                    let importVuetify        = `import Vuetify from 'vuetify'`,
                        importThemeingPlugin = `import { ThemePlugin } from 'jscatalyst'`,
                        useVuetify           = `Vue.use(Vuetify)`,
                        useThemeingPlugin    = `Vue.use(ThemePlugin, {store, custom: true})`;

                    mainFile = mainFile.replace('{{import_vuetify}}', importVuetify);
                    mainFile = mainFile.replace('{{import_themeing_plugin}}', importThemeingPlugin);
                    mainFile = mainFile.replace('{{vue_use_vuetify}}', useVuetify);
                    mainFile = mainFile.replace('{{vue_use_themeing_plugin}}', useThemeingPlugin);
                } else {
                    mainFile = mainFile.replace('{{import_vuetify}}', '');
                    mainFile = mainFile.replace('{{import_themeing_plugin}}', '');
                    mainFile = mainFile.replace('{{vue_use_vuetify}}', '');
                    mainFile = mainFile.replace('{{vue_use_themeing_plugin}}', '');
                }

                fs.writeFileSync(path.join(this.destinationRoot(), 'src/main.js'), mainFile);
                
                this.log("Done copying files!");
                resolve();
            })
        });
    }

    // NPM Dependencies installation.
    install () {
        if (!this.options['skip-install']) {
            this.log('Installing dependencies...');
            
            return Promise.all([
                this.npmInstall(NPM_DEPS.devDeps, { 'save-dev': true }),
                this.npmInstall(NPM_DEPS.deps, { 'save': true })
            ]);
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