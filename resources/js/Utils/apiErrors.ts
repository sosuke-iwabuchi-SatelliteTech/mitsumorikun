export type ValidationErrors = Record<string, string>;

/**
 * Extracts and formats validation errors from a Laravel/Axios error object.
 */
export const handleApiError = (error: any): { errors?: ValidationErrors, message: string } => {
    if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const formattedErrors: ValidationErrors = {};
        
        Object.keys(errors).forEach(key => {
            formattedErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
        });
        
        return {
            errors: formattedErrors,
            message: error.response.data.message || '入力内容に誤りがあります。',
        };
    }

    return {
        message: error.response?.data?.message || '通信エラーが発生しました。',
    };
};
