import { User } from "../entities/User";

export interface IUserRepository {
    findByAuthUUID(authUUID: string): Promise<User | null>;
    createUser(user: User, password: string): Promise<User>;  // ✅ Add password parameter
}