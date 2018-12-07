# AngularSpin

## Installing

* Update node to version 8+
* `npm install -g @angular/cli`
* `npm install @angular/cli`
* `npm install`

-----------------

## Executing

* `ng serve --open` run the app in development mode
* `npm run build:development` compiles /dist/development/browser and /dist/development/server for development environment (wslabs)
* `npm run build:staging` compiles /dist/staging/browser and /dist/staging/server for stage environment
* `npm run build:production` compiles /dist/production/browser and /dist/production/server for production environment (www)
* `npm run build:docs` compiles /docs for github website
* `npm run debug:server` run a test on /dist/development/server/main.js (wslabs)
* `ng serve --prod --open` run the app in production mode with aot and minification
-----------------

## Demo
[http://eurospin-viaggi2.wslabs.it/](http://eurospin-viaggi2.wslabs.it/)
<!-- [https://actarian.github.io/angular-spin/](https://actarian.github.io/angular-spin/) -->

-----------------

## Editor

L'editor consigliato è [vscode](https://code.visualstudio.com/).

### Estensioni consigliate

* [tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) typescript linting
* [beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify) html, css, sass, less and javascript beautifier
* [editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) text editor style configuration

-----------------

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
