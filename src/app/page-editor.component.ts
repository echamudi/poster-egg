import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { PainterService } from './painter.service';
import { DesignProperty, DesignProperties } from './interfaces';
import { ArtboardClass } from './artboard.class';

import { ModalComponent } from './modal.component';

import * as tool from './tools';

@Component({
    moduleId: module.id,
    selector: 'page-editor',
    templateUrl: './app/page-editor.component.html',
    styleUrls: ['./app/page-editor.component.css'],
    providers: [PainterService],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class PageEditorComponent {
    private designProperties: DesignProperties;
    private designPropertiesArray: DesignProperty[] = [];

    private styleString: string;
    private templateString: string;

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    private resultSrc: string;

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(
        private painterService: PainterService, 
        private route: ActivatedRoute ) {}

    ngOnInit() {
        this.artboard = new ArtboardClass();

        // getting params from url
        this.route.params
            // doing get again (get design data using params)
            .switchMap((params: Params) => this.painterService.getDesign(params['groupID'], params['designID']))
            .subscribe(data => {
                // extract data from the promise
                this.templateString = data[0];
                this.styleString = data[1];
                this.designProperties = data[2].designProperties;

                this.designPropertiesArray = tool.objToArray(this.designProperties);

                this.artboard
                    .setWidth(1024)
                    .setHeight(1024)
                    .setStyle(this.styleString)
                    .setTemplate(this.templateString)
                    .capsulize()
                    .drawAll(this.designProperties)
                    
                this.scaleArtboard();
            });
    }

    // For textarea and range
    onInputChange(arg: any) {
        // Get designPropertyBinder from the text input for designProperties and its value
        let key = arg.target.getAttribute('designPropertyBinder');
        let value = arg.target.value;

        if(arg.target.tagName == "TEXTAREA") {
            // resize text area based on its height 
            arg.target.style.height = "auto";
            arg.target.style.height = arg.target.scrollHeight + 20;
    
            // Change new line in input to <br>
            this.designProperties[key].value = value.replace(/\r\n|\r|\n/g,"<br />");

        } else {
            this.designProperties[key].value = value.toString();
        }

        this.artboard.drawAll(this.designProperties);
    }

    // For file input
    onFileChange(arg: any) {
        let key = arg.target.getAttribute('designPropertyBinder');

        if (arg.target.files && arg.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(arg.target.files[0]);

            // If reading data successfuly loads picture
            reader.onload = (e: any) => {
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
        let hRatio: number = (containerElHeight - padding * 2) / artboardHeight;
        let wRatio: number = (containerElWidth - padding * 2) / artboardWidth;

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

    routerCanDeactivate(){
        console.log('bye')
        // return false; // false stops navigation, true continue navigation
    }

    onWindowResize() {
        this.scaleArtboard();
    }
}
