"use server";

import { createClient } from "@/lib/supabase/server";
import { Vote } from "../models";
import { UserAtom } from "../atoms/user";
import { checkRateLimit } from "./rateLimit";
import { invalidateSupabaseCache } from "./cache";

export async function addVote(
    strategyId: string,
    user: UserAtom,
    vote?: Vote | null,
    voteType?: boolean | null
) {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }
    try {
        let data = null;
        const supabase = await createClient();
        const incrementValue =
            (vote?.vote_type === -1 && voteType === true) ||
            (vote?.vote_type === 1 && voteType === false)
                ? 2
                : 1;

        if (vote) {
            const { data: updateData, error: updateError } = await supabase
                .from("votes")
                .update({
                    vote_type:
                        voteType === true ? 1 : voteType === false ? -1 : 0,
                })
                .eq("id", vote.id)
                .select()
                .single();

            data = updateData;

            if (updateError) {
                console.error("Error updating vote:", updateError);
                return null;
            }
        } else {
            const { data: insertData, error: insertError } = await supabase
                .from("votes")
                .insert([
                    {
                        strategy_id: strategyId,
                        vote_type:
                            voteType === true ? 1 : voteType === false ? -1 : 0,
                        user_id: user.id,
                    },
                ])
                .select()
                .single();

            data = insertData;

            if (insertError) {
                console.error("Error adding new vote:", insertError);
                return null;
            }
        }

        const rpcFunction =
            voteType === true || (voteType === null && vote?.vote_type === -1)
                ? "addvote"
                : voteType === false ||
                  (voteType === null && vote?.vote_type === 1)
                ? "removevote"
                : null;
        if (rpcFunction) {
            const { error: strategyError } = await supabase.rpc(rpcFunction, {
                x: incrementValue,
                row_id: strategyId,
            });

            if (strategyError) {
                console.error(
                    `Error updating strategy votes with ${rpcFunction}:`,
                    strategyError
                );
                return null;
            }
        }
        invalidateSupabaseCache();
        return data;
    } catch (err) {
        console.error("Error in addVote function:", err);
        return null;
    }
}

export async function getUserVotes(userId: string): Promise<Vote[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("votes")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching user votes:", error);
            return [];
        }
        return data;
    } catch (err) {
        console.error("Error in getUserVotes function:", err);
        return [];
    }
}

export async function getUserVotesForStrategies(
    userId: string,
    strategyIds: string[]
): Promise<Vote[]> {
    if (!strategyIds.length) return [];

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("votes")
            .select("*")
            .eq("user_id", userId)
            .in("strategy_id", strategyIds);

        if (error) {
            console.error("Error fetching user votes:", error);
            return [];
        }
        return data;
    } catch (err) {
        console.error("Error in getUserVotesForStrategies function:", err);
        return [];
    }
}
