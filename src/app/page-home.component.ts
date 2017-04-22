import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { PostmanService } from './postman.service';
import { RendererClass } from './renderer.class';

@Component({
    moduleId: module.id,
    selector: 'app-page-home',
    templateUrl: './app/page-home.component.html',
    styleUrls: ['./app/page-home.component.css'],
    providers: [PostmanService]

})
export class PageHomeComponent {

    private packs: any[];

    // Assume current browser is supported (true)
    private browserSupport: boolean = true;
    
    constructor(
        private postmanService: PostmanService, 
        private translate: TranslateService
        ) {}

    ngOnInit() {
        this.postmanService.getAllPacks().then(data => {
            this.packs = data;
        });

        // Check if user's browser can render HTML, mainly for detecting Safari
        RendererClass.prototype.renderTest().then(testResult => {
            if(!testResult) {
                this.browserSupport = false;
            }
        })
    }

    getDesignThumbnail(designID : string) : string {
        return this.postmanService.getDesignThumbnail(designID);
    }
}
