"use client";
import { ResponsiveFilter } from "@/components/strategy-filter";
import { StrategyList } from "./StrategyList";
import { Separator } from "@/components/ui/separator";
import { UserForm } from "../components/UserForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { draftsAtom, userStrategiesAtom } from "@/lib/atoms/strategies";
import { useAtomValue, useSetAtom } from "jotai";
import filterAtom from "@/lib/atoms/filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { userDetailsAtom } from "@/lib/atoms/user";
import { Operators } from "../components/Operators";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { RainbowTrackerButton } from "@/components/tracker-button";

export default function UserProfile() {
    const setFilters = useSetAtom(filterAtom);
    const user = useAtomValue(userDetailsAtom);

    const drafts = useAtomValue(draftsAtom);
    const params = useSearchParams();

    return (
        <div className="container mx-auto px-8 space-y-8 py-8">
            <h1 className="text-3xl font-bold">User Profile</h1>
            <div className="space-y-6 relative">
                <div className="flex flex-row justify-between items-start relative">
                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <Avatar className="w-20 h-20">
                                <AvatarImage
                                    src={user?.avatar_url || ""}
                                    alt="User Icon"
                                />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                {user?.username && (
                                    <h2 className="text-xl font-semibold">
                                        {user.username}
                                    </h2>
                                )}
                                {user?.email && (
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {user?.ubisoft_profile && <RainbowTrackerButton />}
                    </div>
                    <UserForm />
                </div>
                <Operators />
                <Separator />
                <div>
                    <Tabs
                        defaultValue={
                            params.get("drafts") === "1"
                                ? "my_drafts"
                                : "favorites"
                        }
                        className="w-full"
                        onValueChange={() => {
                            setFilters({
                                map: "",
                                operators: [],
                                site: "",
                            });
                        }}
                    >
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-fit">
                            <TabsTrigger value="favorites">
                                <h2 className="text-lg font-semibold">
                                    Favorites
                                </h2>
                            </TabsTrigger>
                            <TabsTrigger value="my_posts">
                                <h2 className="text-lg font-semibold">
                                    My Posts
                                </h2>
                            </TabsTrigger>
                            <TabsTrigger
                                value="my_drafts"
                                className="hidden sm:block"
                            >
                                <h2 className="text-lg font-semibold">
                                    My Drafts
                                </h2>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="favorites">
                            <ResponsiveFilter />
                            <StrategyList />
                        </TabsContent>
                        <TabsContent value="my_posts">
                            <ResponsiveFilter />
                            <StrategyList atom={userStrategiesAtom} />
                        </TabsContent>
                        <TabsContent value="my_drafts">
                            {drafts.length > 0 ? (
                                <>
                                    <ResponsiveFilter />
                                    <StrategyList atom={draftsAtom} drafts />
                                </>
                            ) : (
                                <div className="mx-auto pt-4 flex flex-col gap-4">
                                    <p className="text-center text-lg">
                                        You have no drafts yet
                                    </p>
                                    <LinkButton
                                        href="/create"
                                        className="w-fit mx-auto"
                                    >
                                        Create a play
                                    </LinkButton>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
