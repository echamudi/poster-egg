import { Component, OnInit } from '@angular/core';

import { PainterService } from './painter.service';
import { DesignProperty, DesignProperties, ArtboardTemplate } from './interfaces';

@Component({
    selector: 'page-editor',
    templateUrl: '/app/page-editor.component.html',
    styleUrls: ['/app/page-editor.component.css'],
    providers: [PainterService]
})
export class PageEditorComponent {
    designProperties: DesignProperties = {
        text1 : {
            label: "Text 1 Sample",
            type: 'text',
            value : 'Indonesia'
        } ,
        text2: {
            label: "Text 2 Sample",
            type: 'text',
            value : 'Australia'
        } ,
        size1: {
            label: "Text Size",
            type: 'range',
            value : '90',
            min: 50,
            max: 95
        }
    };

    designPropertiesArray: DesignProperty[] = [];

    artboardTemplate: ArtboardTemplate = {
        html: `
            <style>
                div[artboardElement] {
                    font-size: {{size1}}px
                }
            </style>
            <div artboardElement>{{text1}}</div>
            <div artboardElement>{{text2}}</div>
            `
    };
    artboardOutput: string;

    constructor ( private painterService: PainterService ) {

        this.designPropertiesArray = this.painterService.designPropertiesObjectToArray(this.designProperties);
        
        // Initial Render
        this.artboardOutput = this.modifyCanvas(this.designProperties, this.artboardTemplate);
    }

    changed(arg: any) {
        // Get designPropertyBinder from the text input for designProperties and its value
        let key = arg.target.getAttribute('designPropertyBinder');
        let value = arg.target.value;

        this.designProperties[key].value = value.toString();
        
        this.artboardOutput = this.modifyCanvas(this.designProperties, this.artboardTemplate);

    }

    modifyCanvas(designProperties: DesignProperties, artboardTemplate: ArtboardTemplate) {
        return this.painterService.fill(designProperties, artboardTemplate);
    }
}