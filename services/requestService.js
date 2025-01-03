
const mongoose = require("mongoose");
const Request = require("../models/foodRequestModel");
const FoodService = require("./foodService");
const Redisutils = require("../utils/redisUtils");


class FoodRequestService {

    static async saveRequest(data) {

        try {
            let { quantity, foodItemId, requesterId, donorId } = data;


            if (quantity <= 0) {
                throw new Error("invalid quantity")
            }

            await Redisutils.clearCache(`userRequests:${requesterId}`, `userRequests:${donorId}`, `userRequestsRecent:${requesterId}`, `userRequestsRecent:${donorId}`)


            const dbRequest = await Request.findOne({ requesterId: requesterId, foodItemId: foodItemId, status: "pending" })

            if (!dbRequest) {

                const request = new Request({
                    requesterId,
                    donorId,
                    foodItemId,
                    quantity
                })

                await request.save();

                return request;
            } else {


                quantity += dbRequest.quantity;

                const request = await Request.findOneAndUpdate(
                    { requesterId: requesterId, status: "pending" },
                    { quantity: quantity },
                    { new: true }
                )

                return request;
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }





    static async updateRequestStatus(id, status) {

        const checkRequest = await FoodRequestService.getRequestById(id)
        if (!checkRequest)
            throw new Error("Request Not found")
        if (checkRequest.status !== "pending")
            throw new Error("Request Already Updated")



        if ((checkRequest.quantity > checkRequest.foodItemId.quantity && status === "accepted") || !checkRequest.foodItemId.isAvailable) {
            const request = await Request.findByIdAndUpdate(id, { status: "Cancelled" })
            return request;
        }


        else {

            const request = await Request.findByIdAndUpdate(id, { status: status })

            if (request && status === "accepted") {
                const updatedQuantity = checkRequest.foodItemId.quantity - checkRequest.quantity;

                await FoodService.updateFoodItem(checkRequest.foodItemId._id, { quantity: updatedQuantity });

            }
            await Redisutils.clearCache(`userRequests:${request.requesterId}`, `userRequests:${request.donorId}`, `userRequestsRecent:${request.requesterId}`, `userRequestsRecent:${request.donorId}`)


            return request;
        }

    }





    static async getRequestById(id) {
        const data = await Request.findById(id)
            .populate("foodItemId")

        return data;
    }



    static async getRequestsByUserId(id, role) {

        let userField = (role === "donor") ? "requester" : "donor";


        const cacheKey = `userRequests:${id}`;
        const cache = await Redisutils.getCache(cacheKey);
        if (cache)
            return JSON.parse(cache)


        const matchFilter = {
            [`${role}Id`]: new mongoose.Types.ObjectId(id)
        };

        const data = await Request.aggregate([
            {
                $match: matchFilter
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $facet: {
                    requestData: [
                        {
                            $lookup: {
                                from: "food_donations",
                                localField: "foodItemId",
                                foreignField: "_id",
                                as: "foodItem"
                            }
                        },
                        {
                            $unwind: {
                                path: "$foodItem",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {

                            $lookup: {
                                from: "users",
                                localField: `${userField}Id`,
                                foreignField: "_id",
                                as: `${userField}`
                            }

                        },
                        {
                            $unwind: {
                                path: `$${userField}`,
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                foodItem: 1,
                                createdAt: 1,
                                quantity: 1,
                                status: 1,
                                [`${userField}._id`]: 1,
                                [`${userField}.name`]: 1,
                                [`${userField}.organization_name`]: 1,
                                [`${userField}.email`]: 1,
                                [`${userField}.phone`]: 1,
                                [`${userField}.address`]: 1,

                            }
                        }
                    ],
                    counts: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        await Redisutils.setCache(cacheKey, data);

        return data;


    }


    static async getRecentRequests(id, role) {
        let userField = (role === "donor") ? "requester" : "donor";



        const cacheKey = `userRequestsRecent:${id}`
        const cache = await Redisutils.getCache(cacheKey);

        if (cache)
            return JSON.parse(cache)


        const matcher = {
            [`${role}Id`]: new mongoose.Types.ObjectId(id)
        }
        const requests = await Request.aggregate([
            {
                $match: matcher
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'food_donations',
                    localField: 'foodItemId',
                    foreignField: '_id',
                    as: 'foodItem'
                }
            },
            {

                $lookup: {
                    from: "users",
                    localField: `${userField}Id`,
                    foreignField: "_id",
                    as: `${userField}`
                }

            },
            {
                $unwind: {
                    path: `$${userField}`,
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: { path: '$foodItem', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    foodItem: 1,
                    createdAt: 1,
                    quantity: 1,
                    status: 1,
                    [`${userField}._id`]: 1,
                    [`${userField}.name`]: 1,
                    [`${userField}.organization_name`]: 1,
                    [`${userField}.email`]: 1,
                    [`${userField}.phone`]: 1,
                    [`${userField}.address`]: 1,

                }
            }
        ]);


        await Redisutils.setCache(cacheKey, requests);


        return requests;
    }
}



module.exports = FoodRequestService;