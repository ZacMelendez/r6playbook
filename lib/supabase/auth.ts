import { TypedSupabaseClient } from "./typedClient";

export const getURL = (origin?: boolean) => {
    let url =
        typeof window !== "undefined"
            ? window.location.href
            : process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
              process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
              "http://127.0.0.1:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.startsWith("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`;

    const fullUrl = new URL(url);

    if (origin) {
        return fullUrl.origin;
    }

    return url;
};

export async function signInAndRedirect(supabase: TypedSupabaseClient) {
    const currentUrl = new URL(getURL());

    return await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${
                currentUrl.origin
            }/auth/confirm?next=${encodeURIComponent(currentUrl.pathname)}`,
        },
    });
}
