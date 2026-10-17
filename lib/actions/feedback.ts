"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "./rateLimit";
import { Feedback } from "../models";
import { invalidateSupabaseCache } from "./cache";

export async function createFeedback(info: Feedback) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("feedback")
            .insert([
                {
                    ...info,
                },
            ])
            .select("*");

        if (error) {
            console.error("Error creating feedback:", error);
            return null;
        }
        invalidateSupabaseCache();
        return true;
    } catch (err) {
        console.error(err);
        return null;
    }
}
