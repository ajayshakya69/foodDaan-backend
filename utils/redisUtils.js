const { redis } = require("../lib/redis");


class Redisutils {
    static async getCache(key) {
        try {
            console.log("getting data")
            return await redis.get(key)
       
        } catch (error) {
            return error;
        }
    }

    static async setCache(key, data) {
        try {
            return await redis.set(key, JSON.stringify(data))
        } catch (error) {
            return error;
        }
    }

    static async clearCache(...keys) {
        try {
            return await redis.del(keys)
        } catch (error) {
            return error;
        }
    }

    static async clearmultiple(prefix) {
        console.log("prefix", prefix)

        try {
            const stream = redis.scanStream({
                match: `${prefix}*`,
                count: 20
            })


            stream.on("data", (keys) => {
                console.log("keys", keys);


                if (keys.length) {
                    redis.del(keys)
                }
            })

            stream.on("end", () => {
                console.log(`Completed deleting keys with prefix ${prefix}`);
            })

        } catch (error) {
            return error;
        }
    }
}


module.exports = Redisutils;  