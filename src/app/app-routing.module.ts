import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnsavedGuard } from './unsaved-guard.service';

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
        canDeactivate: [ UnsavedGuard ] 
    },
    { 
        path: 'done', 
        component: PageDoneComponent, 
        canDeactivate: [ UnsavedGuard ] 
    },
    { 
        path: 'editor', 
        redirectTo: '/', 
        pathMatch: 'full' 
    }
];

@NgModule({
    providers : [ UnsavedGuard ],
    imports : [ RouterModule.forRoot(routes) ],
    exports : [ RouterModule ]
})
export class AppRoutingModule {}