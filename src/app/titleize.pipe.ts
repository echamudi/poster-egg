import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'titleize' })
export class TitleizePipe implements PipeTransform {

    transform(value: any) {
        if (value) {
            let string = value;
            string = string.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

            // Exceptions
            let replaceDict: any = {
                "And": "and",
                "Dan": "dan"
            }

            Object.keys(replaceDict).forEach(key => {
                string = string.replace(key, replaceDict[key])
            });

            return string;
        }
        return value;
    }

}
