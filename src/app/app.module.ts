import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SafePipe } from './safe.pipe';

import { AppRoutingModule } from './app-routing.module';

import { RootComponent } from './root.component';
import { ModalComponent } from './modal.component';

import { PageHomeComponent } from './page-home.component';
import { PageEditorComponent } from './page-editor.component';

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
})
export class AppModule { 
}