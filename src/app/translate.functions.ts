import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

