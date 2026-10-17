"use server";

import { toTitleCaseEachWord } from "@/lib/string";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { checkRateLimit } from "./rateLimit";
import moment from "moment";
import { singleStrategySelect, multipleStrategiesSelect } from "../models";
import {
    invalidateSiteCache,
    invalidateStrategyCache,
    invalidateSupabaseCache,
} from "./cache";
import { siteCacheTag, strategyCacheTag } from "@/lib/cache-tags";

const PUBLIC_REVALIDATE = 300;

export async function createStrategy(info: SingleStrategy, user: User) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .insert([
                {
                    ...info,
                    user_id: user.id,
                },
            ])
            .select(singleStrategySelect);

        if (error) {
            console.error("Error creating strategy:", error);
            return null;
        }
        invalidateSupabaseCache();
        if (info.map && info.site) {
            await invalidateSiteCache(info.map, info.site);
        }
        if (data[0]?.id) {
            await invalidateStrategyCache(data[0].id);
        }
        return data[0];
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function updateStrategy(info: SingleStrategy, user: User) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .update({
                ...info,
                user_id: user.id,
                updated_at: moment().toISOString(),
            })
            .eq("id", info.id)
            .select(singleStrategySelect);

        if (error) {
            console.error("Error updating strategy:", error);
            return null;
        }
        invalidateSupabaseCache();
        if (info.map && info.site) {
            await invalidateSiteCache(info.map, info.site);
        }
        if (info.id) {
            await invalidateStrategyCache(info.id);
        }
        return data[0];
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function deleteStrategy(
    info: Pick<SiteStrategy | SingleStrategy, "id" | "user_id">,
    user: User
) {
    if (user.id !== info.user_id) return false;
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("strategies")
            .delete()
            .eq("id", info.id);

        if (error) {
            console.error("Error updating strategy:", error);
            return false;
        }
        invalidateSupabaseCache();
        await invalidateStrategyCache(info.id);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getMapStrategies({ map }: { map?: string }) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .eq("map", toTitleCaseEachWord(map || ""))
            .eq("is_draft", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
    }
}

export async function getSiteStrategies({
    map,
    site,
}: {
    map: string;
    site: string;
}) {
    try {
        const supabase = await createClient(
            [siteCacheTag(map, site), "supabase"],
            PUBLIC_REVALIDATE
        );

        const { data, error } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .eq("map", map)
            .eq("site", site)
            .eq("is_draft", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}

export type SiteStrategy = NonNullable<
    Awaited<ReturnType<typeof getSiteStrategies>>
>[0];

export type SingleStrategy = NonNullable<
    Awaited<ReturnType<typeof getStrategy>>
>;

export async function getStrategy(id: string) {
    try {
        const supabase = await createClient(
            [strategyCacheTag(id), "supabase"],
            PUBLIC_REVALIDATE
        );

        const { data, error } = await supabase
            .from("strategies")
            .select(singleStrategySelect)
            .eq("id", id)
            .eq("is_draft", false);

        if (error) {
            console.error("Error getting strategy:", error);
            return;
        }

        return data?.[0];
    } catch (err) {
        console.error(err);
        return;
    }
}

export async function getUserStrategies(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .eq("user_id", userId)
            .eq("is_draft", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting user strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}

export async function getUserDrafts(userId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .select(singleStrategySelect)
            .eq("user_id", userId)
            .eq("is_draft", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting user strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}

export async function getStrategiesByUsername(username: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .eq("users.username", username)
            .eq("is_draft", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting user strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}

export async function getInfiniteSrategies(page: number) {
    try {
        const supabase = await createClient(
            ["explore", "supabase"],
            PUBLIC_REVALIDATE
        );

        const { data, error } = await supabase
            .from("strategies")
            .select(multipleStrategiesSelect)
            .range(page * 10, (page + 1) * 10 - 1)
            .order("created_at", { ascending: false })
            .eq("is_draft", false);

        if (error) {
            console.error("Error getting strategies:", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}
