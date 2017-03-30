import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { StorageService } from './storage.service';

import { ModalComponent } from './modal.component';
import { PageEditorComponent } from './page-editor.component';
import { PageHomeComponent } from './page-home.component';
import { RootComponent } from './root.component';

import { SafePipe } from './safe.pipe';

@NgModule({
    imports: [
        BrowserModule, 
        AppRoutingModule,
        FormsModule,
        HttpModule,
    ],
    declarations: [
        RootComponent, 
        PageHomeComponent, 
        PageEditorComponent,
        ModalComponent,
        SafePipe
    ],
    bootstrap: [
        RootComponent
    ],
    providers: [StorageService]

})
export class AppModule { }