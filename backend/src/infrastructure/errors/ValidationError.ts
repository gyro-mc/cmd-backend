import { AppError } from "./AppError";

export interface ValidationErrorDetail {
    field: string;           // ← Changed from "path"
    type: string;
    message: string;
    received?: string;       // ← Added optional received value
}

export class ValidationError extends AppError {
    public readonly details?: ValidationErrorDetail[];

    constructor(
        message: string = "Validation error occurred",
        details: ValidationErrorDetail[] = [],
    ) {
        super(message, {
            userMessage: "There was a validation error. Please check your input and try again.",
            statusCode: 400,
        });
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.details = details;
    }

    getTitle(): string {
        return "Validation Error";
    }
}