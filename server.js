"use strict";

const
    handler = require('./notify'),
    koa = require('koa'),
    app = koa();


app.use(function*() {
    
    yield handler(
        {query: this.query, secrets: process.env},
        this.req,
        this.res
    );
    
});

app.listen(8080);
