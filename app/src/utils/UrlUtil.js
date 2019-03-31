class UrlUtil {
    static appendPart(url, part) {
        if (part && part.length) {
            return url + "/" + part;
        }
        return url;
    }
}

module.exports = UrlUtil;