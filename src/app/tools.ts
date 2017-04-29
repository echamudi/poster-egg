/**
 * Escape string from any regex format.
 * Source: http://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
 * @param string 
 */
export function escapeRegExp(string: string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Replace all occurences in a string
 * Source: http://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
 * @param string
 * @param find
 * @param replace
 */
export function replaceAll(string: string, find: string, replace: string) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Object to Array
 */
export function objToArray(obj: any) {
    let returney: any[] = [];

    Object
        .keys(obj)
        .map((objectKey, Index) => {
            returney[Index] = obj[objectKey];
            returney[Index]._objectKey = objectKey;
        });

    return returney;
}
/**
 * Detect if a string RTL
 */
export function detectRTL(text: string) {

    // don't count spaces and new line
    text = text.replace(/[\n ]/g, "");

    var rtlChar = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;

    var totalRTL = text.match(rtlChar) ? text.match(rtlChar).length : 0;
    var totalLTR = text.length - totalRTL;

    var ratio = totalRTL / totalLTR;

    return ratio >= 1 ? true : false;
}
