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
        let canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", this.width);
        canvasEl.setAttribute("height", this.height);

        return Promise.resolve(rasterizeHTML.drawHTML(this.rawMaterial, canvasEl)
            .then(() => {
                try {
                    let dataURL = canvasEl.toDataURL();
                    return dataURL;
                }
                catch(e) {
                    console.log('Failed to render')
                    return 'error image src';
                }
            }));
    }

    // Test render 
    public renderTest(): Promise<any> {
        let canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", '10px');
        canvasEl.setAttribute("height", '10px');

        return Promise.resolve(rasterizeHTML.drawHTML(this.rawMaterial, canvasEl)
            .then(() => {
                try {
                    canvasEl.toDataURL();
                    return true;
                }
                catch(e) {
                    console.log('Failed to render')
                    return false;
                }
            }));
    }
}
