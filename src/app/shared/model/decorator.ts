import "reflect-metadata";

export const SerializeMetaKey = "Serialize";
export const ChildrenMetaKey = "Children";
export const AliasMetaKey = "Alias";
export const ColumnMetaKey = "Column";
export const SortMetaKey = "Sort";
export const FilterMetaKey = "Filter";
export const EditorMetaKey = "Editor";
export const EnumMetaKey = "Enum";
export const RelateMetaKey = "Relate";
export const RegisterMetaKey = "Register";
export const CascadeMetaKey = "Cascade";


//序列化装饰器
export function Serialize(name?: string) {
    return (target: Object, property: string): void => {
        Reflect.defineMetadata(SerializeMetaKey, name || property, target, property);
    };
    //return Reflect.metadata(serializeMetadataKey, name);
}

//子对象数组装饰器
export function Children(type) {
    return Reflect.metadata(ChildrenMetaKey, type);
}

//中文别名装饰器
export function Alias(alias: string) {
    return Reflect.metadata(AliasMetaKey, alias);
}

//表格显示列装饰器（列表视图-表格列）
export function Column() {
    return Reflect.metadata(ColumnMetaKey, true);
}

//表格显示列筛选装饰器（列表视图-表格列-筛选）
export function Filter() {
    return Reflect.metadata(FilterMetaKey, true);
}

//表格显示列排序装饰器（列表视图-表格列-排序）
export function Sort() {
    return Reflect.metadata(SortMetaKey, true);
}

//自定义类型装饰器（详情视图-编辑器筛选）
export function Editor(type: string, param?: any) {
    return Reflect.metadata(EditorMetaKey, [type, param]);
}

//枚举类型装饰器
export function Enum(type) {
    return Reflect.metadata(EnumMetaKey, type);
}

//对象关联装饰器
export function Relate(type, name, multiple?) {
    return Reflect.metadata(RelateMetaKey, [type, name, multiple ? multiple : false]);
}

//对象注册装饰器
//register should be function, e.g. ()=> MonitorConfig
//why? cause circular dependency , ref. https://github.com/microsoft/TypeScript/issues/4521
export function Register(register) {
    return Reflect.metadata(RegisterMetaKey, register);
}

//级联类型装饰器
export function Cascade(parent, children) {
    return Reflect.metadata(CascadeMetaKey, [parent, children]);
}


export function Enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
//API
/*
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

// check for presence of a metadata key on the prototype chain of an object or property
let result = Reflect.hasMetadata(metadataKey, target);
let result = Reflect.hasMetadata(metadataKey, target, propertyKey);

// check for presence of an own metadata key of an object or property
let result = Reflect.hasOwnMetadata(metadataKey, target);
let result = Reflect.hasOwnMetadata(metadataKey, target, propertyKey);

// get metadata value of a metadata key on the prototype chain of an object or property
let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);

// get metadata value of an own metadata key of an object or property
let result = Reflect.getOwnMetadata(metadataKey, target);
let result = Reflect.getOwnMetadata(metadataKey, target, propertyKey);

// get all metadata keys on the prototype chain of an object or property
let result = Reflect.getMetadataKeys(target);
let result = Reflect.getMetadataKeys(target, propertyKey);

// get all own metadata keys of an object or property
let result = Reflect.getOwnMetadataKeys(target);
let result = Reflect.getOwnMetadataKeys(target, propertyKey);

// delete metadata from an object or property
let result = Reflect.deleteMetadata(metadataKey, target);
let result = Reflect.deleteMetadata(metadataKey, target, propertyKey);
*/
