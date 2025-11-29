import { User } from "../entities/User";

export interface IUserRepository {
    findByAuthUUID(authUUID: string): Promise<User | null>;
}