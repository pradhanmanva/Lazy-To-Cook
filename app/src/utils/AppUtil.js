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

    static isAdmin(request) {
        if (!request) {
            return false;
        }
        return (request.user && (request.user.type === "admin"));
    }

    static isUser(request) {
        if (!request) {
            return false;
        }
        return (request.user && (request.user.type === "user"));
    }

    static isOwner(request, idFromRequest) {
        if (!idFromRequest) {
            return false;
        }
        if (!request || !request.user || !request.user.user_id) {
            return false;
        }
        return (request.user.user_id.toString() === idFromRequest.toString());
    }

    static denyAccess(response) {
        response.status(401).send("Access denied.").end();
    }

    static badRequest(response) {
        return response.status(400).send("Invalid input.").end();
    }

    static getLoggedInUserId(request) {
        return request.user.user_id;
    }

    static getLocaleDateString(date) {
        let dateFromDB = new String(date).split(/[- :]/);
        const convertedDate = new Date(Date.UTC(dateFromDB[0], dateFromDB[1]-1, dateFromDB[2], dateFromDB[3], dateFromDB[4], dateFromDB[5]));
        return(`${convertedDate.toLocaleString().split(", ")[0]} ${convertedDate.toLocaleString().split(", ")[1]}`);
    }
}

module.exports = AppUtil;