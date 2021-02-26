//元数据
import {
    Serialize,
    SerializeMetaKey,
    ChildrenMetaKey,
    Alias,
    Column,
    RelateMetaKey,
    ColumnMetaKey,
    EnumMetaKey, EditorMetaKey, AliasMetaKey, RegisterMetaKey, CascadeMetaKey, SortMetaKey, FilterMetaKey
} from "./decorator";
import "reflect-metadata";

export class Meta {

    public key: string = "";
    public serialize: string = "";
    public alias: string = "";
    public column: boolean = false;
    public sort: boolean = false;
    public filter: boolean = false;
    public children: any;
    public editor: string = "";
    public editor_param: any;
    public enum: any;
    public relate: any;
    public relate_name: any;
    public multiple: boolean = false;
    public cascade_parent: string = "";
    public cascade_children: string = "";

    public enums: any;
    public list: any;
    public columns: any;

    public mode: any = "default"; //nz-select mode : tags, multiple, default

    public filter_list: any = [];

    constructor() {
    }

    init(target, property) {
        this.key = property;
        this.serialize =  Reflect.getMetadata(SerializeMetaKey, target, property);
        this.alias = Reflect.getMetadata(AliasMetaKey, target, property);
        this.column = Reflect.getMetadata(ColumnMetaKey, target, property);
        this.sort = Reflect.getMetadata(SortMetaKey, target, property);
        this.filter = Reflect.getMetadata(FilterMetaKey, target, property);
        this.children = Reflect.getMetadata(ChildrenMetaKey, target, property);
        const editor = Reflect.getMetadata(EditorMetaKey, target, property);
        if (editor) {
            [this.editor, this.editor_param] = editor;
        }
        this.enum = Reflect.getMetadata(EnumMetaKey, target, property);
        this.enums = [];
        if (this.enum) {
            Object.keys(this.enum).filter((key:any) => isNaN(Number(key))).forEach( key => {
                this.enums.push({
                    key: key,
                    value: this.enum[key]
                });
            })
        }
        const relate = Reflect.getMetadata(RelateMetaKey, target, property);
        if (relate) {
            [this.relate, this.relate_name, this.multiple] = relate;
            /*const register =  Reflect.getMetadata(RegisterMetaKey, this.relate);
            if (register) {
                this.list = register().getInstance().getCollection(this.relate);
            }*/
            if (this.multiple) this.mode = "multiple";
        }
        if (!this.relate && this.children && this.editor == 'List') {
            this.multiple = true;
            this.list = target[property] ? target[property] : [];
            if (this.children.name == "String") this.mode = "tags";
        }
        const cascade = Reflect.getMetadata(CascadeMetaKey, target, property);
        if (cascade && this.editor == 'List') {
            [this.cascade_parent, this.cascade_children] = cascade;
            this.list = target[this.cascade_parent] ? target[this.cascade_parent][this.cascade_children] : [];
        }
    }

}


