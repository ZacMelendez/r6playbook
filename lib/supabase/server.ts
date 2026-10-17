import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../models";

export const createFetch =
    (
        tags: string[] = ["supabase"],
        revalidate = 3600,
        options?: Pick<RequestInit, "cache">
    ) =>
    (url: RequestInfo | URL, init?: RequestInit) => {
        return fetch(url, {
            ...init,
            next: {
                ...(options as any)?.next,
                tags,
                revalidate,
            },
            ...options,
        });
    };

export async function createClient(tags?: string[], revalidate?: number) {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: createFetch(tags, revalidate),
            },
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
