/**
 * Force bind by bypassing security trust.
 * Source : https://forum.ionicframework.com/t/inserting-html-via-angular-2-use-of-domsanitizationservice-bypasssecuritytrusthtml/62562
 */

import { DomSanitizer } from '@angular/platform-browser';
import { Pipe } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SafeScript } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser';

@Pipe({
	name: 'safe'
})
export class SafePipe {

	constructor(protected _sanitizer: DomSanitizer) { }

	public transform(value: string, type: string = 'html'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
		switch (type) {
			case 'html': return this._sanitizer.bypassSecurityTrustHtml(value);
			case 'style': return this._sanitizer.bypassSecurityTrustStyle(value);
			case 'script': return this._sanitizer.bypassSecurityTrustScript(value);
			case 'url': return this._sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl': return this._sanitizer.bypassSecurityTrustResourceUrl(value);
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
	}

}
