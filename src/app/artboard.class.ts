import { DesignProperties } from './interfaces';
import * as tool from './tools';

export class ArtboardClass {
    private template: string;
    private templateEnclosed: string;

    private style: string;

    private output: string;

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
}