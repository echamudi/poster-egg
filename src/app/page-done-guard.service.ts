import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

import { PageDoneComponent } from './page-done.component';

@Injectable()
export class PageDoneGuard implements CanDeactivate<PageDoneComponent> {
    canDeactivate(target: PageDoneComponent) {
        if (target.guard) {
            target.modal.show();
            return false;
        }
        return true;
    }
}