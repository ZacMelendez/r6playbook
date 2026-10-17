"use client";

import { createClient } from "./client";
import { useSetAtom } from "jotai";
import { userAtom } from "../atoms/user";
import { getUserById } from "../actions/user";

export const AuthListener = () => {
    const supabase = createClient();
    const setUser = useSetAtom(userAtom);

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN") {
            if (session?.access_token) {
                setUser(getUserById(session?.access_token));
            }
        }
    });

    return null;
};
