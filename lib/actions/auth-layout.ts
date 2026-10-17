"use server";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { UserDetails } from "@/lib/models";
import { getUserDetails } from "./user";

export type LayoutSession = {
    user: User | null;
    userDetails: UserDetails | null;
};

export async function getLayoutSession(
    includeDetails = false
): Promise<LayoutSession> {
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;

        if (!user?.id || !includeDetails) {
            return { user, userDetails: null };
        }

        const userDetails = (await getUserDetails(user.id)) ?? null;
        return { user, userDetails };
    } catch {
        return { user: null, userDetails: null };
    }
}
