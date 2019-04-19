const UrlUtil = require("../utils/UrlUtil");
const AppUtil = require("../utils/AppUtil");

/**
 * Base router class that takes care of basic routing capabilities.
 *
 * Extend this class for providing custom routing capabilities for your entity.
 */

const NO_ENDPOINT = "Endpoint unavailable.";

class Router {
    constructor(app) {
        this.app = app;
        this.init("", "");
        this.urlPattern = "/api";
    }

    init(entity, parentEntity) {
        this.parentEntity = parentEntity;
        this.entity = entity;
        if (parentEntity && parentEntity.length) {
            this.urlPattern = UrlUtil.appendPart(this.urlPattern, AppUtil.getEntityIdPattern(this.parentEntity));
        }
        if (entity && entity.length) {
            this.urlPattern = UrlUtil.appendPart(this.urlPattern, AppUtil.pluralize(this.entity));
        }
    }

    getUrlPattern() {
        return this.urlPattern;
    }

    getAll(request, response) {
        response.status(501).send(NO_ENDPOINT);
    }

    get(id, request, response) {
        response.status(501).send(NO_ENDPOINT);
    }

    add(request, response) {
        response.status(501).send(NO_ENDPOINT);
    }

    update(id, request, response) {
        response.status(501).send(NO_ENDPOINT);
    }

    delete(id, request, response) {
        response.status(501).send(NO_ENDPOINT);
    }

    /**
     * Takes care of setting up basic routes such as
     * 1 GET /api/{entity}
     * 2 GET /api/{entity}/{id}
     * 3 PUT /api/{entity}/{id}
     * 4 POST /api/{entity}
     * 5 DELETE /api/{entity}/id
     *
     * Note: If you want to provide a custom route that differs from normal pattern,
     * extend this class, implement wire method and DO NOT call super.wire() in the derived class wire() method.
     */
    wire() {
        const self = this;
        this.app
            .get(this.getUrlPattern(), (request, response) => {
                self.getAll(request, response);
            })
            .get(this.getUrlPattern() + "/:id", (request, response) => {
                self.get(request.params["id"], request, response);
            })
            .post(this.getUrlPattern(), (request, response) => {
                self.add(request, response);
            })
            .put(this.getUrlPattern() + "/:id", (request, response) => {
                self.update(request.params["id"], request, response);
            })
            .delete(this.getUrlPattern() + "/:id", (request, response) => {
                self.delete(request.params["id"], request, response);
            });
    }
}

module.exports = Router;