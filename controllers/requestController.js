const { foodRequestSchema, statusSchema } = require("../DTO/foodRequestSchema");
const { idSchema, roleSchema } = require("../DTO/authentication");
const FoodService = require("../services/foodService")
const FoodRequestService = require("../services/requestService")
const zodError = require("../lib/zodError")

function structuredCount(data) {
    let result = {};
    data.forEach(item => {
        result[item._id] = item.count
    })

    return result;
}


class FoodRequestController {


    static async saveRequest(req, res, next) {


        const validation = foodRequestSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(zodError(validation.error));
        }


        try {
            const { foodItemId } = validation.data;
            try {


                const foodDetail = await FoodService.getFoodItemById(foodItemId)

                if (!foodDetail) {
                    res.status(404)
                    throw new Error("Product not found")
                }
                const request = await FoodRequestService.saveRequest(validation.data);



                res.status(201).send(request)

            } catch (error) {
                res.status(400)
                throw new Error(error.message)
            }

        } catch (error) {
            if (error.message !== "Product not found")
                res.status(404)
            next(error);
        }
    }

    static async getRequestsByUserId(req, res, next) {


        const idValidation = idSchema.safeParse(req.params.userId);
        if (!idValidation.success) {
            res.status(400);
            throw new Error(zodError(idValidation.error));
        }
        const roleValidation = roleSchema.safeParse(req.params.role)

        if (!roleValidation.success) {
            res.status(400);
            throw new Error(zodError(roleValidation.error));
        }


        try {
            const data = await FoodRequestService.getRequestsByUserId(idValidation.data, roleValidation.data)
            if (!data)
                throw new Error("Request not found");


            res.status(200).json({ requests: data[0].requestData, counts: structuredCount(data[0].counts) })
        } catch (error) {
            if (error.message === "Request not found")
                res.status(404)
            next(error)
        }

    }


    static async updateRequestStatus(req, res, next) {
        const idValidation = idSchema.safeParse(req.params.id);

        if (!idValidation.success) {
            res.status(400);
            throw new Error(zodError(idValidation.error));
        }
        const statusValidation = statusSchema.safeParse(req.body);

        if (!statusValidation.success) {
            res.status(400);
            throw new Error(zodError(statusValidation.error));
        }

        try {


            await FoodRequestService.updateRequestStatus(idValidation.data, statusValidation.data.status)

            res.status(204).send();
        } catch (error) {
            if (error.message === "Request Not found")
                res.status(404)
            next(error)
        }


    }

    static async getRequestByid(req, res, next) {
        const validation = idSchema.safeParse(req.params.id);
        if (!validation.success) {
            res.status(400);
            throw new Error("id required");
        }
        try {
            const request = await FoodRequestService.getRequestById(validation.data)
            if (!request)
                throw new Error("Request not found")
            res.status(200).json(request)
        } catch (error) {
            if (error.message === "Request not found")
                res.status(404)
            next(error)
        }
    }

    static async getRecentRequests(req, res, next) {

        const idValidation = idSchema.safeParse(req.params.userId);
        if (!idValidation.success) {
            res.status(400);
            throw new Error(zodError(idValidation.error));
        }
        const roleValidation = roleSchema.safeParse(req.params.role)

        if (!roleValidation.success) {
            res.status(400);
            throw new Error(zodError(roleValidation.error));
        }
        try {
            const recentRequests = await FoodRequestService.getRecentRequests(idValidation.data, roleValidation.data)
            if (recentRequests.length < 0)
                throw new Error("No request found")
            res.status(200).send(recentRequests)
        } catch (error) {
            if (error.message === "No request found")
                res.status(404)
            next(error)
        }
    }

}

module.exports = FoodRequestController;