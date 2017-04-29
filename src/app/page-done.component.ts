import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';

import { RendererService } from './renderer.service';
import { StorageService } from './storage.service';

import { ModalComponent } from './modal.component';

@Component({
    moduleId: module.id,
    selector: 'page-done',
    templateUrl: './app/page-done.component.html',
    styleUrls: ['./app/page-done.component.css'],
    providers: [
        RendererService
    ]
})
export class PageDoneComponent {
    private artboard: any;
    private resultImgSrc: string;
    private fileName: string;

    private hasBeenDownloaded: boolean;

    @ViewChild(ModalComponent)
    private modal: ModalComponent;

    constructor(
        private storageService: StorageService,
        private rendererService: RendererService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {

        this.artboard = this.storageService.getData('artboard');

        if (!this.artboard) {

            // redirect to home if there's no artboard data
            console.log('yer');

            this.router.navigate(['/']);

        } else {
            let today = new Date();

            this.fileName = `postyposter.com_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.png`;
            this.render();
        }
    }

    render() {
        let aElement = document.createElement('a');
        let dataURL: string;

        this.rendererService
            .setWidth(this.artboard.getWidth())
            .setHeight(this.artboard.getHeight())
            .setRawMaterial(this.artboard.getOutput())
            .render()
            .then((dataURL: any) => {
                this.resultImgSrc = dataURL;
            });
    }

    back() {
        this.storageService.setData('backFromDone', true);

        this.location.back();
    }

    exit() {
        if (!this.hasBeenDownloaded) {
            this.exitAlert();
        } else {
            this.exitForce();
        }
    }

    exitAlert() {
        this.modal.show();
    }

    exitForce() {
        this.storageService.deleteData('artboard');
        this.storageService.deleteData('hasChanges');
        this.storageService.deleteData('designProperties');

        this.router.navigate(['']);
    }

    download() {
        let aElement = document.createElement('a');

        aElement.href = this.resultImgSrc;
        aElement.setAttribute('download', this.fileName);
        aElement.style.display = 'none';

        document.body.appendChild(aElement);

        aElement.click();
        aElement.parentNode.removeChild(aElement);

        this.hasBeenDownloaded = true;
    }

    downloadAndExit() {
        this.download();
        this.exit();
    }
}
