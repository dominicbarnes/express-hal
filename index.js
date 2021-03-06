var Resource = exports.Resource = require("./lib/Resource");

exports.middleware = function (req, res, next) {
    var resource = req.resource = res.resource = new Resource();

    res.hal = function (params) {
        if (params.data)   resource.extend(params.data);
        if (params.links)  resource.links(params.links);
        if (params.embeds) resource.embeds(params.embeds);
        if (params.code)   res.statusCode = params.code;

        res.json(resource);
    };

    return next();
};
