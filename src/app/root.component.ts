import { Component, OnInit } from '@angular/core';
import { config } from './config';

@Component({
  selector: 'app-root',
  templateUrl: '/app/root.component.html',
  styleUrls: ['/app/app.component.css'],  
})
export class RootComponent {
  appName: string = config.appName;
}
