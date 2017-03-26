/**
 * Painter is one stop service for processing design properties, artboard template, and rendering template 📸 🖨 🎆
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { DesignProperty, DesignProperties } from './interfaces';
import { ArtboardClass } from './artboard.class';

import * as tool from './tools';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PainterService {

    constructor(private http: Http) { }

    /**
     * Convert designProperties to designPropertiesArray
     */
    designPropertiesObjectToArray(designProperties: DesignProperties): DesignProperty[] {
        let returney: DesignProperty[] = [];

        Object
            .keys(designProperties)
            .map((objectKey, Index) => {
                returney[Index] = designProperties[objectKey];

                // Add binder attribute (aka designPropertiesKey) to the objects inside array.
                returney[Index].binder = objectKey;
            });

        return returney;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getAllDesignList(): Promise<any[]> {
        return this.http.get('/data/all-designs.json')
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getDesign(): Observable<any> {
        // a set of customer IDs was given to retrieve
        var files: string[] = ['compliano.template.html', 'compliano.template.css'];

        // map them into a array of observables and forkJoin
        // return Observable.forkJoin(
        //     files.map(
        //         i => this.http.get('/data/design-packs/pop-art/' + i).map(res => res.json())
        //     )
        // )
        return Observable.forkJoin(
            this.http.get('/data/design-packs/pop-art/compliano.template.html').map((res: Response) => res.text()),
            this.http.get('/data/design-packs/pop-art/compliano.template.css').map((res: Response) => res.text())
        );
    }
}
