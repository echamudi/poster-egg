import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

import { PageEditorComponent } from './page-editor.component';

@Injectable()
export class UnsavedGuard implements CanDeactivate<PageEditorComponent> {
    canDeactivate(target: PageEditorComponent) {
        console.log('guard check');
        if (target.hasChanges) {
            console.log('guard check: NOT allowed');
            target.modal.show();
            return false;
        }
        return true;
    }
}