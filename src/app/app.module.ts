import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy } from '@angular/common';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';

import { StorageService } from './storage.service';

import { SafePipe } from './safe.pipe';
import { TitleizePipe } from "./titleize.pipe";

import { BrowserSupportComponent } from './browser-support.component';
import { ModalComponent } from './modal.component';
import { PageDoneComponent } from './page-done.component';
import { PageEditorComponent } from './page-editor.component';
import { PageHomeComponent } from './page-home.component';
import { RootComponent } from './root.component';

import * as translate from './translate.functions';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (translate.createTranslateLoader),
            deps: [HttpClient]
        }
        }),
        AppRoutingModule,
        FormsModule
    ],
    declarations: [
        RootComponent,
        PageHomeComponent,
        PageEditorComponent,
        BrowserSupportComponent,
        PageDoneComponent,
        ModalComponent,
        SafePipe,
        TitleizePipe
    ],
    bootstrap: [
        RootComponent
    ],
    providers: [
        StorageService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ]

})
export class AppModule { }