const Redisutils = require("../utils/redisUtils");
const User = require("../models/userModel")

class UserService {

    static async createUser(data) {
        const { email } = data;

        const isUserExit = await User.findOne({ email });

        if (isUserExit)
            throw new Error("user already exist");

        const user = new User({ ...data });
        try {



            await user.save()

            const { password, ...userWithoutPassword } = user._doc;
            await Redisutils.clearCache("usersCounts")
            return userWithoutPassword;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getUserInfo(email) {

        let user = await User.findOne({ email });

        return user;

    }

    static async getUserById(id) {
        const cacheKey = `user:${id}`;
        const cache = await Redisutils.getCache(cacheKey);
        if (cache) return JSON.parse(cache);

        let user = await User.findById(id);
        await Redisutils.setCache(cacheKey, user)
        return user;
    }

    static async getUserCount() {
        const cacheKey = "usersCounts"
        const cache = await Redisutils.getCache(cacheKey);
        console.log("cache",cache)
        if (cache) return JSON.parse(cache)


        const userCount = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]) 

        console.log("userCount",userCount)

        await Redisutils.setCache(cacheKey, userCount)
        

        return userCount
    }

}

module.exports = UserService;