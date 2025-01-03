

const FoodDonation = require("../models/foodModel");
const Redisutils = require("../utils/redisUtils");
class FoodService {

    static async createFoodItem(data) {
        const saveItem = new FoodDonation({ ...data });

        try {
            await saveItem.save();
            await Redisutils.clearmultiple("foodItems")
            return saveItem;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateFoodItem(id, data) {


        const updatedItem = await FoodDonation.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )

        if (!updatedItem) {
            throw new Error("Food donation item not updated");
        }


        await Redisutils.clearCache(`foodItem:${id}`, `foodItemsByUserId:${updatedItem.donatedBy}`, "foodItems")


        return updatedItem;
    }



    static async getFoodItemById(id) {

        const cacheKey = `foodItem:${id}`;

        const cache = await Redisutils.getCache(cacheKey);

        if (cache)
            return JSON.parse(cache);



        const data = await FoodDonation
            .findById(id)
            .populate('donatedBy', "name organization_name")
            .exec();


        await Redisutils.setCache(cacheKey, data);

        return data;
    }


    static async getFoodItemsByUserId(id) {

        const cacheKey = `foodItemsByUserId:${id}`;
        const cache = await Redisutils.getCache(cacheKey);

        if (cache)
            return JSON.parse(cache);

        const data = await FoodDonation.find({ donatedBy: id });

        await Redisutils.setCache(cacheKey, data);
        return data;
    }

    static async getFoodItems() {

        const cacheKey = "foodItems"
        const cache = await Redisutils.getCache(cacheKey);
        if (cache)
            return JSON.parse(cache);


        const currentDate = new Date().toISOString().split('T')[0];

        const data = await FoodDonation.find({ expirationDate: { $gt: currentDate } });

        await Redisutils.setCache(cacheKey, data)

        return data;
    }

}


module.exports = FoodService