"use client";

import { StrategyCard } from "@/components/strategy-card";
import { getInfiniteSrategies, SiteStrategy } from "@/lib/actions/strategies";
import filterAtom from "@/lib/atoms/filter";
import { strategiesAtom } from "@/lib/atoms/strategies";
import { formatMapName, formatSiteName } from "@/lib/string";
import { useAtom, useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useTransitionRouter } from "next-view-transitions";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

type ExploreFilter = {
    map?: string;
    site?: string;
    operators?: string[];
};

function matchesFilter(setup: SiteStrategy, filter: ExploreFilter | null) {
    if (!filter?.map && !filter?.site && filter?.operators?.length === 0) {
        return true;
    }
    return (
        (!filter?.map || setup.map === filter.map) &&
        (!filter?.site || setup.site === filter.site) &&
        (filter?.operators?.length === 0 ||
            setup.operators.some((operator) =>
                filter?.operators?.includes(operator)
            ))
    );
}

export default function InfiniteScrollList() {
    const [strategies, setStrategies] = useAtom(strategiesAtom);
    const filter = useAtomValue(filterAtom);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const fetchedPages = useRef(new Set<number>());
    const router = useTransitionRouter();

    const observer = useRef<IntersectionObserver | null>(null);

    const filteredStrategies = useMemo(
        () => strategies.filter((setup) => matchesFilter(setup, filter)),
        [strategies, filter]
    );

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

    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const fetchItems = async () => {
        if (fetchedPages.current.has(page)) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getInfiniteSrategies(page);

            if (!data) {
                setError("Failed to fetch items");
                return;
            }

            setStrategies((prevItems) => [...prevItems, ...data]);
            setHasMore(data.length === 10);
            fetchedPages.current.add(page);
        } catch (fetchError) {
            setError("Failed to fetch items");
            console.error("Error fetching items:", fetchError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 0) return;
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const lastIndex = filteredStrategies.length - 1;

    return (
        <AnimatePresence>
            <div className="space-y-4">
                {filteredStrategies.map((strategy, index) => (
                    <StrategyCard
                        key={strategy.id}
                        index={index}
                        onClick={onClick}
                        strategy={strategy}
                        cardRef={
                            index === lastIndex ? lastItemRef : undefined
                        }
                        animate={false}
                    />
                ))}
                {filteredStrategies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-lg"
                    >
                        No items found, try chaging your filter settings
                    </motion.div>
                )}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-lg"
                    >
                        Loading...
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-red-500 text-lg"
                    >
                        {error}
                    </motion.div>
                )}
                {!hasMore && filteredStrategies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-lg"
                    >
                        No more items to load
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
}
