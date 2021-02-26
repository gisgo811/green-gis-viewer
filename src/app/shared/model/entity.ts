//数据库实体基类
import {Serialize, SerializeMetaKey, ChildrenMetaKey, Alias, Column, Editor} from "./decorator";
import "reflect-metadata";
import {Meta} from "./meta";

export class Entity {

    @Serialize()
    public _id: string = null;


    constructor() {
    }

    public static getMeta(): Array<Meta> {
        const metas = new Array<Meta>();
        const cls: any = this;
        const entity = new cls();
        Reflect.ownKeys(entity).forEach( property => {
            const meta = new Meta();
            meta.init(entity, property);
            metas.push(meta);
        });
        return metas;
    }

    //赋值
    copy(entity: Entity) {
        Object.keys(this).forEach( property => {
            const children = Reflect.getMetadata(ChildrenMetaKey, this, property);
            if (children && entity[property]) {
                this[property] = [...entity[property]];
            } else {
                this[property] = entity[property];
            }
        });
    }

    //复制
    clone(): Entity {
        const cls: any = this.constructor;
        const entity = new cls();
        Object.keys(this).forEach( property => {
            const children = Reflect.getMetadata(ChildrenMetaKey, this, property);
            if (children && this[property]) {
                entity[property] = [...this[property]];
            } else {
                entity[property] = this[property];
            }
        });
        return entity
    }

    deepCopy(entity: Entity) {
        entity && Object.keys(this).forEach(property => {
            if (Array.isArray(entity[property])) {
                const children = Reflect.getMetadata(ChildrenMetaKey, this, property);
                if (children) {
                    this[property] = new Array(entity[property].length);
                    if(children.prototype.deepCopy){
                        entity[property].forEach((item, idx) => {
                            const child = new children();
                            child.deepCopy(item);
                            this[property][idx] = child;
                        });
                    }else{
                        entity[property].forEach((item, idx) => {
                            this[property][idx] = item;
                        });
                    }
                } else {
                    this[property] = [...entity[property]];
                }
            } else {
                if (this[property] && this[property].deepCopy) {
                    this[property].deepCopy(entity[property]);
                } else {
                    this[property] = entity[property];
                }
            }
        });
    }

    deepClone(): Entity {
        const cls: any = this.constructor;
        const entity = new cls();
        Object.keys(this).forEach(property => {
            if (Array.isArray(this[property])) {
                entity[property] = new Array(this[property].length);
                this[property].forEach((item, idx) => {
                    if (item && item.deepClone) {
                        entity[property][idx] = item.deepClone();
                    } else {
                        entity[property][idx] = item;
                    }
                })
            } else {
                if (this[property] && this[property].deepClone) {
                    entity[property] = this[property].deepClone();
                } else {
                    entity[property] = this[property];
                }
            }
        });
        return entity
    }

    toString(): string {
        return this._id || '未命名';
    }

    toJSON(): any {
        const obj = {};
        Object.keys(this).forEach( property => {
            const serialize = Reflect.getMetadata(SerializeMetaKey, this, property);
            if (serialize) {
                const children = Reflect.getMetadata(ChildrenMetaKey, this, property);
                if (children) {
                    if (Array.isArray(this[property])){
                        obj[serialize] = [];
                        this[property].forEach(item => {
                            if (item instanceof Entity) {
                                obj[serialize].push(item.toJSON());
                            } else {
                                obj[serialize].push(item);
                            }
                        })
                    }
                } else {
                    if (this[property] instanceof Entity) {
                        obj[serialize] = this[property].toJSON();
                    } else {
                        obj[serialize] = this[property];
                    }
                }
            }
        });
        return obj;
    }

    fromJSON(obj) {
        obj && Object.keys(this).forEach( property => {
            const serialize = Reflect.getMetadata(SerializeMetaKey, this, property);
            if (serialize) {
                const children = Reflect.getMetadata(ChildrenMetaKey, this, property);
                if (children) {
                    if (Array.isArray(obj[serialize])){
                        this[property] = [];
                        obj[serialize].forEach( item => {
                            const entity = new children();
                            if (entity instanceof Entity) {
                                entity.fromJSON(item);
                                this[property].push(entity);
                            } else {
                                this[property].push(item);
                            }
                        });
                    }
                } else {
                    if (this[property] instanceof Entity) {
                        this[property].fromJSON(obj[serialize]);
                    } else {
                        this[property] = obj[serialize];
                    }
                }
            }
        });
    }

    print() {
        Object.keys(this).forEach( property => {
            console.log(property + ": " + this[property]);
        });
    }

    create() {
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        this._id = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    }

    //重载 属性变化后刷新
    refresh() {

    }

}


