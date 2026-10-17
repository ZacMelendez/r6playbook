"use client";

import { AnimatePresence } from "motion/react";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { strategiesAtom } from "@/lib/atoms/strategies";
import { formatMapName, formatSiteName } from "@/lib/string";
import filterAtom from "@/lib/atoms/filter";
import { useTransitionRouter } from "next-view-transitions";
import { SiteStrategy } from "@/lib/actions/strategies";
import { StrategyCard } from "@/components/strategy-card";

export function StrategyList({
    atom,
}: {
    atom?: PrimitiveAtom<SiteStrategy[]>;
}) {
    const setups = useAtomValue(atom || strategiesAtom);
    const filter = useAtomValue(filterAtom);
    const router = useTransitionRouter();

    const onClick = (strategy: SiteStrategy) => {
        router.push(
            `/maps/${formatMapName(strategy.map)}/sites/${formatSiteName(
                strategy.site
            )}/${strategy.id}`
        );
    };

    return (
        <AnimatePresence>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {setups
                    .filter((setup) => {
                        if (
                            !filter?.map &&
                            !filter?.site &&
                            filter?.operators?.length === 0
                        )
                            return true;
                        return (
                            (filter?.map === "" || setup.map === filter.map) &&
                            (filter.site === "" ||
                                setup.site === filter.site) &&
                            (filter?.operators?.length === 0 ||
                                setup.operators.some((operator) =>
                                    filter?.operators?.includes(operator)
                                ))
                        );
                    })
                    .map((setup, index) => {
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
        </AnimatePresence>
    );
}
