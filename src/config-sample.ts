/**
 * Config file
 * Duplicate this file and rename it to config.ts.
 */

let language: string = "en";
let watermarkLabel: string = "postyposter.com";

let idHostnames: string[] = [
    "desainmu.com", 
    "beta.desainmu.com"
];

if (idHostnames.indexOf(window.location.hostname) > -1) {
        language = "id";
        watermarkLabel = "desainmu.com"
    }

export const config = {

    // Watermark to be used in the poster
    watermarkLabel: watermarkLabel,

    // Url of design data, including design-packs and design-assets
    designDataApi: "http://localhost:60572/data",

    // Set language, en or id
    language: language
}