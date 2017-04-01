import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

import { PostmanService } from './postman.service';

@Component({
    moduleId: module.id,
    selector: 'app-page-home',
    templateUrl: './app/page-home.component.html',
    styleUrls: ['./app/page-home.component.css'],
    providers: [PostmanService]

})
export class PageHomeComponent {

    private designList: any[];
    
    constructor(private postmanService: PostmanService) {}

    ngOnInit() {
        this.postmanService.getAllDesignList().then(data => {
            this.designList = data;
        });
    }
}
