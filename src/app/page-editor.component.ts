import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { PainterService } from './painter.service';
import { DesignProperty, DesignProperties } from './interfaces';
import { ArtboardClass } from './artboard.class';

@Component({
    selector: 'page-editor',
    templateUrl: '/app/page-editor.component.html',
    styleUrls: ['app/page-editor.component.css'],
    providers: [PainterService],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class PageEditorComponent {
    private designProperties: DesignProperties = {
        text1 : {
            label: "Text 1 Sample",
            input: 'text',
            value : 'Indonesia'
        } ,
        text2: {
            label: "Text 2 Sample",
            input: 'text',
            value : 'Australia'
        } ,
        size1: {
            label: "Text Size",
            input: 'range',
            value : '90',
            min: 50,
            max: 95
        },
        background: {
            label: "Image BG",
            input: 'image',
            value : '',
        }
    };

    private designPropertiesArray: DesignProperty[] = [];

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    private resultSrc: string;

    constructor ( private painterService: PainterService ) {
        this.designPropertiesArray = this.painterService.designPropertiesObjectToArray(this.designProperties);

        this.artboard = new ArtboardClass();

        this.artboard
            .setWidth(1024)
            .setHeight(1024)
            .setStyle(
                `
                    #artboard div {
                        font-size: __size1__px
                    }

                `
            )
            .setTemplate(
                `
                    <div>__text1__</div>
                    <div>__text2__</div>
                    <img src="__background__">
                `
            )
            .capsulize()
            .drawAll(this.designProperties);
    }

    ngAfterViewInit(){
        // Trigger window resize to correct artboard size
        this.scaleArtboard();
    }

    // For range, textarea, and text input
    onInputChange(arg: any) {
        // Get designPropertyBinder from the text input for designProperties and its value
        let key = arg.target.getAttribute('designPropertyBinder');
        let value = arg.target.value;

        this.designProperties[key].value = value.toString();
        
        this.artboard.drawAll(this.designProperties);
    }

    // For file input
    onFileChange(arg: any) {
        let key = arg.target.getAttribute('designPropertyBinder');

        if (arg.target.files && arg.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(arg.target.files[0]);

            // If reading data successfuly loads picture
            reader.onload =  (e: any) => {
                this.designProperties[key].value = e.target.result;
                
                this.artboard.drawAll(this.designProperties);
            }
        } else {
            console.log('Failed');
        }
    }

    render() {
        var aElement = document.createElement('a');
        var today = new Date();
        var dataURL: string;

        this.artboard.render().then((canvas: any) => {
            dataURL = canvas.toDataURL();
            aElement.href = dataURL;
            aElement.setAttribute('download', `postyposter.com_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.png`);
            aElement.style.display = 'none';

            document.body.appendChild(aElement);

            aElement.click();
            aElement.parentNode.removeChild(aElement);
        });
    }

    scaleArtboard() {
        let containerEl = window.document.getElementById('artboardContainer');

        let containerElHeight: number = containerEl.clientHeight;
        let containerElWidth: number = containerEl.clientWidth;

        let artboardHeight: number = this.artboard.getHeight();
        let artboardWidth: number = this.artboard.getWidth();

        let padding: number = 20; // Set padding between artboard border and artboardContainer border
        let hRatio: number =  (containerElHeight - padding * 2) / artboardHeight;
        let wRatio: number =  (containerElWidth - padding * 2) / artboardWidth;

        // Choose smaller ratio
        let finalRatio: number = hRatio > wRatio ? wRatio : hRatio;
        
        // Make it a bit smaller
        finalRatio = finalRatio;

        // Move artboard to center
        let translateY: number = (containerElHeight / 2) - (artboardHeight * finalRatio / 2);
        let translateX: number = (containerElWidth / 2) - (artboardWidth * finalRatio / 2);

        this.artboardScaleStyle = `
        <style>
            #artboard {
                transform: translateY(${translateY}px) translateX(${translateX}px) scale(${finalRatio});
            }
        </style>
        `
    }

    onWindowResize() {
        this.scaleArtboard();
    }
}