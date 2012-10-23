var hal = require("..");

describe("express-hal", function () {
    describe(".middleware", function () {
        it("should be part of the module exports", function () {
            hal.should.have.property("middleware").and.be.a("function");
        });

        it("should have the signature of middleware", function () {
            hal.middleware.should.have.length(3);
        });

        describe("res.hal()", function () {
            it("should be attached by the middleware", function () {
                var req = {}, res = {};

                hal.middleware(req, res, function () {});

                res.should.have.property("hal").and.be.a("function");
            });

            it("should call res.json() with res.resource", function () {
                var req = {},
                    res = {
                        json: function (input) {
                            input.should.equal(res.resource);
                        }
                    };

                hal.middleware(req, res, function () {});

                res.hal({ foo: "bar" });
            });
        });

        describe("(req || res).resource", function () {
            it("should be attached by the middleware", function () {
                var req = {}, res = {};

                hal.middleware(req, res, function () {});

                req.should.have.property("resource").and.be.instanceof(hal.Resource);
                res.should.have.property("resource").and.equal(req.resource);
            });
        });
    });

    describe(".Resource", function () {
        it("should be a constructor function", function () {
            hal.Resource.should.be.a("function");
        });

        describe("data parameter", function () {
            it("should be optional", function () {
                var resource = new hal.Resource();
                resource.should.eql({});
            });
        });

        describe("#extend()", function () {
            it("should populate the _links property if `links` is specified", function () {
                var resource = new hal.Resource({
                    links: {
                        foo: "/bar"
                    }
                });

                resource.should.have.property("_links");
            });

            it("should populate the _embedded property if `embeds` is specified ", function () {
                var resource = new hal.Resource({
                    embeds: [
                        { lower: "a", upper: "A" }
                    ]
                });

                resource.should.have.property("_embedded");
            });

            it("should extend the object with anything else", function () {
                var resource = new hal.Resource({ hello: "world" });
                resource.should.eql({ hello: "world" });
            });

            it("should extend the object itself with anything in the `data` key", function () {
                var resource = new hal.Resource({ data: { foo: "bar" } });
                resource.should.eql({ foo: "bar" });
            });
        });

        describe("#link()", function () {
            var resource;

            beforeEach(function () {
                resource = new hal.Resource();
            });

            it("should take the 1st argument as the link's rel (and key for _links)", function () {
                resource.link("foo", "/bar");
                resource._links.should.have.property("foo");
            });

            it("should return data when only 1 argument is passed", function () {
                resource.link("hello", "/world");
                resource.link("hello").href.should.equal("/world");
            });

            it("should take the 2nd argument as the href/url", function () {
                resource.link("self", "/");
                resource._links.self.href.should.equal("/");
            });

            it("should accept the 2nd argument as a hash", function () {
                resource.link("self", { href: "/orders" });
                resource._links.self.href.should.equal("/orders");
            });

            it("should take the 3rd argument and extend the link's data", function () {
                resource.link("hello", "/{name}", { templated: true });
                resource._links.hello.should.eql({
                    href: "/{name}",
                    templated: true
                });
            });
        });

        describe("#links()", function () {
            var resource;

            beforeEach(function () {
                resource = new hal.Resource();
            });

            it("should accept a hash of `rel: href` pairs", function () {
                resource.links({
                    a: "/a",
                    b: "/b"
                });

                resource._links.should.eql({
                    a: { href: "/a" },
                    b: { href: "/b" }
                });
            });

            it("should accept a hash of `rel: { info }` pairs", function () {
                resource.links({
                    hello: { href: "/hello?name={name}", templated: true }
                });

                resource._links.hello.should.eql({
                    href: "/hello?name={name}",
                    templated: true
                });
            });
        });

        describe("#embed()", function () {
            var customers = [
                    { name: "Dominic" },
                    { name: "Joanie" }
                ],
                resource;

            beforeEach(function () {
                resource = new hal.Resource();
            });

            it("should add a new collection to _embedded", function () {
                resource.embed("customers", customers[0]);

                resource._embedded.customers.should.be.instanceof(Array).and.have.length(1);
            });

            it("should append to the collection if already created", function () {
                resource.embed("customers", customers[0]);
                resource.embed("customers", customers[1]);

                resource._embedded.customers.should.have.length(2);
            });

            it("should create new Resource object as each member of the collection", function () {
                resource.embed("customers", customers);

                resource._embedded.customers.forEach(function (cust) {
                    cust.should.be.instanceof(hal.Resource);
                });
            });
        });

        describe("#embeds()", function () {
            var users = [
                    { username: "dominicbarnes" },
                    { username: "joaniebarnes" }
                ];

            it("should accept a hash of `type: { resource }` data", function () {
                var resource = new hal.Resource();

                resource.embeds({ users: users });

                resource._embedded.should.have.property("users");
            });
        });
    });
});
