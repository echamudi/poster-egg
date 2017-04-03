import rasterizeHTML = require('rasterizehtml');

export class RendererClass {
    private rawMaterial: string;
    private width: string;
    private height: string;

    public setHeight(height: number): this {
        this.height = height + "px";

        return this
    }

    public setWidth(width: number): this {
        this.width = width + "px";

        return this
    }

    public setRawMaterial (rawMaterial: string): this {
        this.rawMaterial = rawMaterial;
        return this;
    }

    // Render image, return canvas element
    public render(): Promise<HTMLScriptElement> {
        console.log('start rendering');

        // Add styles from head
        let toBeRendered = this.rawMaterial;
        toBeRendered += window.document.getElementById('mainstyle').outerHTML;

        document.querySelectorAll('head link[rel=stylesheet]').forEach((el: any) => toBeRendered += el.outerHTML);

        let canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", this.width);
        canvasEl.setAttribute("height", this.height);


        return Promise.resolve(rasterizeHTML.drawHTML(toBeRendered, canvasEl)
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
