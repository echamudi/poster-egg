export interface DesignProperty {
    group?: string
    label: string,
    value: string,
    type?: string,
    binder?: string
}

export interface DesignProperties {
    [key: string]: DesignProperty
}

export interface ArtboardTemplate {
    html: string;
};