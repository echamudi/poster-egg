import { config } from '../config';
import { DesignProperties } from './interfaces';

import * as tool from './tools';

let createTextVersion = require("textversionjs");

export class ArtboardClass {

    // templateRaw is the exact html template taken from poster-egg-data
    private templateRaw: string;

    // stlyeRaw is the exact css taken from poster-egg-data
    private styleRaw: string;

    // processed style+template
    private templateEnclosed: string;

    private output: string = " ";

    private width: number;
    private height: number;

    readonly regex1: RegExp = /__(.*?)__/g;
    readonly regex2: RegExp = /\[\[%#-->\[(.*?)]{([^]*?)}<--#%]]/g;

    public setHeight(height: number): this {
        this.height = height;
        return this
    }

    public getHeight(): number {
        return this.height;
    }

    public setWidth(width: number): this {
        this.width = width;
        return this
    }

    public getWidth(): number {
        return this.width;
    }

    public setStyle(styleRaw: string): this {
        this.styleRaw = styleRaw;
        return this;
    }

    public setTemplate(templateRaw: string): this {
        this.templateRaw = templateRaw;
        return this;
    }

    public getOutput(): string {
        return this.output;
    }

    public setOutput(output: string): this {
        this.output = output;
        return this;
    }

    // Copy enclosed template to output
    private init(): this {
        this.output = this.templateEnclosed;

        return this;
    }

    // Combine artboard style, template, and artboard size
    public capsulize(): this {
        this.templateEnclosed = `
            <style>
                #artboard {
                    position: relative;
                    width: ${this.width}px;
                    height: ${this.height}px;
                    overflow: hidden;
                    background: #5f5f5f;
                    user-select: none !important; 
                }

                #artboard:before {
                    content: "${config.watermarkLabel}";

                    position: fixed;
                    right: 0;
                    bottom: 0;
                    z-index: 100;
                    opacity: 0.5;

                    padding: 10px;
                    border-top-left-radius: 4px;

                    color: white;
                    font-size: 20px;
                    font-family: 'Source Sans Pro', sans-serif;

                    background: rgba(0, 0, 0, 0.5);
                    
                    user-select: none !important; 
                }
            </style>
            <style>
                ${this.styleRaw}
            </style>
            <div id="artboard" artboard>
                ${this.templateRaw}
            </div>
        `;

        this.templateEnclosed = this.templateEnclosed.replace(this.regex1, "[[%#-->[$1]{}<--#%]]");
        this.output = this.templateEnclosed.replace(this.regex2, "$2");

        return this;
    }

    private printOutput(): this {
        return this;
    }

    public drawSingle(key: string, replace: string, text?: boolean): this {
        let regex = new RegExp(`\\[\\[%#-->\\[${key}]{([^]*?)}<--#%]]`, "g");

        if (text) {
            // Escape HTMLs and change new line in input to <br> in output
            replace = createTextVersion(replace.replace(/\n|<br>/g, "[[BR]]")).replace(/\[\[BR\]\]/g, "<br>")
            replace = tool.detectRTL(createTextVersion(replace)) ? `<span dir="rtl">${replace}</span>` : replace;
        }

        this.templateEnclosed = this.templateEnclosed.replace(
            regex,
            `[[%#-->[${key}]{${replace}}<--#%]]`
        );


        this.output = this.templateEnclosed.replace(this.regex2, "$2");
        return this;
    }

    public drawAll(designProperties: DesignProperties): this {

        // console.log(this.templateEnclosed);

        Object
            .keys(designProperties)
            .map(key => {

                // If it's a text input and RTL, capsulize the text with span rtl.
                if (designProperties[key].input == "text") {
                    this.drawSingle(key, designProperties[key].value, true);
                } else {
                    this.drawSingle(key, designProperties[key].value);
                }
            });

        // console.log("======================================================================");
        // console.log(this.templateEnclosed);

        return this;
    }
}