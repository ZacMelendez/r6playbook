"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

type RateLimitResponse = Awaited<ReturnType<typeof Ratelimit.prototype.limit>>;

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export const checkRateLimit = async (): Promise<{
    success: boolean;
    reason?: RateLimitResponse["reason"];
}> => {
    const headerStore = await headers();
    const ipAddr = headerStore.get("x-forwarded-for");
    if (!ipAddr) return { success: false };
    const { success, reason } = await ratelimit.limit(ipAddr);
    return { success, reason };
};
