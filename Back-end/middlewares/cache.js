const NodeCache = require("node-cache");
const chalk = require("chalk");

const cache = new NodeCache({ stdTTL: 30 }); // 30 segundos de cache

function cacheMiddleware(req, res, next) {
    const key = "clientes_cache";
    const cachedData = cache.get(key);

    if (cachedData) {
        console.log(chalk.green("[CACHE] Resposta vinda do cache"));
        return res.status(200).json(cachedData);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body);
        console.log(chalk.blue("[DB] Resposta vinda do banco. Cache salvo."));
        res.sendResponse(body);
    };

    next();
}

function invalidateClientesCache() {
    cache.del("clientes_cache");
    console.log(chalk.red("[CACHE] Cache de clientes invalidado"));
}

module.exports = {
    cacheMiddleware,
    invalidateClientesCache,
};
