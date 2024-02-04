const z = require('zod')

const movieValidation = z.object({
    title: z.string({
        required_error: 'Este campo es mandatorio',
        invalid_type_error: 'El valor ingresado no es un string'
    }),
    year: z.number({
        required_error: 'Este campo es mandatorio'
    }).min(1900).max(2024),
    director: z.string({
        required_error: 'Este campo es mandatorio',
        invalid_type_error: 'El valor ingresado no es un string'
    }),
    duration: z.number(),
    poster: z.string().url().endsWith('.jpg'),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'War']),
    ),
    rate: z.number().min(0).max(10).default(5)
})

function validate(input) {
    return movieValidation.safeParse(input)
}

function validatePartial(input) {
    return movieValidation.partial().safeParse(input)
}
module.exports = {
    validate,
    validatePartial
}