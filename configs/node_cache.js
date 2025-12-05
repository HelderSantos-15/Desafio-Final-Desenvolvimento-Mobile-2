const express = require('express');
const NodeCache = require('node_cache');
const app = express();
const cache = new NodeCache();
app.use(express.json());