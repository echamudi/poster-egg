import { NgModule }      from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { RootComponent } from './root.component';
import { PageHomeComponent } from './page-home.component';
import { PageEditorComponent } from './page-editor.component';

const routes: Routes = [
  { path: '', component: PageHomeComponent },
  { path: 'editor', component: PageEditorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
