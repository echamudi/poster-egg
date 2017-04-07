import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { RendererClass } from './renderer.class';

@Component({
    moduleId: module.id,
    selector: 'page-done',
    templateUrl: './app/page-done.component.html',
    styleUrls: ['./app/page-done.component.css'],
})
export class PageDoneComponent {
    private artboard: any;
    private resultImgSrc: string;
    private fileName: string;

    constructor(
        private storageService: StorageService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {

        this.artboard = this.storageService.getData('artboard');

        if (!this.artboard) {

            this.router.navigate(['']);

        } else {
            let today = new Date();

            this.fileName = `postyposter.com_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.png`;
            this.render();
        }
    }

    render() {
        let aElement = document.createElement('a');
        let dataURL: string;

        let renderer = new RendererClass();

        renderer
            .setWidth(this.artboard.getWidth())
            .setHeight(this.artboard.getHeight())
            .setRawMaterial(this.artboard.getOutput())
            .render()
            .then((canvas: any) => {
                dataURL = canvas.toDataURL();
                this.resultImgSrc = dataURL;

                console.log('renderer: done rendering');
            });
    }

    back() {
        this.location.back();
    }

    discard() {
        this.storageService.deleteData('artboard');
        this.storageService.deleteData('designProperties');
        this.router.navigate(['']);
    }
}
