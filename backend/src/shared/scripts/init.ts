import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ✅ Validate env vars exist
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
    process.exit(1);
}

// ✅ Create admin client with service role
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createAdmin() {
    try {
        console.log("📝 Creating admin user...");

        // ✅ Create user in Supabase Auth
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: "admin@admin.com",
            password: "admin",
            email_confirm: true,
            user_metadata: {
                first_name: "admin",
                last_name: "Admin",
                role: "admin"  // ✅ Use user_metadata not app_metadata
            }
        });

        if (error) {
            console.error("❌ Error creating admin user:", error.message);
            process.exit(1);
        }

        if (!data.user) {
            console.error("❌ No user returned");
            process.exit(1);
        }

        console.log("✅ Admin user created successfully in auth table");
        console.log({
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role
        });


        const { data: profileData, error: dbError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: data.user.id,
                email: data.user.email,
                first_name: data.user.user_metadata?.first_name || 'admin',
                last_name: data.user.user_metadata?.last_name || 'Admin',
                role: 'admin'
            });
        if (dbError) {
            console.error("❌ Error creating admin profile:", dbError.message);
            process.exit(1);
        }

        console.log("✅ Admin profile created successfully in profiles table");
        console.log(profileData);


    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }

}

// ✅ Run script
createAdmin();
