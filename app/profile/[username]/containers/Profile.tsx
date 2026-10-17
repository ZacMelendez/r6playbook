"use client";
import { StrategyFilter } from "@/components/strategy-filter";
import { StrategyList } from "./StrategyList";
import { Separator } from "@/components/ui/separator";
import { userStrategiesAtom } from "@/lib/atoms/strategies";
import { useAtomValue } from "jotai";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { userDetailsAtom } from "@/lib/atoms/user";
import { Operators } from "../components/Operators";
import { RainbowTrackerButton } from "@/components/tracker-button";

export default function UserProfile() {
    const userDetails = useAtomValue(userDetailsAtom);

    return (
        <div className="container mx-auto px-8 space-y-8 py-8">
            <div className="space-y-6">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-row items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage
                                src={userDetails?.avatar_url || ""}
                                alt="User Icon"
                            />
                            <AvatarFallback>
                                <User className="size-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                            <h2 className="text-xl font-semibold">
                                {userDetails?.username}
                            </h2>
                            {userDetails?.ubisoft_profile && (
                                <RainbowTrackerButton />
                            )}
                        </div>
                    </div>
                </div>
                <Operators atom={userDetailsAtom} />
                <Separator />
                <StrategyFilter />
                <StrategyList atom={userStrategiesAtom} />
            </div>
        </div>
    );
}
