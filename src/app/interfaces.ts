export interface DesignProperty {
    pack?: string,
    label?: string,
    value?: any,
    binder?: string, // Same as objectKey, used for Array in designPropertiesArray

    // Input type
    input: "text" | "textbox" | "range" | "radiobuttons" | "image" | "separator",

    // In range type : max and min value
    // In text type : max and min letters
    min?: number,
    max?: number,

    // In range type : step differences
    step?: number,

    // In radiobuttons type : list of options
    options?: string[],

    _objectKey?: string
}

export interface DesignProperties {
    [key: string]: DesignProperty
}

// declare global {
//     interface NodeList {
//         forEach?: (handler: Function) => void;
//     }
// }

declare global {
    interface Window {
        ga?: any;
    }
}
