import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

import { RendererClass } from './renderer.class';

@Component({
    selector: 'page-done',
    templateUrl: '/app/page-done.component.html',
    styleUrls: ['/app/page-done.component.css'],
})
export class PageDoneComponent {
    private artboard: any;
    constructor (
        private storageService: StorageService,
        private router: Router
    ) { }

    ngOnInit() {

        this.artboard = this.storageService.getData('artboard');

        if (!this.artboard) {

            this.router.navigate(['']);

        } else {
            let aElement = document.createElement('a');
            let today = new Date();
            let dataURL: string;

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

                    console.log('renderer: done rendering');
                });
        }
    }

}
