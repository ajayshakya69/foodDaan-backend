
const UserService = require('../services/userService');
const { registerUserSchema, loginUserSchema } = require('../DTO/authentication');
const zodError = require('../lib/zodError');
const jwtHelper = require('../utils/jwtUtils');


class AuthController {


    static async register(req, res, next) {


        const validation = registerUserSchema.safeParse(req.body);

        if (!validation.success) {

            res.status(400);
            throw new Error(zodError(validation.error));
        }

        try {

            const saveUser = await UserService.createUser(validation.data)

            if (!saveUser) {
                res.status(400);
                throw new Error("user not created")
            }

            res.status(201).json({ message: "user created successfully", user: saveUser })
        } catch (error) {
            res.status(400)
            next(error)

        }
    }



    static async login(req, res, next) {


        const validation = loginUserSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(zodError(validation.error));
        }

        const { email, password } = validation.data;


        try {

            const checkUser = await UserService.getUserInfo(email)

            if (!checkUser || !(await checkUser.matchPassword(password))) {
                throw new Error("invalid credentials");
            }

            const accessToken = jwtHelper.generateAccessToken(checkUser)

            const IdToken = await jwtHelper.generateIdToken(checkUser._id)
            const refreshToken = await jwtHelper.generateRefreshToken(checkUser)




            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });


            res.status(200).json({ accessToken, user: checkUser, IdToken })


        } catch (error) {
            if (error.message == "invalid credentials") {
                res.status(401)
            }
            next(error)
        }
    }



    static async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refresh_token

            if (!refreshToken)
                throw new Error("refresh token not found");

            const verify = await jwtHelper.verifyRefreshToken(refreshToken)
            if (verify) {
                res.cookie('refresh_token', verify.newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                });

                res.status(200).json({ accessToken: verify.newAccessToken, idtoken: verify.newIdToken })
            }

        } catch (error) {
            if (error.message === "invalid token")
                res.status(401)
            next(error)
        }
    }
}



module.exports = AuthController;


