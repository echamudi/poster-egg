import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../config';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app/root.component.html',
    styleUrls: ['./app/root.component.css'],
})
export class RootComponent {
    constructor(translate: TranslateService) {
        translate.setDefaultLang('en');

        // Set language, change it in config.ts file
        translate.use(config.language);
    }
}
