export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage:   
                'Must be 5 to 32 chars'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        isString:{
            errorMessage: 'Username must be a string'
        }
    },
    displayName: {
        notEmpty: true
    }
};