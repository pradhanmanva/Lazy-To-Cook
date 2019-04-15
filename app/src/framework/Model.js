class Model {
    constructor(id) {
        this.id = id;
    }

    toJSON() {
        let result = {};
        const props = Object.keys(this);
        for (let prop of props) {
            if (this[prop] instanceof Model) {
                result[prop] = this[prop].toJSON();
            } else {
                result[prop] = this[prop];
            }
        }
        return result;
    }
}

module.exports = Model;