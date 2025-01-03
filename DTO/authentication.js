
const { z } = require('zod')

const category = ['donor', 'requester']

const registerUserSchema = z.object({
    name: z.string().min(2, "name is to short"),
    organization_name: z.string().min(2, "organization name is required"),
    email: z.string().email("invalid email address"),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must not exceed 32 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    role: z.enum(category),
    address: z.string(),
    phone: z.string()
        .regex(/^\d{10}$/, {
            message: "Phone number must be exactly 10 digits."
        })

})

const loginUserSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string()

})



const idSchema = z.string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");


const roleSchema = z.enum(['donor', 'requester', 'all'])




module.exports = {
    registerUserSchema,
    loginUserSchema,
    idSchema,
    roleSchema
}