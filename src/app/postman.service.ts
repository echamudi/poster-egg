/**
 * Postman is one stop service for requesting things, including design lists, and design templates. 📸 🖨 🎆
 */

import { config } from '../config';

import { DesignProperties } from './interfaces';
import { DesignProperty } from './interfaces';

import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';

import { ArtboardClass } from './artboard.class';

import * as tool from './tools';

@Injectable()
export class PostmanService {

    constructor(
        private http: Http
    ) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getAllPacks(): Promise<any[]> {
        return this.http.get(`${config.designDataApi}/all-packs.json`)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getDesign(packID: string, designID: string, getHTML: boolean, getCSS: boolean): Observable<any> {
        return Observable.forkJoin(

            // Get the json
            this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.json`)
                .toPromise()
                .then(res => res.json())
                .catch(res => null),

            // Get HTML if it's requested
            getHTML ?
                this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.html`)
                    .toPromise()
                    .then(res => res.text())
                    .catch(() => null)
                :
                Promise.resolve(null),

            // Get CSS if it's requested
            getCSS ?
                this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.css`)
                    .toPromise()
                    .then(res => res.text())
                    .catch(() => null)
                :
                Promise.resolve(null)
        );
    }

    getDesignThumbnail(packID: string, designID: string): string {
        return `${config.designDataApi}/design-assets/thumbnails/${packID}.pack/${designID}.png`;
    }

    getGoogleFonts(fonts: string): Observable<any> {
        let stylesheet: string;
        let woffUrls: string[];

        return this.http.get(`https://fonts.googleapis.com/css?family=${fonts}&amp;subset=arabic`)
            .concatMap(value => { // value is the stylsheet from google font
                stylesheet = value.text();

                let woffs: any[] = value.text().match(/url\((.*?)\)/g);

                woffs = woffs.map(member => member.slice(4, member.length - 1));
                
                woffUrls = woffs;

                woffs = woffs.map(member => {
                    return this.http
                        .get(member, {responseType : 3})
                        .toPromise()
                        .then(res => res.blob());
                });

                return Observable.forkJoin<Response>(woffs);
            })
            .concatMap(value => { // value is array of woff blobs 
                let readers: any[] = value;
                
                let reader = (blob: any) => Observable.create(function(observer: Observer<any>) {
                        var reader = new FileReader();
                        reader.onloadend = () => {
                            observer.next(reader.result);
                            observer.complete()
                        }
                        reader.readAsDataURL(blob);
                });

                readers = readers.map((member) => {
                    return reader(member);
                })

                return Observable.forkJoin<any>(readers);
            })
            .concatMap(value => { // value is array of woff base64 urls 
                return Observable.create(function(observer: Observer<any>) {
                
                    woffUrls.forEach((member, index) => {
                        stylesheet = stylesheet.replace(member, '"' + value[index] + '"');
                    })

                    observer.next(stylesheet);
                });
            });
    }
}
