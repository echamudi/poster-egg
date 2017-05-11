import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { Guard } from './guard.service';

import { PageDoneComponent } from './page-done.component';
import { PageEditorComponent } from './page-editor.component';
import { PageHomeComponent } from './page-home.component';
import { RootComponent } from './root.component';

const routes: Routes = [
    {
        path: '',
        component: PageHomeComponent
    },
    {
        path: 'editor/:packID/:designID',
        component: PageEditorComponent,
        canDeactivate: [Guard]
    },
    {
        path: 'done',
        component: PageDoneComponent,
        canDeactivate: [Guard]
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

@NgModule({
    providers: [Guard],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }