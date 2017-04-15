import { DesignProperties } from './interfaces';

import * as tool from './tools';

import { config } from '../config';

// import rasterizeHTML = require('rasterizehtml');

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

    // Overwrite dirty output with templateEnclosed (Alias of Init)
    private reset(): this {
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

        // It's needed when putting image url in designdata json
        this.drawSingle('designDataUrl', config.designDataApi)

        return this;
    }
}