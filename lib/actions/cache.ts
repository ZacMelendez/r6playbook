"use server";

import { revalidateTag } from "next/cache";
import { siteCacheTag, strategyCacheTag } from "@/lib/cache-tags";

export async function invalidateSupabaseCache() {
    return revalidateTag("supabase");
}

export async function invalidateCache(tag: string) {
    return revalidateTag(tag);
}

export async function invalidateSiteCache(map: string, site: string) {
    revalidateTag(siteCacheTag(map, site));
    revalidateTag("supabase");
}

export async function invalidateStrategyCache(id: string) {
    revalidateTag(strategyCacheTag(id));
    revalidateTag("supabase");
}
