/**
 * Inspired by normalizr
 * @author David Bimamisa
 */

export default class Schema {
    constructor(key, options = {}) {
        if (!key || typeof key !== 'string') {
            throw new Error('The schema must have a key');
        }
        this._key = key;
        this._inputKey = options.inputKey || undefined;
        this._addProps = options.addProps || undefined;
        this._removeProps = options.removeProps || [];
        this._afterAssign = options.afterAssign;
        this._sortData = options.sortData;
        this._nestedSchema = {};
        this._parentSchema = undefined;
        this._nestedKey = undefined;
    }

    getKey() {
        return this._key;
    }

    setParentSchema(parentSchema) {
        this._parentSchema = parentSchema;
    }

    getParentSchema() {
        return this._parentSchema;
    }

    getSortData() {
        return this._sortData;

    }

    getAfterAssign() {
        return this._afterAssign;
    }

    getAddProps() {
        return this._addProps;
    }

    getRemoveProps() {
        return this._removeProps;
    }

    getNestedSchema() {
        return this._nestedSchema;
    }

    setNestedKey(nestedKey){
        this._nestedKey = nestedKey;
    }

    getNestedKey(){
        return this._nestedKey;
    }

    getInputKey(){
        return this._inputKey;
    }

    define(nestedSchema) {
        for (let key in nestedSchema) {
            if (nestedSchema.hasOwnProperty(key)) {
                this._nestedSchema[key] = nestedSchema[key];
                nestedSchema[key].setParentSchema(this);
                nestedSchema[key].setNestedKey(key);
            }
        }
    }
}
