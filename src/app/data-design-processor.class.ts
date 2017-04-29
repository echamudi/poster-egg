export class DataDesignProcessorClass {

    // Data Design array format
    // dataDesign[0] --> json
    // dataDesign[1] --> html
    // dataDesign[2] --> css

    private dataDesignChild: any[];
    private dataDesignParent: any[];
    private dataDesignMerged: any[];

    constructor() { }

    public setDataDesignParent(dataDesign: any[]): this {
        this.dataDesignParent = dataDesign;
        return this;
    }

    public setDataDesignChild(dataDesign: any[]): this {
        this.dataDesignChild = dataDesign;
        return this;
    }

    public getDataDesignChild() {
        return this.dataDesignChild;
    }

    public getParentID(): any {
        return {
            packID: this.dataDesignChild[0].extends.packID,
            designID: this.dataDesignChild[0].extends.designID
        };
    }

    public getDataDesignMerged() {
        return this.dataDesignMerged;
    }

    public getChildWantsExtend(): boolean {
        return this.dataDesignChild[0].hasOwnProperty('extends');
    }

    public merge(): this {
        let dataDesignMerged: any[] = [];

        // Check if the child wants to extends HTML (no merge)
        switch (this.dataDesignChild[0].extends.mergeBehaviour.html) {
            case "use-parent":
                dataDesignMerged[1] = this.dataDesignParent[1];
                break;
            case "use-child":
            default:
                dataDesignMerged[1] = this.dataDesignChild[1];
                break;
        }

        // Check if the child wants to extends CSS,
        switch (this.dataDesignChild[0].extends.mergeBehaviour.css) {
            case "use-parent":
                dataDesignMerged[2] = this.dataDesignParent[2];
                break;
            case "parent-then-child":
                dataDesignMerged[2] = this.dataDesignParent[2] + this.dataDesignChild[2];
                break;
            case "child-then-parent":
                dataDesignMerged[2] = this.dataDesignChild[2] + this.dataDesignParent[2];
                break;
            case "use-child":
            default:
                dataDesignMerged[2] = this.dataDesignChild[2];
                break;
        }

        // Clone the child json to the merged json
        dataDesignMerged[0] = Object.assign({}, this.dataDesignChild[0]);

        // If the child json doesn't have fonts and size, we will take them from parent json
        dataDesignMerged[0].fonts = dataDesignMerged[0].fonts ? dataDesignMerged[0].fonts : this.dataDesignParent[0].fonts;
        dataDesignMerged[0].size = dataDesignMerged[0].size ? dataDesignMerged[0].size : this.dataDesignParent[0].size;

        // Merging designProperties
        // This merging designed to merge properties that already exist in parent,
        // dataDesignChild shouldn't add new property that isn't defined in dataDesignParent
        dataDesignMerged[0].designProperties = this.dataDesignParent[0].designProperties;
        Object.keys(this.dataDesignChild[0].designProperties).forEach((key) => {
            dataDesignMerged[0].designProperties[key] = Object.assign(
                {},
                this.dataDesignParent[0].designProperties[key],
                this.dataDesignChild[0].designProperties[key]
            );
        });
        this.dataDesignMerged = dataDesignMerged;

        return this;
    }
}