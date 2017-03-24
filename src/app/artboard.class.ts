import { DesignProperties } from './interfaces';
import * as tool from './tools';

export class ArtboardClass {
    private template: string;
    private output: string;

    public init(): this {
        this.output = this.template;

        return this;
    }

    public reset(): this {
        return this.init();
    }

    public setTemplate(template: string): this {
        this.template = template;

        return this;
    }

    public drawSingle(key: string, replace: string): this {        
        this.output = tool.replaceAll(this.output, "{{" + key + "}}", replace);

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