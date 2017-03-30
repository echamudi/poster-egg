/**
 * Save data temporarily to move between pages
 * Put StorageService in app.module to make it singleton between pages
 */

import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private data: any = {};

    constructor() { }

    setData(key: string, data: any): void {
        this.data[key] = data;
    }

    getData(key: string): any {
        if(this.data.hasOwnProperty(key)) {
            return this.data[key];
        } else {
            return "NOT FOUND"
        }
    }

    getAllData(): any {
        return this.data;
    }
}
