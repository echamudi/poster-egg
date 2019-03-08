import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

import * as rasterizeHTML from 'rasterizehtml';

@Injectable()
export class RendererService {
    private rawMaterial: string;
    private width: string;
    private height: string;

    constructor(
        private storageService: StorageService
    ) { }

    public setHeight(height: number): this {
        this.height = height + "px";
        return this
    }

    public setWidth(width: number): this {
        this.width = width + "px";
        return this
    }

    public setRawMaterial(rawMaterial: string): this {
        this.rawMaterial = rawMaterial;
        return this;
    }

    // Render image, return canvas element
    public render(): Promise<HTMLScriptElement> {
        let canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", this.width);
        canvasEl.setAttribute("height", this.height);
        // console.log(this.rawMaterial.length);

        return Promise.resolve(rasterizeHTML.drawHTML(this.rawMaterial, canvasEl)
            .then(() => {
                try {
                    // document.body.appendChild(canvasEl);

                    // var test = document.createElement('div');
                    // test.innerHTML = `
                    // <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="1024" height="1024">
                    //     <foreignObject width="100%" height="100%">
                    //         ${this.rawMaterial}
                    //     </foreignObject>
                    // </svg>
                    // `;

                    // document.body.appendChild(test);

                    // console.log(this.rawMaterial);

                    let dataURL = canvasEl.toDataURL();
                    return dataURL;
                }
                catch (e) {
                    console.log('Failed to render')
                    return 'error image src';
                }
            }));
    }

    // Test render 
    public renderTest(): Promise<any> {

        if (this.storageService.hasData('renderSupport')) {
            // console.log('Render Test: From Storage')
            return Promise.resolve(this.storageService.getData('renderSupport'));
        }

        let canvasEl = document.createElement('canvas');
        canvasEl.setAttribute("width", '10px');
        canvasEl.setAttribute("height", '10px');

        return Promise.resolve(rasterizeHTML.drawHTML(this.rawMaterial, canvasEl)
            .then(() => {
                try {
                    // console.log('Render Test: Success')
                    canvasEl.toDataURL();
                    this.storageService.setData('renderSupport', true);
                    return true;
                }
                catch (e) {
                    // console.log('Render Test: Failed to render')
                    this.storageService.setData('renderSupport', false);
                    return false;
                }
            }));
    }
}
