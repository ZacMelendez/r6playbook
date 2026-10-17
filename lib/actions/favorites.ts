"use server";

import { createClient } from "@/lib/supabase/server";
import { UserAtom } from "../atoms/user";
import { Favorite } from "../models";
import { checkRateLimit } from "./rateLimit";
import { multipleStrategiesSelect } from "@/lib/models";
import { invalidateSupabaseCache } from "./cache";
import { revalidateTag } from "next/cache";

export async function addFavorite(itemId: string, user: UserAtom) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();

        const { data, error: insertError } = await supabase
            .from("favorites")
            .insert([
                {
                    item_id: itemId,
                    user_id: user.id,
                },
            ])
            .select();

        if (insertError) {
            console.error("Error adding favorite:", insertError);
            return null;
        }

        revalidateTag("supabase");
        return data?.[0] || null;
    } catch (err) {
        console.error("Error in addFavorite function:", err);
        return null;
    }
}

export async function removeFavorite(itemId: string, user: UserAtom) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();

        const { error: deleteError } = await supabase
            .from("favorites")
            .delete()
            .eq("item_id", itemId)
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("Error removing favorite:", deleteError);
            return false;
        }

        invalidateSupabaseCache();
        return true;
    } catch (err) {
        console.error("Error in removeFavorite function:", err);
        return false;
    }
}

export async function getUserFavorites(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching user favorites:", error);
            return [];
        }

        return data;
    } catch (err) {
        console.error("Error in getUserFavorites function:", err);
        return [];
    }
}

export async function getUserFavoritesForStrategies(
    userId: string,
    strategyIds: string[]
) {
    if (!strategyIds.length) return [];

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", userId)
            .in("item_id", strategyIds);

        if (error) {
            console.error("Error fetching user favorites:", error);
            return [];
        }

        return data;
    } catch (err) {
        console.error("Error in getUserFavoritesForStrategies function:", err);
        return [];
    }
}

export async function getUserFavoriteStrategies(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching user favorites:", error);
            return null;
        }

        const strategyIds = data.map((favorite: Favorite) => favorite.item_id);

        const { data: strategies, error: strategyError } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .in("id", strategyIds);

        if (strategyError) {
            console.error("Error fetching user favorites:", strategyError);
            return null;
        }

        return { strategies, favorites: data };
    } catch (err) {
        console.error("Error in getUserFavorites function:", err);
        return null;
    }
}
