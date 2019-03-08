import { config } from '../config';

import { DesignProperties } from './interfaces';
import { DesignProperty } from './interfaces';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import { ObservableInput } from 'rxjs/Observable';

import { PostmanService } from './postman.service';
import { StorageService } from './storage.service';

import { ArtboardClass } from './artboard.class';
import { BitmapperClass } from './bitmapper.class';
import { DataDesignProcessorClass } from './data-design-processor.class';

import { ModalComponent } from './modal.component';

import * as tool from './tools';

let createTextVersion = require("textversionjs");

@Component({
    moduleId: module.id,
    selector: 'page-editor',
    templateUrl: './app/page-editor.component.html',
    styleUrls: ['./app/page-editor.component.css'],
    providers: [
        PostmanService
    ],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class PageEditorComponent {

    private designProperties: DesignProperties;

    // Array version of designProperties, cause we need it to be looped in template later
    private designPropertiesArray: DesignProperty[] = [];

    private designStyle: string;
    private designTemplate: string;
    private designFonts: any;
    private designSize: any;

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    private fontStyleOuterHTML: string;

    // For unsubscribing later at ngOnDestroy()
    private alive: boolean = true;

    // Detect whether inputs in sidebar has been touched or not
    private inputTouched: boolean = false;

    // For preventing changing router
    public guard: boolean;

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
        private router: Router,
        private translate: TranslateService
    ) { }

    ngOnInit() {

        this.guard = this.storageService.getData('hasChanges');

        this.artboard = new ArtboardClass();

        this.setLoading('webfont');

        let dataDesignProcessor = new DataDesignProcessorClass();

        // getting params from url
        this.route.params
            .takeWhile(() => this.alive)

            // doing get again (get design data using params)
            .switchMap((params: Params) => this.postmanService.getDesign(params['packID'], params['designID'], true, true))

            // Check the first json, if it needs to extend, we'll request again, if not, done.
            .takeWhile((value) => {

                // If design template json isn't found, go to home
                if(!value[0]) {
                    this.router.navigate(['/']);
                }

                dataDesignProcessor.setDataDesignChild(value);

                if (dataDesignProcessor.getChildWantsExtend()) {
                    return true;
                } else {
                    this.initiateArtboard(dataDesignProcessor.getDataDesignChild());
                    return false;
                }
            })
            .concatMap((): ObservableInput<any[]> => {
                return this.postmanService.getDesign(
                    dataDesignProcessor.getParentID().packID,
                    dataDesignProcessor.getParentID().designID,
                    true,
                    true);
            })
            .subscribe(value => {
                dataDesignProcessor.setDataDesignParent(value);
                this.initiateArtboard(dataDesignProcessor.merge().getDataDesignMerged());
            });
    }

    // Initiate Artboard, use the return of postmanService.getDesign() as parameter
    private initiateArtboard(dataDesign: any) {

        // extract data from the postmanService.getDesign() promise
        this.designFonts = dataDesign[0].fonts;
        this.designSize = dataDesign[0].size;
        this.designTemplate = dataDesign[1];
        this.designStyle = dataDesign[2];

        // Check if the user is reediting (coming back from page-done)
        if (this.storageService.getData('designProperties')) {
            this.designProperties = this.storageService.getData('designProperties');
            this.storageService.deleteData('designProperties');
        } else {
            this.designProperties = dataDesign[0].designProperties;
        }

        // For animation
        window.document.head.insertAdjacentHTML('beforeend', `<style id="fontHider"> 
        #artboard div:not(.bg) {
            opacity: 0 !important;
        }`);


        this.postmanService.getGoogleFonts(this.designFonts)
            .takeWhile(() => this.alive)
            .subscribe(res => {
                this.fontStyleOuterHTML = `<style id="additionalFonts">${res}</style>`;
                window.document.head.insertAdjacentHTML('beforeend', this.fontStyleOuterHTML);

                // remove font hider aka start animation
                let fontHiderElement = window.document.getElementById('fontHider');
                fontHiderElement.parentNode.removeChild(fontHiderElement);

                this.unsetLoading('webfont');
            });
        
        // Look for __designDataUrl__ in design properties value, and change it with real API url
        Object
            .keys(this.designProperties)
            .map(key => {
                if (typeof this.designProperties[key].value == "string" && this.designProperties[key].value.match(/__designDataUrl__/g)) {
                    this.designProperties[key].value = this.designProperties[key].value.replace(/__designDataUrl__/g, config.designDataApi);
                }
            });

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

        // Replace URL in css and html
        this.artboard.drawSingle('designDataUrl', config.designDataApi);

        this.scaleArtboard();
    }

    // Add key to loadingthings, a list that shows something (a key) is still loading;
    setLoading(key: string): void {
        this.loadingThings[key] = true;
        this.somethingIsLoading = true;
    }

    unsetLoading(key: string): void {
        delete this.loadingThings[key];

        // If there's no more thing in this.loadingThings, make somethingIsLoading false. It will hide the spinner
        this.somethingIsLoading = !!Object.keys(this.loadingThings).length;
    }

    textareaFitter(arg: HTMLTextAreaElement) {

        // textarea dir rtl if its value is rtl
        if (tool.detectRTL(arg.value)) {
            arg.setAttribute('dir', 'rtl')
        } else {
            arg.setAttribute('dir', 'ltr')
        }

        // resize text area based on its height 
        arg.style.height = "auto";
        arg.style.height = arg.scrollHeight + 20 + 'px';
    }

    textareaProcess(designProperty: DesignProperty): string {

        // Resize textarea initially, before any input in sidebar is touched
        if (!this.inputTouched) {
            let textAreaElement: any = document.querySelector(`textarea[designpropertybinder="${designProperty._objectKey}"]`);

            this.textareaFitter(textAreaElement);
        }

        let textareaValue: string = designProperty.value;

        // Convert <br> to \n
        textareaValue = textareaValue.replace(/<br\s*[\/]?>/gi, "\n");

        return textareaValue;
    }

    // For textarea and range
    onInputChange(arg: any) {

        // Prevent exiting this page, turn on guard
        this.guard = true;

        // Get designPropertyBinder from the text input and its value for designProperties
        let key = arg.target.getAttribute('designPropertyBinder');

        // Put the value to designProperties
        this.designProperties[key].value = arg.target.value;

        // If it's from textarea input
        if (arg.target.tagName == "TEXTAREA") {
            this.artboard.drawSingle(key, this.designProperties[key].value, true);
        } else {
            this.artboard.drawSingle(key, this.designProperties[key].value);
        }

        // Mark input has been modified
        this.inputTouched = true;
    }

    // For file input
    onFileChange(arg: any) {
        this.setLoading('processingFileInput');

        // Prevent exiting this page, turn on guard
        this.guard = true;

        // Get designPropertyBinder from the file input and its value for designProperties
        let key = arg.target.getAttribute('designPropertyBinder');

        // If file is successfuly loaded
        if (arg.target.files && arg.target.files[0]) {
            let reader = new FileReader();

            reader.readAsDataURL(arg.target.files[0]);

            // If reading data successfuly loads picture
            reader.onload = (e: any) => {

                // Resize the image

                let bitmapper = new BitmapperClass();

                bitmapper
                    .setImage(e.target.result)
                    .resizeLimitPx(400000)
                    .then((processedImage) => {
                        this.unsetLoading('processingFileInput');

                        this.designProperties[key].value = processedImage;

                        this.inputTouched = true;
                        this.artboard.drawSingle(key, this.designProperties[key].value);
                    })

            }
        } else {
            console.log('Failed');
        }
    }

    finalize() {

        let toBeRendered = this.artboard.getOutput();

        // Add website stylesheet and additional stylesheet to to be rendered.
        toBeRendered = window.document.getElementById('mainstyle').outerHTML + toBeRendered;
        toBeRendered = this.fontStyleOuterHTML + toBeRendered;

        // Remove 2px border
        toBeRendered = `<style>#artboard { border: none !important; } </style>` + toBeRendered;
        
        this.artboard.setOutput(toBeRendered);

        // Save hasChanges universally, incase the user goes back from the final page
        this.storageService.setData('hasChanges', this.guard)

        // Save has Changes to universal storage
        this.storageService.setData('artboard', this.artboard);

        // Save design properties to universal storage, incase the user is want to go back and edit again from the page-done page.
        this.storageService.setData('designProperties', this.designProperties);

        // Go to renderer page
        this.router.navigate(['done']);

        this.guard = false;
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
        finalRatio = finalRatio * 1;

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
        // Unload google font stylesheets from head
        let additionalFontsElement = window.document.getElementById('additionalFonts');

        // If additional font element already exists, remove it
        if(additionalFontsElement) {
            additionalFontsElement.parentNode.removeChild(additionalFontsElement);
        }

        // remove font hider
        let fontHiderElement = window.document.getElementById('fontHider');
        if(fontHiderElement) {
            fontHiderElement.parentNode.removeChild(fontHiderElement);
        }

        //Unsubscribe things
        this.alive = false;
    }
}
