# Poster Egg

A client-side poster maker using HTML5, CSS3, and Angular. This project was formerly named "Posty Poster".

## Browser Compatibility

This app is targeted to run on Chrome (>= 36), Firefox (>= 45), and Opera (Blink).

## Releases

Please check tags for stable versions. The master branch contains latest development changes that are mostly unstable.

## Getting Started

This repo only contains the web front-end part of Poster Egg project. It requires data from [poster-egg-data](https://github.com/ezhmd/poster-egg-data) repo, which contains design assets and templates. So, you need to clone both this repo and [poster-egg-data](https://github.com/ezhmd/poster-egg-data) repo.

```
$ mkdir poster-egg-project
$ cd poster-egg-project
$ git clone https://github.com/ezhmd/poster-egg.git
$ git clone https://github.com/ezhmd/poster-egg-data.git
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

```
$ cd ./poster-egg 
$ npm install
$ gulp build
$ cd ../poster-egg-data
$ npm install
$ gulp build
```

Then, open 2 different terminal tabs to create server. 

```
$ # Terminal 1
$ cd poster-egg-project/poster-egg
$ gulp connect
```
```
$ # Terminal 2
$ cd poster-egg-project/poster-egg-data
$ gulp connect
```

Open the site [http://localhost:60571/](http://localhost:60571/).

## Built With

* [Angular](https://angular.io)
* [Sass](https://sass-lang.com)

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

See also the list of [contributors](https://github.com/ezhmd/poster-egg/contributors) who participated in this project.

## Licenses

Poster Egg code released under [AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html). 

Images, logos, docs, and articles released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 

Libraries, dependencies, and tools used in this project tied with their own licenses respectively.
