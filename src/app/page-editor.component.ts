import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { PostmanService } from './postman.service';
import { StorageService } from './storage.service';

import { ModalComponent } from './modal.component';

import { ArtboardClass } from './artboard.class';
import { RendererClass } from './renderer.class';

import { DesignProperty, DesignProperties } from './interfaces';

import * as tool from './tools';

import WebFont = require('webfontloader');

let createTextVersion = require("textversionjs");

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
    private designPropertiesRenderable: DesignProperties;

    private designStyle: string;
    private designTemplate: string;
    private designFonts: any;
    private designSize: any;

    private artboard: ArtboardClass;
    private artboardScaleStyle: string;

    // For unsubscribing later at ngOnDestroy()
    private alive: boolean = true;

    // Detect whether inputs in sidebar has been touched or not
    private inputTouched: boolean = false;

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
        private router: Router,
        private translate: TranslateService
 ) { }

    ngOnInit() {
        
        this.hasChanges = this.storageService.getData('hasChanges');

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
                this.designFonts = data[2].fonts;
                this.designSize = data[2].size;

                // Check if the user is reediting
                if(this.storageService.getData('designProperties')) {
                    this.designProperties = this.storageService.getData('designProperties');
                    this.storageService.deleteData('designProperties');
                } else {
                    this.designProperties = data[2].designProperties;
                }
                
                // For initial, designPropertiesRenderable is exactly the same as designProperties
                this.designPropertiesRenderable = this.designProperties;

                // Load fonts
                let webFontConfig: any = {
                    classes: true,
                    active: () => { 
                        this.unsetLoading('webfont');
                    },
                };

                // Add google property if design data json has google font
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

        // If there's no more thing in this.loadingThings, make somethingIsLoading false. It will hide the spinner
        this.somethingIsLoading = !!Object.keys(this.loadingThings).length;
    }

    textareaResize(arg: HTMLTextAreaElement) {

            // resize text area based on its height 
            arg.style.height = "auto";
            arg.style.height = arg.scrollHeight + 20 + 'px';
    }
    
    textareaProcess(designProperty: DesignProperty): string {

        // Resize textarea initially, before any input in sidebar is touched
        if(!this.inputTouched) {
            let textAreaElement: any = document.querySelector(`textarea[designpropertybinder="${designProperty._objectKey}"]`);

            this.textareaResize(textAreaElement);
        }

        let textareaValue: string = designProperty.value;

        // Convert <br> to \n
        textareaValue = textareaValue.replace(/<br\s*[\/]?>/gi, "\n");

        return textareaValue;
    }


    // For textarea and range
    onInputChange(arg: any) {
        // Prevent exiting this page, turn on guard
        this.hasChanges = true;

        // Get designPropertyBinder from the text input and its value for designProperties
        let key = arg.target.getAttribute('designPropertyBinder');
    
        // Put the value to designProperties
        this.designProperties[key].value = arg.target.value;

        // If it's from textarea input
        if(arg.target.tagName == "TEXTAREA") {

            // Escape HTMLs and change new line in input to <br> in output
            let text = createTextVersion(this.designProperties[key].value.replace(/\r\n|\r|\n/g, "[[NEWLINE]]")).replace(/\[\[NEWLINE\]\]/g, "<br>");
            this.designPropertiesRenderable[key].value = text;
        } 
        
        // If it's from range input
        else {
            this.designPropertiesRenderable[key].value = this.designProperties[key].value.toString();
        }

        // Mark input has been modified
        this.inputTouched = true;
        this.artboard.drawAll(this.designPropertiesRenderable);
    }

    // For file input
    onFileChange(arg: any) {
        // Prevent exiting this page, turn on guard
        this.hasChanges = true;

        // Get designPropertyBinder from the file input and its value for designProperties
        let key = arg.target.getAttribute('designPropertyBinder');

        // If file is successfuly loaded
        if (arg.target.files && arg.target.files[0]) {
            let reader = new FileReader();

            reader.readAsDataURL(arg.target.files[0]);

            // If reading data successfuly loads picture
            reader.onload = (e: any) => {
                this.designProperties[key].value = e.target.result;
                this.designPropertiesRenderable[key].value = e.target.result;
                
                // Mark input has been modified
                this.inputTouched = true;
                this.artboard.drawAll(this.designPropertiesRenderable);
            }
        } else {
            console.log('Failed');
        }
    }

    finalize() {

        let toBeRendered = this.artboard.getOutput();

        // Get stylesheets from <head> to be included in artboard output HTML.
        document.querySelectorAll('head link[rel=stylesheet]').forEach((el: any) => toBeRendered = el.outerHTML + toBeRendered);

        // Unload webfontloader's google font stylesheets from head
        window.document.querySelectorAll(`
            head link[href^="http://fonts.googleapis.com"]:not(#mainfont), 
            head link[href^="https://fonts.googleapis.com"]:not(#mainfont)
            `).forEach(
                (el: any) => el.parentNode.removeChild(el)
            );
        
        // Remove 2px border
        toBeRendered = `<style>#artboard { border: none !important; } </style>` + toBeRendered;

        this.artboard.setOutput(toBeRendered);

        // Save hasChanges universally, incase the user goes back from the final page
        this.storageService.setData('hasChanges', this.hasChanges)
        
        // Save has Changes to universal storage
        this.storageService.setData('artboard', this.artboard);

        // Save design properties to universal storage, incase the user is want to go back and edit again from the page-done page.
        this.storageService.setData('designProperties', this.designProperties);

        // Go to renderer page
        this.router.navigate(['done']);

        this.hasChanges = false;
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
