import { config } from '../config';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app/root.component.html',
    styleUrls: ['./app/root.component.css'],
})
export class RootComponent {

    constructor(public translate: TranslateService, private router: Router) {
        translate.setDefaultLang('en');

        // Set language, change it in config.ts file
        translate.use(config.language);

        window.ga('create', config.googleAnalytics, 'auto');

        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event:NavigationEnd) => {
                window.ga('set', 'page', window.location.href.replace(window.location.origin, ""));
                window.ga('send', 'pageview');
            });
    }
}