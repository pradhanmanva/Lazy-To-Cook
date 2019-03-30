/**
 * Base router class that takes care of basic routing capabilities.
 * 
 * Extend this class for providing custom routing capabilities for your entity.
 */

const NO_ENDPOINT = "Endpoint unavailable.";

class Router {
    constructor(app) {
        this.app = app;
        this.BASE_URL = "/api";
    }

    getBaseUrl() {
        return this.BASE_URL;
    }

    setBaseUrl(url) {
        this.BASE_URL = url;
    }

    getAll(request, response) {
        response.status(404).send(NO_ENDPOINT);
    }

    get(id, request, response) {
        response.status(404).send(NO_ENDPOINT);
    }

    add(request, response) {
        response.status(404).send(NO_ENDPOINT);
    }

    update(id, request, response) {
        response.status(404).send(NO_ENDPOINT);
    }

    delete(id, request, response) {
        response.status(404).send(NO_ENDPOINT);
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
     * @param {*} routes 
     */
    wire() {
        const self = this;
        this.app
        .get(this.getBaseUrl(), this.getAll)
        .get(this.getBaseUrl()+"/:id", (request, response) => {
            self.get(request.params["id"], request, response);
        })
        .post(this.getBaseUrl(), this.add)
        .put(this.getBaseUrl()+"/:id", (request, response) => {
            self.update(request.params["id"], request, response);
        })
        .delete(this.getBaseUrl()+"/:id", (request, response) => {
            self.delete(request.params["id"], request, response);
        });
    }
}

module.exports = Router;