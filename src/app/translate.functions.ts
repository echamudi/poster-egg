import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

