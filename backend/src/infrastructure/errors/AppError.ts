export class AppError extends Error {
    public context?: any;
    
    constructor(message: string, context?: any) {
        super(message);
        this.context = context;
        
        // Maintain proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, AppError.prototype);
    }
}