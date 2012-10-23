## express-hal

An implementation of [HAL](http://stateless.co/hal_specification.html) for
[Express.js](http://stateless.co/hal_specification.html).

 * Exposes a `res.hal` method for automatically assembling a JSON-HAL response body.
 * Adds a req/res.resource object for building your resource prior to res.hal

### Installation

    npm install express-hal

### Usage

```javascript
// app.js
var hal = require("express-hal");

// before the router middleware
app.use(hal.middleware);

// routes
app.get("/orders", function (req, res, next) {
    res.hal({
        data: {
            currentlyProcessing: 14,
            shippedToday: 20,
        },
        links: {
            self: "/orders",
            next: "/orders?page=2",
            find: { href: "/orders{?id}", templated: true }
        },
        embeds: {
            "orders": [
                {
                    data: {
                        total:    30.00,
                        currency: "USD",
                        status:   "shipped"
                    },
                    links: {
                        self:     "/orders/123",
                        basket:   "/baskets/98712",
                        customer: "/customers/7809"
                    }
                },
                {
                    data: {
                        total:    20.00,
                        currency: "USD",
                        status:   "processing"
                    },
                    links: {
                        self:     "/orders/124",
                        basket:   "/baskets/97213",
                        customer: "/customers/12369"
                    }
                }
            ]
        }
    });
});
```
