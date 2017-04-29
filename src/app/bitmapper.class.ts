/**
 * Bitmapper Class
 * For modifying bitmap, like resizing
 */

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';

export class BitmapperClass {

    private observerable: Observable<string>;

    private originalImage: string;
    private processedImage: string;

    constructor() {
        this.observerable = Observable.create((observer: Subject<any>) => {
            // console.log('constructor');
            observer.next();
            observer.complete();
        });
    }

    public setImage(imageURI: string): this {
        this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {
            this.originalImage = imageURI;

            // For initial point processedImage is the same as the original;
            this.processedImage = this.originalImage;

            // console.log('setImage');
            observer.next();
            observer.complete();
        }));
        return this;
    }

    // Resize and stretch image
    // public resizeImage(width: number, height: number): this {
    //     this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {

    //         var img = new Image();
    //         img.src = this.processedImage;

    //         img.onload =  () => {
    //             // We create a canvas and get its context.
    //             var canvas = document.createElement('canvas');
    //             var ctx = canvas.getContext('2d');

    //             canvas.width = width;
    //             canvas.height = height;

    //             // We resize the image with the canvas method drawImage();
    //             ctx.drawImage(<any>img, 0, 0, width, height);

    //             this.processedImage = canvas.toDataURL();

    //             // console.log('resizeImage');
    //             observer.next();
    //             observer.complete();
    //         }
    //     }));
    //     return this;
    // }

    // resize by limiting the px and keeping image ratio
    public resizeLimitPx(targetPixels: number): this {
        this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {

            var img = new Image();
            img.src = this.processedImage;

            img.onload = () => {
                // Original pxls
                let totalPxOriginal = img.width * img.height;

                if (totalPxOriginal < targetPixels) {
                    console.log(`Not Compressed`);
                    observer.next();
                    observer.complete();
                } else {

                    // Area ratio
                    let pxRatio = targetPixels / totalPxOriginal;

                    // Side ratio, square root of area ratio
                    let sideRatio = Math.sqrt(pxRatio);

                    // We create a canvas and get its context.
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');

                    let finalWidth = Math.round(img.width * sideRatio);
                    let finalHeight = Math.round(img.height * sideRatio);

                    canvas.width = finalWidth;
                    canvas.height = finalHeight;

                    // We resize the image with the canvas method drawImage();
                    ctx.drawImage(<any>img, 0, 0, finalWidth, finalHeight);

                    this.processedImage = canvas.toDataURL();

                    console.log(`Compressed from ${totalPxOriginal} pixels to ${finalWidth * finalHeight} pixels.`);
                    observer.next();
                    observer.complete();
                }
            }
        }));
        return this;
    }

    // Find the shorther side of image, and resize it to target number by keeping the ratio
    // public resizeCoverImage(targetWidth: number, targetHeight: number): this {
    //     this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {

    //         var img = new Image();
    //         img.src = this.processedImage;

    //         img.onload =  () => {
    //             var canvas = document.createElement('canvas');
    //             var ctx = canvas.getContext('2d');

    //             let originalRatio = img.width / img.height;
    //             let targetRatio = targetWidth / targetHeight;

    //             let finalHeight: number;
    //             let finalWidth: number;

    //             // If one of the side is smaller than the target respectively, we'll return as it is
    //             if ((img.height < targetHeight) || (img.width < targetWidth)) {
    //                 observer.next();
    //                 observer.complete();
    //             }

    //             // If the original image is more landscape-shaped than the target ratio
    //             if (originalRatio > targetRatio) {
    //                 finalHeight = targetHeight;
    //                 finalWidth = finalHeight * originalRatio;
    //             } 
    //             // If the original image is less landscape-shaped than the target ratio
    //             else {
    //                 finalWidth = targetWidth;
    //                 finalHeight = finalWidth / originalRatio;
    //             }

    //             finalWidth = Math.round(finalWidth);
    //             finalHeight = Math.round(finalHeight);

    //             canvas.width = finalWidth;
    //             canvas.height = finalHeight;

    //             ctx.drawImage(<any>img, 0, 0, finalWidth, finalHeight);

    //             this.processedImage = canvas.toDataURL();

    //             // console.log(`did resizeCoverImage image to ${finalWidth}x${finalHeight}` );
    //             observer.next();
    //             observer.complete();
    //         }
    //     }));
    //     return this;
    // }

    public then(then: (processedImage: string) => any) {
        return this.observerable.subscribe(() => {
            then(this.processedImage);
        });
    }
}