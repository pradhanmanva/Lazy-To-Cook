const PLURALS = require("./plurals.json");

class AppUtil {
    static pluralize(word) {
        return PLURALS[word] || `${word}s`;
    }

    static getEntityIdPattern(entity) {
        return `:${AppUtil.getEntityIdStr(entity)}`;
    }
    
    static getEntityIdStr(entity) {
        return `${entity}_id`;
    }
}

module.exports = AppUtil;