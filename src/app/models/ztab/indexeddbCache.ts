import { Model } from "./model";

export class IndexeddbCache extends Model {
    public id:number|undefined;
    public content: Array<any> = [];
    public pageItem:number = 1;
    public elmindex:number = -1;

    public constructor() {
        super();
        delete this.id;
    }
}
