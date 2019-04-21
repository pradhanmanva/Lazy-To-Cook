class Model {
    constructor(id) {
        this.id = id;
    }

    toJSON(shouldIncludeIsDeleted) {
        let result = {};
        const props = Object.keys(this);
        for (let prop of props) {
            if (this[prop]) {
                if (this[prop] instanceof Model) {
                    result[prop] = this[prop].toJSON();
                } else {
                    result[prop] = this[prop];
                }
            }
        }
        if (!shouldIncludeIsDeleted) {
            delete result.is_deleted;
        } else {
            if (result.is_deleted) {
                result.is_deleted = (result.is_deleted == 1);
            }
        }
        return result;
    }
}

module.exports = Model;