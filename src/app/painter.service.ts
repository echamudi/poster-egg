/**
 * Painter is one stop service for processing design properties, artboard template, and rendering template 📸 🖨 🎆
 */

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { DesignProperty, DesignProperties, ArtboardTemplate } from './interfaces';

import * as tool from './tools';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PainterService {
    
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

    /**
     * Fill canvas template with design properties using regex
     */
    fill(designProperties: DesignProperties, artboardTemplate: ArtboardTemplate): string {
        let returney: string = artboardTemplate.html ;

        Object
            .keys(designProperties)
            .map(objectKey => {
                returney = tool.replaceAll(returney, "{{" + objectKey + "}}", designProperties[objectKey].value);
            });

        return returney;
    }
}
