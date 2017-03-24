import { Component, OnInit } from '@angular/core';

import { PainterService } from './painter.service';
import { DesignProperty, DesignProperties, ArtboardTemplate } from './interfaces';

@Component({
    selector: 'page-test',
    templateUrl: '/app/page-test.component.html',
    styleUrls: ['/app/page-test.component.css'],
    providers: [PainterService]
})
export class PageTestComponent {
    designProperties: DesignProperties = {
        text3 : {
            group: "A",
            label: "Kota 1",
            value : 'jogja',
            type: 'text'
        } ,
        text4: {
            group: "A",
            label: "Kota 2",
            value : 'jogja',
            type: 'text'
        } ,
        size1: {
            group: "A",
            label: "Ukuran Teks",
            value : '90',
            type: 'slider'
        }
    };

    designPropertiesArray: DesignProperty[] = [];

    artboardTemplate: ArtboardTemplate = {
        html: `
            <div>{{text3}}</div>
            <div>{{text3}}</div>
            <div>{{text4}}</div>
            <div>{{text4}}</div>
            <div style="font-size: {{size1}}px">{{text4}}</div>
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

        this.designProperties[key].value = value;
        
        this.artboardOutput = this.modifyCanvas(this.designProperties, this.artboardTemplate);
    }

    modifyCanvas(designProperties: DesignProperties, artboardTemplate: ArtboardTemplate) {
        return this.painterService.fill(designProperties, artboardTemplate);
    }
}