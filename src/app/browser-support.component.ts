import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { RendererService } from './renderer.service';
import { StorageService } from './storage.service';

@Component({
    moduleId: module.id,
    selector: 'browser-support',
    templateUrl: './app/browser-support.component.html',
    providers: [
        RendererService,
    ]

})
export class BrowserSupportComponent {

    // Assume current browser is supported (true)
    private browserSupport: boolean = true;

    constructor(
        private rendererService: RendererService,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        if (this.storageService.hasData('renderSupport')) {
            this.browserSupport = this.storageService.getData('renderSupport');
        } else {
            // Check if user's browser can render HTML, mainly for detecting Safari
            this.rendererService.renderTest().then((value) => { this.browserSupport = value; });
        }
    }
}
