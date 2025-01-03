
const jwt = require("jsonwebtoken");
const Redisutils = require("./redisUtils");
const UserService = require("../services/userService");


class jwtHelper {

    static generateAccessToken(user) {
        if (!user)
            throw new Error("user is required")
        const token = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
        return token;
    }
    
    static async generateIdToken(id) {
        if (!id)
            throw new Error("user is required")
        const user = await UserService.getUserById(id)
        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
        return token;
    }


    static async generateRefreshToken(user) {
        if (!user)
            throw new Error("user is required")

        const token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "24h" })

        await Redisutils.setCache(`refreshToken:${user._id}`, token)

        return token;
    }


    static async verifyRefreshToken(token) {


        const playload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        let savedToken = await Redisutils.getCache(`refreshToken:${playload._id}`);
        savedToken = savedToken.replace(/^"|"$/g, '');


        if (savedToken !== token) {
            console.log("result")
            await Redisutils.clearCache(`refreshToken:${playload._id}`)
            throw new Error("invalid token")
        }

        const newAccessToken = this.generateAccessToken(playload)
        const newIdToken = await this.generateIdToken(playload._id)
        const newRefreshToken = await this.generateRefreshToken(playload)



        return {
            newAccessToken,
            newRefreshToken,
            newIdToken
        };
    }

    static async decodeAccessToken(token) {

        const playload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        return playload;

    }


}

module.exports = jwtHelper;
