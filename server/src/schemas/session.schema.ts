import {object, string } from "zod";

const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email({
            message: "Invalid email address"
        }),
        password: string({
            required_error: 'Password is required'
        }).min(6, `password length should be between 6 - 12 characters`).max(12)
    })
})

export default createSessionSchema
