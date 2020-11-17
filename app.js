const express = require("express");
const body_parser = require("body-parser");

const app = express();

const url_route = require("./routes/url");

app.use(body_parser.json());

app.use("/api/url", url_route);
app.use("/", url_route);

module.exports = app;
