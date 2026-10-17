"use client";

import { Button } from "@/components/ui/button";
import { signInAndRedirect } from "@/lib/supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { User } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom, userDetailsAtom } from "@/lib/atoms/user";
import { useTransitionRouter } from "next-view-transitions";
import { menuOpenAtom } from "..";

export const UserActions = () => {
    const supabase = createClient();
    const user = useAtomValue(userAtom);
    const userDetails = useAtomValue(userDetailsAtom);
    const setMenuOpen = useSetAtom(menuOpenAtom);
    const router = useTransitionRouter();

    return (
        <AnimatePresence>
            <div className="flex flex-col gap-3 items-center">
                <React.Suspense fallback={null}>
                    {!user ? (
                        <div>
                            <Button
                                variant={"outline"}
                                aria-label="sign in button"
                                className="font-bold"
                                onClick={async () => {
                                    await signInAndRedirect(supabase);
                                }}
                            >
                                Sign In
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="border cursor-pointer flex flex-row gap-4 items-center hover:bg-white/10 hover:text-primary-foreground py-3 px-5 rounded-lg"
                            aria-label="profile link"
                            onClick={() => {
                                router.push("/settings");
                                setMenuOpen(false);
                            }}
                        >
                            <Avatar className="size-16">
                                <AvatarImage
                                    src={user?.user_metadata?.avatar_url}
                                    alt="User Icon"
                                />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                            {userDetails?.username && (
                                <p className="text-xl font-bold">
                                    {userDetails?.username}
                                </p>
                            )}
                        </div>
                    )}
                </React.Suspense>
            </div>
        </AnimatePresence>
    );
};
