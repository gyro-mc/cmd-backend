export class User {
    private id: string;
    private email: string;
    private firstName: string;
    private lastName: string;
    private role: "admin" | "doctor" | "receptionist";
    constructor(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: string,  // ✅ Accept string
    ) {
        // Validate role at construction time
        const validRoles = ["admin", "doctor", "receptionist"] as const;

        if (!validRoles.includes(role as any)) {
            throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(", ")}`);
        }
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role as typeof validRoles[number];
    }

    // Getters
    getId(): string { return this.id; }
    getEmail(): string { return this.email; }
    getFirstName(): string { return this.firstName; }
    getLastName(): string { return this.lastName; }
    getRole(): "admin" | "doctor" | "receptionist" { return this.role; }
    static fromDataBase(data: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    }) {
        return new User(
            data.id,
            data.email,
            data.first_name,
            data.last_name,
            data.role  // Validation happens in constructor
        );
    }
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role
        };
    }
}