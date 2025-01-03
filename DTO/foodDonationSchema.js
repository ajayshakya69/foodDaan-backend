const {z} =require('zod')

const foodItemSchema = z.object({
    foodName: z.string()
        .min(1, "Title is required"),

    description: z.string().optional(),

    quantity: z.number()
        .min(1, "Quantity is required and must be greater than 0"),

    location: z.string()
        .min(1, "Location is required"),

    expirationDate: z.string(),

    donatedBy: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),

    createdAt: z.date()
        .default(() => new Date()),

    isAvailable: z.boolean()
        .default(true)
});




module.exports = {
    foodItemSchema,
}

