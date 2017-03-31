import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

import { PageEditorComponent } from './page-editor.component';

@Injectable()
export class UnsavedGuard implements CanDeactivate<PageEditorComponent> {
    canDeactivate(target: PageEditorComponent) {
        if (target.hasChanges) {
            target.modal.show();
            return false;
        }
        return true;
    }
}