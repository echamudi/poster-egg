import { Component, OnInit } from '@angular/core';
import { GLOBALS } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: '/app/root.component.html',
  styleUrls: ['/app/app.component.css'],  
})
export class RootComponent {
  appName: string = GLOBALS.appName;
}
