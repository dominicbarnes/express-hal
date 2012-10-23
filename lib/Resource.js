var _ = require("lodash");

function Resource(data) {
    if (data) this.extend(data);
}

Resource.prototype.extend = function (data) {
    if (data.hasOwnProperty("links")) {
        this.links(data.links)
        delete data.links;
    }

    if (data.hasOwnProperty("embeds")) {
        this.embeds(data.embeds);
        delete data.embeds;
    }

    if (data.hasOwnProperty("data")) {
        _.extend(this, data.data);
        delete data.data;
    }

    _.extend(this, data);

    return this;
};

Resource.prototype.link = function (rel, href, options) {
    if (!this._links) this._links = {};

    if (arguments.length === 1) return this._links[rel];

    this._links[rel] = !options && _.isObject(href) ? _.clone(href) : _.extend({}, options, { href: href });

    return this;
};

Resource.prototype.links = function (links) {
    var res = this;
    _.each(links, function (href, rel) {
        res.link(rel, href);
    });
    return this;
};

Resource.prototype.embed = function (type, resource) {
    if (!this._embedded)        this._embedded = {};
    if (arguments.length === 1) return this._embedded[type];
    if (!this._embedded[type])  this._embedded[type] = [];

    if (Array.isArray(resource)) {
        resource = resource.map(function (resource) {
            return new Resource(resource);
        });
    } else {
        resource = new Resource(resource);
    }

    this._embedded[type] = this._embedded[type].concat(resource);
    return this;
};

Resource.prototype.embeds = function (embeds) {
    var res = this;
    _.each(embeds, function (resource, type) {
        res.embed(type, resource);
    });
    return this;
};

module.exports = Resource;
