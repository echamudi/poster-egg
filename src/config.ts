/**
 * Config file
 * Check config-sample.ts for default values.
 */

let language: string;
let watermarkLabel: string = "Poster Egg";
let googleAnalytics: string = "X";

window.document.title = "Poster Egg";

let idHostnames: string[] = [
    "www.desainmu.com",
    "desainmu.com",
    "beta.desainmu.com",
    "id-posteregg.netlify.com",
    "id.posteregg.com"
];

if (idHostnames.indexOf(window.location.hostname) > -1) {
    language = "id";
    googleAnalytics = "UA-57805922-5";
} else {
    language = "en";
    googleAnalytics = "UA-57805922-6";
}

export const config = {

    watermarkLabel: watermarkLabel,

    googleAnalytics: googleAnalytics,

    // designDataApi: "http://localhost:60572/data",
    // designDataApi: "https://ezhmd.github.io/poster-egg-data-server/",
    designDataApi: "/data",

    language: language
}