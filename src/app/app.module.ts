// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RootComponent } from './root.component';
import { PageHomeComponent } from './page-home.component';
import { PageTestComponent } from './page-test.component';
import { SafePipe } from './safe.pipe';

const routes: Routes = [
  { path: '', component: PageHomeComponent },
  { path: 'test', component: PageTestComponent }
];

@NgModule({
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes),
    FormsModule
  ],
  declarations: [
    RootComponent, 
    PageHomeComponent, 
    PageTestComponent,
    SafePipe
  ],
  bootstrap: [
    RootComponent
  ],
})
export class AppModule { 
}