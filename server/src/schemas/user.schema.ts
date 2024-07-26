import {object, string, TypeOf} from 'zod';

export const createUserSchema = object({
    body: object({
        fullname: string({
            required_error: 'Fullname is required',
        }),
        email: string({
            required_error: 'Email is required'}).email({
                message: 'Invalid email address'
            }),
        password: string({
            required_error: 'Password is required'
        }).min(6, `password length should be between 6 - 12 characters`),
        confirmPassword: string({
            required_error: 'Confirm password is required'})
    }).refine((data) => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword']
    })
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.confirmPassword'>;