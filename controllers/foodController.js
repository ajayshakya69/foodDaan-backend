const { foodItemSchema } = require("../DTO/foodDonationSchema");
const { idSchema } = require("../DTO/authentication");
const zodError = require("../lib/zodError");
const FoodService = require("../services/foodService")



class FoodController {

    static async createFoodItem(req, res, next) {


        const validation = foodItemSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(zodError(validation.error));
        }

        try {
            const saveItem = await FoodService.createFoodItem(validation.data)
            res.status(201).json({ message: "item added", data: saveItem })
        } catch (error) {
            res.status(400);
            next(error)
        }
    }

    static async updateFoodItem(req, res, next) {
        const idvalidation = idSchema.safeParse(req.params.id);

        if (!idvalidation.success) {
            res.status(400);
            throw new Error(zodError(idvalidation.error));
        }


        const dataValidation = foodItemSchema.safeParse(req.body);
        if (!dataValidation.success) {
            res.status(400);
            throw new Error(zodError(dataValidation.error));
        }

        try {

            const saveItem = await FoodService.updateFoodItem(idvalidation.data, dataValidation.data)

            res.status(200).json({ message: "item updated", data: saveItem })
        } catch (error) {
            res.status(400);
            next(error)
        }

    }


    static async deleteFoodItem(req, res) {

    }


    static async getFoodItems(_, res, next) {

        
        try {
            const data = await FoodService.getFoodItems();
            if (data.length === 0) {
                throw new Error("Product Not Found")
            }
            res.status(200).send(data)
        } catch (error) {
            if (error.message === "Product Not Found")
                res.status(400)
            next(error)
        }
    }


    static async getFoodItemsByUserId(req, res, next) {
        const validation = idSchema.safeParse(req.params.userId)
            ;
        if (!validation.success) {
            res.status(400);
            throw new Error(zodError(validation.error));
        }
        try {
            const data = await FoodService.getFoodItemsByUserId(validation.data)
            if (data.length === 0) {
                throw new Error("No donation found")
            }
            res.status(200).send(data)
        } catch (error) {
            if (error.message === "No donation found")
                res.status(400)
            next(error)
        }
    }



    static async getFoodItemById(req, res, next) {
        const validation = idSchema.safeParse(req.params.id)
            ;
        if (!validation.success) {
            res.status(400);
            throw new Error(zodError(validation.error));
        }
        try {
            const data = await FoodService.getFoodItemById(validation.data)
            if (!data) {
                throw new Error("Product Not Found")
            }
            res.status(200).send(data)
        } catch (error) {
            if (error.message === "Product Not Found")
                res.status(400)
            next(error)
        }
    }

}

module.exports = FoodController;