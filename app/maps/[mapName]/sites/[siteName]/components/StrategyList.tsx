"use client";

import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { strategiesAtom } from "@/lib/atoms/strategies";
import { useTransitionRouter } from "next-view-transitions";
import { formatMapName, formatSiteName } from "@/lib/string";
import { SiteStrategy } from "@/lib/actions/strategies";
import { StrategyCard } from "@/components/strategy-card";

export function StrategyList() {
    const strategies = useAtomValue(strategiesAtom);
    const router = useTransitionRouter();

    const onClick = useCallback(
        (strategy: SiteStrategy) => {
            router.push(
                `/maps/${formatMapName(strategy.map)}/sites/${formatSiteName(
                    strategy.site
                )}/${strategy.id}`
            );
        },
        [router]
    );

    return (
        <div className="space-y-4">
            {strategies.map((setup, index) => {
                return (
                    <StrategyCard
                        strategy={setup}
                        index={index}
                        key={setup.id}
                        onClick={onClick}
                    />
                );
            })}
        </div>
    );
}
