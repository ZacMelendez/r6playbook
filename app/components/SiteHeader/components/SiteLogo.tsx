"use client";

import { R6PB } from "@/lib/icons/R6PB";
import { useTransitionRouter } from "next-view-transitions";

export const SiteLogo = () => {
    const router = useTransitionRouter();
    return (
        <div className="flex items-center gap-2 absolute left-4 sm:left-16">
            <R6PB className="size-8" />
            <h2
                className="font-bold cursor-pointer"
                onClick={() => {
                    router.push("/");
                }}
            >
                Rainbow 6 Playbook
            </h2>
        </div>
    );
};
