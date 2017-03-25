import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { PainterService } from './painter.service';
import { DesignProperty, DesignProperties } from './interfaces';
import { ArtboardClass } from './artboard.class';

@Component({
    selector: 'page-editor',
    templateUrl: '/app/page-editor.component.html',
    styleUrls: ['app/page-editor.component.css'],
    styles: [`
        :host >>> #artboardContainer {
            height: 100%;
            width: 100%;
        }

        :host >>> #artboard {
            border: solid 1px black;
            position: absolute;
            transform-origin: top left;
        }
    `],
    providers: [PainterService],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class PageEditorComponent {
    private designProperties: DesignProperties = {
        text1 : {
            type: 'text',
            label: "Text 1 Sample",
            input: 'text',
            value : 'Indonesia'
        } ,
        text2: {
            type: 'text',
            label: "Text 2 Sample",
            input: 'text',
            value : 'Australia'
        } ,
        size1: {
            type: 'style',
            label: "Text Size",
            input: 'range',
            value : '90',
            min: 50,
            max: 95
        }
    };

    private designPropertiesArray: DesignProperty[] = [];

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    constructor ( private painterService: PainterService ) {
        this.designPropertiesArray = this.painterService.designPropertiesObjectToArray(this.designProperties);

        this.artboard = new ArtboardClass();

        this.artboard
            .setWidth(1024)
            .setHeight(640)
            .setStyle(
                `
                    div[artboardElement] {
                        font-size: __size1__px
                    }

                `
            )
            .setTemplate(
                `
                    <div artboardElement>__text1__</div>
                    <div artboardElement>__text2__</div>
                `
            )
            .capsulize()
            .drawAll(this.designProperties);
    }

    ngAfterViewInit(){
        // Trigger window resize to correct artboard size
        this.scaleArtboard();
    }

    onInputChange(arg: any) {
        // Get designPropertyBinder from the text input for designProperties and its value
        let key = arg.target.getAttribute('designPropertyBinder');
        let value = arg.target.value;

        this.designProperties[key].value = value.toString();
        
        this.artboard.drawAll(this.designProperties);
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