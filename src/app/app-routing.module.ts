import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { PageEditorGuard } from './page-editor-guard.service';

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
        canDeactivate: [PageEditorGuard]
    },
    {
        path: 'done',
        component: PageDoneComponent
    },
    {
        path: 'editor',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

@NgModule({
    providers: [PageEditorGuard],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }