"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import filterAtom from "@/lib/atoms/filter";
import { operators } from "@/lib/constants";
import { useSetAtom } from "jotai";

import { useTransitionRouter } from "next-view-transitions";

export const OperatorList = ({
    side,
    onClick,
}: {
    side: keyof typeof operators;
    onClick: (i: string) => void;
}) => {
    return (
        <div className="animate-fade-in w-full flex flex-row flex-wrap gap-x-2 gap-y-4 justify-around">
            {operators[side]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((i) => (
                    <Card
                        key={i.name}
                        className="w-[82px] sm:w-fit hover:scale-[1.05] cursor-pointer transition-all hover:bg-card/30"
                        onClick={() => onClick(i.name)}
                    >
                        <CardHeader className="font-bold text-xs sm:text-lg flex items-center justify-center py-2 px-1">
                            {i.name}
                        </CardHeader>
                        <CardContent className="p-0 m-0 relative">
                            <img
                                src={i.mainImage}
                                alt={i.name}
                                width={180}
                                height={320}
                                className="rounded-lg"
                            />
                            <div
                                className="absolute right-1/2 translate-x-1/2 bottom-5 bg-slate-800 rounded-lg border-2"
                                style={{
                                    borderColor: i.color,
                                }}
                            >
                                <div className="size-8 sm:size-16 p-1">
                                    {i.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
};

export const Operators = () => {
    const setFilters = useSetAtom(filterAtom);
    const router = useTransitionRouter();
    const handleClick = (operator: string) => {
        setFilters((prev) => ({
            ...prev,
            operators: [operator],
        }));
        router.push("/explore");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="attackers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-fit mb-4">
                    <TabsTrigger value="attackers">
                        <h2 className="text-lg font-semibold">Attackers</h2>
                    </TabsTrigger>
                    <TabsTrigger value="defenders">
                        <h2 className="text-lg font-semibold">Defenders</h2>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="attackers" className="mt-0">
                    <OperatorList side="attackers" onClick={handleClick} />
                </TabsContent>
                <TabsContent value="defenders" className="mt-0 ">
                    <OperatorList side="defenders" onClick={handleClick} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
