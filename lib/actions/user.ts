"use server";

import { UserAtom } from "../atoms/user";
import { createClient } from "../supabase/server";
import { checkRateLimit } from "./rateLimit";
import { User } from "@supabase/supabase-js";
import { UpdateUserDetailsInput } from "../models";
import { invalidateCache } from "./cache";

export async function getUser(): Promise<UserAtom | null | undefined> {
    try {
        const supabase = await createClient();
        const result = (await supabase.auth.getUser())?.data?.user;

        if (result?.id) {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", result.id)
                .single();

            if (error || !data) {
                console.error("Error fetching user:", error);
                return result;
            }

            return {
                ...result,
                details: data,
            };
        }

        return result;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getUserById(
    jwt: string
): Promise<UserAtom | null | undefined> {
    try {
        const supabase = await createClient();
        const result = (await supabase.auth.getUser(jwt))?.data?.user;

        if (result?.id) {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", result.id)
                .single();

            if (error || !data) {
                console.error("Error fetching user:", error);
                return result;
            }

            return {
                ...result,
                details: data,
            };
        }

        return result;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getUserSession(): Promise<User | null | undefined> {
    try {
        const supabase = await createClient();
        const result = (await supabase.auth.getSession())?.data?.session?.user;

        return result;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getUserDetails(userId: string) {
    try {
        const supabase = await createClient([`${userId}`], 86000);

        const { data, error } = await supabase
            .from("users")
            .select(`*`)
            .eq("id", userId)
            .single();

        if (error || !data) {
            console.error("Error fetching user:", error);
            return null;
        }

        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getUserDetailsByUsername(username: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("users")
            .select(`*`)
            .eq("username", username)
            .single();

        if (error || !data) {
            console.error("Error fetching user:", error);
            return null;
        }

        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function updateUser(
    input: UpdateUserDetailsInput,
    userId: string
) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("users")
            .update(input)
            .eq("id", userId)
            .select()
            .single();

        if (error || !data) {
            console.error("Error updating user:", error);
            return { data: null, error };
        }

        invalidateCache(`${userId}`);
        return { data, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: e };
    }
}

export async function updateUsername(userName: string) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }

    try {
        const supabase = await createClient();
        const user = await supabase.auth.getUser();

        if (!user.data.user || !user.data.user.id) {
            console.error("No authenticated user found");
            return { data: null, error: new Error("Not authenticated") };
        }

        const { data, error } = await supabase
            .from("users")
            .update({
                username: userName,
                changed_username: true,
            })
            .eq("id", user.data.user.id)
            .select();

        if (error || !data) {
            console.error("Error updating user:", error);
            return { data: null, error };
        }

        invalidateCache(`${user.data.user.id}`);
        return { data, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: e };
    }
}
