import { DesignProperties } from './interfaces';

import * as tool from './tools';

var rasterizeHTML = require('rasterizeHTML');

declare global {
    interface NodeList {
        forEach?: (handler: Function) => void;
    }
}

export class ArtboardClass {
    private template: string;
    private templateEnclosed: string;

    private style: string;

    private output: string = " ";

    private width: string;
    private height: string;

    public setHeight(height: number): this {
        this.height = height + "px";

        return this
    }

    public getHeight(): number {
        return parseInt(this.height, 10);
    }

    public setWidth(width: number): this {
        this.width = width + "px";

        return this
    }

    public getWidth(): number {
        return parseInt(this.width, 10);
    }

    public setStyle(style: string): this {
        this.style = style;

        return this;
    }

    public setTemplate(template: string): this {
        this.template = template;

        return this;
    }

    // Copy enclosed template to output
    public init(): this {
        this.output = this.templateEnclosed;

        return this;
    }

    // Overwrite dirty output with templateEnclosed (Alias of Init)
    public reset(): this {
        return this.init();
    }

    // Combine artboard style, template, and artboard size
    public capsulize(): this {
        this.templateEnclosed = `
            <style>
                #artboard {
                    width: ${this.width};
                    height: ${this.height};
                    overflow: hidden;
                    background: white;
                }
            </style>
            <style>
                ${this.style}
            </style>
            <div id="artboard" artboard>
                ${this.template}
            </div>
        `;

        this.init();

        return this;
    }

    public drawSingle(key: string, replace: string): this {
        this.output = tool.replaceAll(this.output, "__" + key + "__", replace);

        return this;
    }

    public drawAll(designProperties: DesignProperties): this {
        this.reset();

        Object
            .keys(designProperties)
            .map(key => {
                this.drawSingle(key, designProperties[key].value);
            });

        return this;
    }

    // Render image, return canvas element
    public render(): Promise<HTMLScriptElement> {
        console.log('start rendering');

        var rawMaterial = this.output;
        rawMaterial += window.document.getElementById('mainstyle').outerHTML;

        document.querySelectorAll('head link[rel=stylesheet]').forEach((el: any) => rawMaterial += el.outerHTML);

        var canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", this.width);
        canvasEl.setAttribute("height", this.height);


        return Promise.resolve(rasterizeHTML.drawHTML(rawMaterial, canvasEl)
            .then(() => {
                return canvasEl
            }));
    }

    // Slow Render
    public renderSlowly(): Promise<HTMLScriptElement> {
        return new Promise(resolve => {
            // Simulate server latency with 3 second delay
            setTimeout(() => resolve(this.render()), 3000);
        });
    }

}