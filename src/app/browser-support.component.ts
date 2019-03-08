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

    // Assume current browser is not supported (false)
    private browserSupport: boolean = false;

    constructor(
        private rendererService: RendererService,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        // if (this.storageService.hasData('renderSupport')) {
        //     this.browserSupport = this.storageService.getData('renderSupport');
        // } else {
        //     // Check if user's browser can render HTML, mainly for detecting Safari
        //     this.rendererService.renderTest().then((value) => { this.browserSupport = value; });
        // }
        
        // Chrome 1 - 71

        var isChrome: boolean;
        var isOpera: boolean;
        var isFirefox: boolean;
        eval(`isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);`);
        
        // Opera 8.0+
        eval(`isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;`);
        
        // Firefox 1.0+
        eval(`isFirefox = typeof InstallTrigger !== 'undefined';`);
        
        
        if (this.storageService.hasData('browserSupport')) {
            this.browserSupport = this.storageService.getData('browserSupport');
        } else {
            this.browserSupport = isChrome || isOpera || isFirefox ? true : false;
        }
    }
}
