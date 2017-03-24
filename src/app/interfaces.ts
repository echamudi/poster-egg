export interface DesignProperty {
    group?: string,
    label: string,
    value: string,
    binder?: string, // Same as objectKey, used for Array in designPropertiesArray

    // Input type
    type: "text" | "textbox" | "range" | "dropdown",

    // In range type : max and min value
    // In text type : max and min letters
    min?: number,
    max?: number,

    // In dropdown type : list of options
    options?: string[]
}

export interface DesignProperties {
    [key: string]: DesignProperty
}

export interface ArtboardTemplate {
    html: string
};