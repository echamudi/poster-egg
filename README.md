# Posty Poster

> This app is still under heavy development and not suitable for normal user 😃

A client-side poster maker using HTML5, CSS3, and Angular. The code is written by using [VSCode](https://github.com/Microsoft/vscode).

## Browser Compatibility

This app is targeted to run on Chrome (>= 36), Firefox (>= 45), and Opera (Blink).

Won't work in Safari, IE, and Edge. You can try this [codepen test](http://codepen.io/ezh/pen/RrLZqM) on those browsers. Anyone knows the workaround?

## How to Run

This project requires [posty-poster-data](https://github.com/ezhmd/posty-poster-data) to create data server

```
$ git clone https://github.com/ezhmd/posty-poster-data.git posty-poster/posty-poster-data
$ cd posty-poster/posty-poster-data
$ npm install
$ gulp 
```
This will build and start data server at `60572` port, you can change the setting at gulpfile.js.

Now we need to run the front-end of posty-server (this repo).

```
$ git clone https://github.com/ezhmd/posty-poster.git posty-poster/posty-poster
$ cd posty-poster/posty-poster
$ npm install
$ gulp
$ open http://localhost:60571/
```
The front end will run at `60571` port. If you changed the `posty-poster-data` server port, you'll need to modify designDataApi URL at `src/arr/config.ts`.

Make sure `Bundle Function 📦` is finished before opening the app.

## Todo

Check [project](https://github.com/ezhmd/posty-poster/projects) page.

## Creator

Ezzat Chamudi

[facebook.com/ezzatchamudi](https://facebook.com/ezzatchamudi)

## Licenses

Posty Poster code released under [AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html). 

Images, logos, docs, and articles released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 

Libraries, dependencies, and tools used in this project tied with their own licenses respectively.