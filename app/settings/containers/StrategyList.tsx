"use client";

import { AnimatePresence } from "motion/react";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { activeDraftAtom, strategiesAtom } from "@/lib/atoms/strategies";
import { formatMapName, formatSiteName } from "@/lib/string";
import filterAtom from "@/lib/atoms/filter";
import { useTransitionRouter } from "next-view-transitions";
import { SingleStrategy, SiteStrategy } from "@/lib/actions/strategies";
import { useCallback, useMemo } from "react";
import { StrategyCard } from "@/components/strategy-card";

function matchesFilter(
    setup: SiteStrategy | SingleStrategy,
    filter: ReturnType<typeof useAtomValue<typeof filterAtom>>
) {
    if (!filter?.map && !filter?.site && filter?.operators?.length === 0) {
        return true;
    }
    return (
        (!filter.map || setup.map === filter.map) &&
        (!filter.site || setup.site === filter.site) &&
        (filter.operators?.length === 0 ||
            setup.operators.some((operator) =>
                filter.operators?.includes(operator)
            ))
    );
}

export function StrategyList({
    atom,
    drafts = false,
}: {
    atom?: PrimitiveAtom<SiteStrategy[]> | PrimitiveAtom<SingleStrategy[]>;
    drafts?: boolean;
}) {
    const strategies = useAtomValue(atom || strategiesAtom);
    const filter = useAtomValue(filterAtom);
    const setDraft = useSetAtom(activeDraftAtom);
    const router = useTransitionRouter();

    const filteredStrategies = useMemo(
        () => strategies.filter((setup) => matchesFilter(setup, filter)),
        [strategies, filter]
    );

    const onClick = useCallback(
        (strategy: SiteStrategy | SingleStrategy) => {
            if (drafts) {
                setDraft(strategy as SingleStrategy);
                router.push(`/create`);
            } else {
                router.push(
                    `/maps/${formatMapName(strategy.map)}/sites/${formatSiteName(
                        strategy.site
                    )}/${strategy.id}`
                );
            }
        },
        [drafts, router, setDraft]
    );

    return (
        <AnimatePresence>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredStrategies.map((setup, index) => (
                    <StrategyCard
                        strategy={setup}
                        index={index}
                        key={setup.id}
                        onClick={onClick}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
}
