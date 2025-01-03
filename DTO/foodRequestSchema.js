
const { z } = require('zod');


const status = ['pending', 'accepted', 'rejected', 'cancelled','completed'];


const foodRequestSchema = z.object({
    requesterId: z.string().min(1, "Requester id  is required"),
    donorId: z.string().min(1, "Requester id  is required"),
    foodItemId: z.string().min(1, "Food item id is required"),
    quantity: z.number().positive("quantity must be positive"),
});

const statusSchema = z.object({
    status: z.enum(status)
})

module.exports = {
    foodRequestSchema,
    statusSchema
}