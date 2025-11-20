import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { supabase, supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { Logger } from "../../shared/utils/logger";

export class UserRepository implements IUserRepository {

    /**
     * Find user by Supabase Auth UUID (using new profiles table schema)
     */
    async findByAuthUUID(authUUID: string): Promise<User | null> {
        try {
            Logger.debug("🔍 Finding user by auth UUID", { authUUID });

            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, first_name, last_name, role')
                .eq('id', authUUID)
                .maybeSingle();  // ✅ Use maybeSingle() instead of single()

            if (error) {
                Logger.warn("⚠️ User profile not found", { authUUID, error: error.message });
                return null;
            }

            if (!data) {
                Logger.debug("📭 No profile found", { authUUID });
                return null;
            }

            Logger.debug("✅ User profile found", { authUUID, userId: data.id });

            // Convert to domain entity
            return User.fromDataBase({
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role
            });
        } catch (error) {
            Logger.error("❌ Error finding user by auth UUID", { authUUID, error });
            throw new DatabaseError(error as any);
        }
    }


    async createUser(user: User,password: string): Promise<User> {
        Logger.debug("📝 Creating new user", { email: user.getEmail() });

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: user.getEmail(),
            password: password,
            email_confirm: true,
            user_metadata: {
                first_name: user.getFirstName(),
                last_name: user.getLastName(),
                role: user.getRole()
            }
        });

        if (error) {
            Logger.error("❌ Error creating auth user", { email: user.getEmail(), error: error.message });
            throw new DatabaseError(error as any);
        }

        const userId = data.user?.id;

        if (!userId) {
            Logger.error("❌ User ID not returned after creation", { email: user.getEmail() });
            throw new DatabaseError("User ID not returned after creation");
        }

        Logger.debug("✅ User created in auth table", { email: user.getEmail(), userId });

        // Validate role before inserting
        const userRole = user.getRole();
        const validRoles = ["admin", "doctor", "receptionist"] as const;

        if (!validRoles.includes(userRole as any)) {
            throw new Error(`Invalid role: ${userRole}. Must be one of: ${validRoles.join(", ")}`);
        }

        const role = userRole as typeof validRoles[number];

        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: userId,
                email: user.getEmail(),
                first_name: user.getFirstName(),
                last_name: user.getLastName(),
                role  // ✅ Now properly typed
            });

        if (profileError) {
            Logger.error("❌ Error creating user profile", { email: user.getEmail(), error: profileError });
            throw new DatabaseError(profileError as any);
        }

        Logger.debug("✅ User profile created successfully", { email: user.getEmail(), userId });

        return new User(
            userId,
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            role  // ✅ Use validated role
        );
    }


}


