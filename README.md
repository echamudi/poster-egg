# Poster Egg

A client-side poster maker using HTML5, CSS3, and Angular.

[![Poster Egg Screenshot](https://raw.githubusercontent.com/echamudi/echamudi/master/project-screenshots/poster-egg.png)](https://posteregg.com)

## About This Project

### Browser Compatibility

This app is targeted to run on Chrome (>= 36), Firefox (>= 45), and Opera (Blink).

### Built with

* [Angular](https://angular.io)
* [Sass](https://sass-lang.com)
* [Pug](https://pugjs.org)
* [Gulp](https://gulpjs.com)

## Releases

Please check tags for stable versions. The master branch contains latest development changes that are mostly unstable.

## Usage

Open http://posteregg.com.

## Development

### Getting Started

This repo only contains the web front-end part of Poster Egg project. It requires data from [poster-egg-data](https://github.com/echamudi/poster-egg-data) repo, which contains design assets and templates. So, you need to clone both this repo and [poster-egg-data](https://github.com/echamudi/poster-egg-data) repo.

```
$ mkdir poster-egg-project
$ cd poster-egg-project
$ git clone https://github.com/echamudi/poster-egg.git
$ git clone https://github.com/echamudi/poster-egg-data.git
```

If it's done correctly, the folder structure will look like this :

```
poster-egg-project
├── poster-egg            # Front end
└── poster-egg-data       # Data
```

Duplicate `config-sample.ts` inside `poster-egg-project/poster-egg/src` folder, configure it for your envirnoment, and rename it as `config.ts` (overwriting the existing `config.ts`).

Now, you need to build and run HTML server for both of them. This project includes gulp-connect as HTML server. 

The normal setup will run front-end server using port `60571` and data server using port `60572`. You can change these settings at vars section inside `gulpfile.js`. If you modify the data server port, you'll also need to modify `designDataApi` URL in `config.ts` file at the front-end part (`poster-egg/src/config.ts`).

Let's build and run the built in server.

```sh
cd ./poster-egg 
npm install
npx gulp build
cd ../poster-egg-data
npm install
npx gulp build
```

Then, open 2 different terminal tabs to create server. 

```sh
# Terminal 1
cd poster-egg-project/poster-egg
npx gulp connect
```
```sh
# Terminal 2
cd poster-egg-project/poster-egg-data
npx gulp connect
```

Open the site [http://localhost:60571/](http://localhost:60571/).

## Contributing

This project is following [GitHub flow branching model](https://guides.github.com/introduction/flow/). 
- Please create a branch from `master`.
- Name it something descriptive other than `master`.
- Open a pull request to `master`.

Make sure your contributions are compatible with the license of this code.

## Authors

* **Ezzat Chamudi** - [echamudi](https://github.com/echamudi)

See also the list of [contributors](https://github.com/echamudi/poster-egg/graphs/contributors) who participated in this project.

## License

Copyright © 2017 [Ezzat Chamudi](https://github.com/echamudi) and [Poster Egg Project Authors](https://github.com/echamudi/poster-egg/graphs/contributors)

Poster Egg code is licensed under [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). Images, logos, docs, and articles in this project are released under [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.
