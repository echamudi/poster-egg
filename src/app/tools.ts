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
