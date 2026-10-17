"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAtom, userAtom } from "@/lib/atoms/user";
import { operators } from "@/lib/constants";
import { UserDetails } from "@/lib/models";

import { PrimitiveAtom, useAtomValue } from "jotai";

export const Operators = ({ atom }: { atom?: PrimitiveAtom<any> }) => {
    const user = useAtomValue(atom || userAtom);

    const user_operators =
        (user as UserDetails)?.favorite_operators ||
        (user as UserAtom)?.details?.favorite_operators;

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-row gap-4 pb-2 flex-wrap">
                {user_operators
                    ?.sort((a, b) => a.localeCompare(b))
                    .map((operator, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center">
                                    <div className="rounded-lg flex items-center size-12">
                                        {
                                            [
                                                ...operators.defenders,
                                                ...operators.attackers,
                                            ]?.find(
                                                (op) => op.name === operator
                                            )?.icon
                                        }
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                {operator}
                            </TooltipContent>
                        </Tooltip>
                    ))}
            </div>
        </TooltipProvider>
    );
};
