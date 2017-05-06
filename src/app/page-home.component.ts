import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { PostmanService } from './postman.service';
import { StorageService } from './storage.service';

@Component({
    moduleId: module.id,
    selector: 'app-page-home',
    templateUrl: './app/page-home.component.html',
    styleUrls: ['./app/page-home.component.css'],
    providers: [
        PostmanService,
    ]
})
export class PageHomeComponent {

    private packs: any[];

    constructor(
        private postmanService: PostmanService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.postmanService.getAllPacks().then(data => {
            this.packs = data;
        });
    }

    getDesignThumbnail(packID: string, designID: string): string {
        return this.postmanService.getDesignThumbnail(packID, designID);
    }
}
