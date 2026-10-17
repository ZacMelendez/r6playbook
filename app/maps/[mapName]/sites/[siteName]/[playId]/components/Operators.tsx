"use client";

import { strategyAtom } from "@/lib/atoms/strategies";
import { operators } from "@/lib/constants";

import { useAtomValue } from "jotai";

export const Operators = () => {
    const strategy = useAtomValue(strategyAtom);

    return (
        <div className="flex flex-row gap-4 pb-2">
            {strategy.operators.map((operator, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="rounded-lg flex items-center size-12">
                        {
                            operators[
                                strategy.side === "defense"
                                    ? "defenders"
                                    : "attackers"
                            ].find((op) => op.name === operator)?.icon
                        }
                    </div>
                    <p className="text-sm font-semibold">{operator}</p>
                </div>
            ))}
        </div>
    );
};
