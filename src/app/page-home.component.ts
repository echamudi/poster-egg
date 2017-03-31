import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

import { PainterService } from './painter.service';

@Component({
    moduleId: module.id,
    selector: 'app-page-home',
    templateUrl: './app/page-home.component.html',
    styleUrls: ['./app/page-home.component.css'],
    providers: [PainterService]

})
export class PageHomeComponent {

    private designList: any[];
    
    constructor(private painterService: PainterService) {}

    ngOnInit() {
        this.painterService.getAllDesignList().then(data => {
            this.designList = data;
        });
    }
}
