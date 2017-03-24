import "../node_modules/core-js/client/shim.min.js";
import '../node_modules/zone.js/dist/zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);