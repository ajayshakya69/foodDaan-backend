const jwt = require("jsonwebtoken");


class VerifyUsers {
    static async validateUser(req, res, next) {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        token = token.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            req.user = payload;

            next();
        } catch (error) {
            console.log("error", error.name)
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                console.log("is the error",error)
                return res.status(403).json({ message: "Unauthorized" });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = VerifyUsers;