import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class Guard implements CanDeactivate<any> {
    canDeactivate(target: any) {
        if (target.guard) {
            target.modal.show();
            return false;
        }
        return true;
    }
}