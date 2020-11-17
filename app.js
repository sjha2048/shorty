const express = require('express')
const body_parser = require('body-parser')

const app = express()

app.use(body_parser.json())



module.exports = app;