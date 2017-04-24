/**
 * Bitmapper Class
 * For modifying bitmap, like resizing
 */

import { Observable, Subject } from 'rxjs/Rx';

export class BitmapperClass {

    private observerable: Observable<string>;

    private originalImage: string;
    private processedImage: string;

    constructor() {
        this.observerable = Observable.create((observer: Subject<any>) => {
            console.log('constructor');
            observer.next();
            observer.complete();
        });
    }

    public setImage(imageURI: string): this {
        this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {
            this.originalImage = imageURI;
            
            // For initial point processedImage is the same as the original;
            this.processedImage = this.originalImage;

            console.log('setImage');
            observer.next();
            observer.complete();
        }));
        return this;
    }

    public resizeImage(width: number, height: number): this {
        this.observerable = this.observerable.concatMap((value: string) => Observable.create((observer: Subject<any>) => {
            
            var img = new Image();
            img.src = this.originalImage;

            img.onload =  () => {
                // We create a canvas and get its context.
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // We set the dimensions at the wanted size.
                canvas.width = width;
                canvas.height = height;

                // We resize the image with the canvas method drawImage();
                ctx.drawImage(<any>img, 0, 0, width, height);

                this.processedImage = canvas.toDataURL();

                console.log('resizeImage');
                observer.next();
                observer.complete();
            }
        }));
        return this;
    }

    public runAndGet(whatNext: (processedImage: string) => any) {
        return this.observerable.subscribe(() => {
            whatNext(this.processedImage);
        });
    }
}