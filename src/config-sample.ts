/**
 * Config file
 * Duplicate this file and rename it to config.ts.
 */

let language: string = "en";
let watermarkLabel: string = "postyposter.com";

if (language == "id") {
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