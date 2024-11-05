import { ValidationError } from "class-validator";

type ErrorResponse = {
    errorMessage: string,
    validationErrors: Record<string, string[]> | null
};

export default class ErrorResponseMaker {
    static fromStr(str: string): ErrorResponse {
        return {
            errorMessage: str,
            validationErrors: null
        };
    }

    static fromValidationErrors(errors: ValidationError[]): ErrorResponse {
        const response = {
            errorMessage: 'Validation failed',
            validationErrors: {} as Record<string, string[]>
        };

        for (let i = 0; i < errors.length; i++) {
            const property: string = errors[i].property;

            if (!response.validationErrors.hasOwnProperty(property)) {
                response.validationErrors[property] = [];
            }

            const constraints = errors[i].constraints || {};

            for (const constraintName in constraints) {
                response.validationErrors[property].push(constraints[constraintName]);
            }
        }

        return response;
    };
}
