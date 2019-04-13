class Model {
    constructor(id) {
        this.id = id;
    }

    toJSON() {
        let result = {};
        for (let key in Object.keys(this)) {
            if (this[key] instanceof Model) {
                result[key] = this[key].toJSON();
            } else {
                result[key] = this[key];
            }
        }
        return result;
    }
}

module.exports = Model;