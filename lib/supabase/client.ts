"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";
import { TypedSupabaseClient } from "./typedClient";
import { Database } from "../models/database.types";

let client: TypedSupabaseClient | undefined;

export function createClient() {
    if (!client) {
        client = createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    return client;
}

function useSupabaseBrowser() {
    return useMemo(createClient, []);
}

export default useSupabaseBrowser;
