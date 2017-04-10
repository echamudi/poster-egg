import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';

import { StorageService } from './storage.service';

import { ModalComponent } from './modal.component';
import { PageEditorComponent } from './page-editor.component';
import { PageDoneComponent } from './page-done.component';
import { PageHomeComponent } from './page-home.component';
import { RootComponent } from './root.component';

import { SafePipe } from './safe.pipe';
import { TitleizePipe } from "./titleize.pipe";

import * as translate from './translate.functions';

@NgModule({
    imports: [
        BrowserModule, 
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (translate.createTranslateLoader),
                deps: [Http]
            }
        }),
        AppRoutingModule,
        FormsModule
    ],
    declarations: [
        RootComponent, 
        PageHomeComponent, 
        PageEditorComponent,
        PageDoneComponent,
        ModalComponent,
        SafePipe,
        TitleizePipe
    ],
    bootstrap: [
        RootComponent
    ],
    providers: [
        StorageService
    ]

})
export class AppModule { }