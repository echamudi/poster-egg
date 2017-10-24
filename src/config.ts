let language: string;
let watermarkLabel: string;
let googleAnalytics: string = "X";

let idHostnames: string[] = [
    "www.desainmu.com",
    "desainmu.com",
    "beta.desainmu.com"
];

if (idHostnames.indexOf(window.location.hostname) > -1) {
    language = "id";
    watermarkLabel = "desainmu.com"
    window.document.title = "Desainmu 3";
    googleAnalytics = "UA-57805922-5";
} else {
    language = "en";
    watermarkLabel = "postyposter.com"
    window.document.title = "Posty Poster";
    googleAnalytics = "UA-57805922-6";
}

export const config = {

    watermarkLabel: watermarkLabel,

    googleAnalytics: googleAnalytics,

    // designDataApi: "http://localhost:60572/data",
    designDataApi: "https://ezhmd.github.io/posty-poster-data-server/",

    language: language
}