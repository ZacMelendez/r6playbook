"use client";

import { memo } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown, Castle, Swords } from "lucide-react";
import { SingleStrategy, SiteStrategy } from "@/lib/actions/strategies";
import { OperatorBadge } from "./operator-badge";

type StrategyCardProps = {
    strategy: SingleStrategy | SiteStrategy;
    index: number;
    onClick?:
        | ((strategy: SiteStrategy) => void)
        | ((strategy: SingleStrategy) => void);
    cardRef?: (node: HTMLDivElement | null) => void;
    animate?: boolean;
};

function StrategyCardComponent({
    strategy,
    index,
    onClick,
    cardRef,
    animate = true,
}: StrategyCardProps) {
    const content = (
        <Card
            className="hover:bg-black/10 cursor-pointer transition-all"
            onClick={
                onClick
                    ? () => {
                          onClick(strategy as SiteStrategy & SingleStrategy);
                      }
                    : undefined
            }
        >
            <CardHeader className="flex flex-col gap-3">
                <CardTitle className="flex flex-row gap-3 items-center">
                    <div className="flex flex-row gap-2 items-center border rounded-sm px-2 py-1">
                        {strategy.votes! >= 0 ? (
                            <ThumbsUp className="size-5" />
                        ) : (
                            <ThumbsDown className="size-5" />
                        )}
                        <span className="text-lg font-bold">
                            {strategy.votes}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        {strategy.title}
                        <p className="text-muted-foreground pt-2">
                            {strategy.user?.["username"]}
                        </p>
                    </div>
                    <div className="flex flex-row gap-3 ml-auto">
                        <div className="border rounded-md px-4 py-2 flex flex-row gap-2 items-center">
                            {strategy.side === "defense" ? (
                                <>
                                    <Castle className="size-4" />
                                    Defense
                                </>
                            ) : (
                                <>
                                    <Swords className="size-4" />
                                    Attack
                                </>
                            )}
                        </div>
                    </div>
                </CardTitle>
                <CardDescription className="flex flex-col">
                    <p className="text-base text-card-foreground font-semibold">
                        {strategy.map}
                    </p>
                    <p className="text-sm text-muted-foreground font-semibold">
                        {strategy.site}
                    </p>
                </CardDescription>
                {strategy?.operators?.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-2">
                        {strategy.operators.map((operator, opIndex) => (
                            <OperatorBadge
                                key={opIndex}
                                operator={operator}
                                index={opIndex}
                                side={
                                    strategy.side === "defense"
                                        ? "defenders"
                                        : "attackers"
                                }
                            />
                        ))}
                    </div>
                )}
            </CardHeader>
        </Card>
    );

    if (!animate) {
        return <div ref={cardRef}>{content}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.25,
                delay: index * 0.035,
            }}
            ref={cardRef}
        >
            {content}
        </motion.div>
    );
}

export const StrategyCard = memo(StrategyCardComponent);
