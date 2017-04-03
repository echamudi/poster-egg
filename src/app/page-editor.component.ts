import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostmanService } from './postman.service';
import { StorageService } from './storage.service';

import { ModalComponent } from './modal.component';

import { ArtboardClass } from './artboard.class';
import { RendererClass } from './renderer.class';

import { DesignProperty, DesignProperties } from './interfaces';

import * as tool from './tools';

import WebFont = require('webfontloader');

@Component({
    moduleId: module.id,
    selector: 'page-editor',
    templateUrl: './app/page-editor.component.html',
    styleUrls: ['./app/page-editor.component.css'],
    providers: [ PostmanService ],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class PageEditorComponent {
    
    private designProperties: DesignProperties;
    private designPropertiesArray: DesignProperty[] = [];

    private designStyle: string;
    private designTemplate: string;
    private designFonts: any;
    private designSize: any;

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    // For unsubscribing later at ngOnDestroy()
    private alive: boolean = true;

    // For preventing changing router
    public hasChanges: boolean = false;

    // For loading spinner
    public loadingThings: any = {};
    public somethingIsLoading: boolean = false;

    // Modal for changing router confirmation
    @ViewChild(ModalComponent)
    public modal: ModalComponent;

    constructor(
        private storageService: StorageService,
        private postmanService: PostmanService, 
        private route: ActivatedRoute,
        private router: Router ) { }

    ngOnInit() {
        this.artboard = new ArtboardClass();

        this.setLoading('webfont');

        // getting params from url
        this.route.params
            // doing get again (get design data using params)
            .switchMap((params: Params) => this.postmanService.getDesign(params['groupID'], params['designID']))
            .takeWhile(() => this.alive)
            .subscribe(data => {

                // extract data from the promise
                this.designTemplate = data[0];
                this.designStyle = data[1];
                this.designProperties = data[2].designProperties;
                this.designFonts = data[2].fonts;
                this.designSize = data[2].size;

                // Load fonts
                var webFontConfig: any = {
                    classes: false,
                    active: () => { 
                        this.unsetLoading('webfont');
                    },
                };

                if(this.designFonts.google) {
                    webFontConfig.google = {
                        families: this.designFonts.google
                    }
                }

                WebFont.load(webFontConfig);

                // Make designPropertioes an array, so it can be looped for design controllers on sidebar
                this.designPropertiesArray = tool.objToArray(this.designProperties);

                // Make artboards
                this.artboard
                    .setWidth(this.designSize.w)
                    .setHeight(this.designSize.h)
                    .setStyle(this.designStyle)
                    .setTemplate(this.designTemplate)
                    .capsulize()
                    .drawAll(this.designProperties)

                this.scaleArtboard();
            });
    }

    // Add key to loadingthings, a list that shows something (a key) is still loading;
    setLoading(key: string):void {
        this.loadingThings[key] = true;
        this.somethingIsLoading = true;
    }

    unsetLoading(key: string):void {
        delete this.loadingThings[key];

        // If there's no more thing in this.loadingThings, make it false
        this.somethingIsLoading = !!Object.keys(this.loadingThings).length;
    }

    // For textarea and range
    onInputChange(arg: any) {
        // Prevent exiting this page, turn on guard
        this.hasChanges = true;

        // Get designPropertyBinder from the text input and its value for designProperties
        let key = arg.target.getAttribute('designPropertyBinder');
        let value = arg.target.value;

        var renderableDesignProperties = this.designProperties;
        if(arg.target.tagName == "TEXTAREA") {
            // resize text area based on its height 
            arg.target.style.height = "auto";
            arg.target.style.height = arg.target.scrollHeight + 20;
    
            // Change new line in input to <br>
            renderableDesignProperties[key].value = value.replace(/\r\n|\r|\n/g,"<br />");

        } else {
            renderableDesignProperties[key].value = value.toString();
        }

        this.artboard.drawAll(renderableDesignProperties);
    }

    // For file input
    onFileChange(arg: any) {
        // Prevent exiting this page, turn on guard
        this.hasChanges = true;

        // Get designPropertyBinder from the file input and its value for designProperties
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

        let renderer = new RendererClass();

        renderer
            .setWidth(this.artboard.getWidth())
            .setHeight(this.artboard.getHeight())
            .setRawMaterial(this.artboard.getOutput())
            .render()
            .then((canvas: any) => {
                dataURL = canvas.toDataURL();
                aElement.href = dataURL;
                aElement.setAttribute('download', `postyposter.com_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.png`);
                aElement.style.display = 'none';

                document.body.appendChild(aElement);

                aElement.click();
                aElement.parentNode.removeChild(aElement);

                this.hasChanges = false;
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

    onWindowResize() {
        this.scaleArtboard();
    }

    ngOnDestroy() {
        //Unsubscribe things
        this.alive = false;
    }
}
