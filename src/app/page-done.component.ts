import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from './storage.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { ModalComponent } from './modal.component';

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

    private hasBeenDownloaded: boolean;

    @ViewChild(ModalComponent)
    private modal: ModalComponent;

    constructor(
        private storageService: StorageService,
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
        this.storageService.setData('backFromDone', true);

        this.location.back();
    }

    exit() {
        if(!this.hasBeenDownloaded) {
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
