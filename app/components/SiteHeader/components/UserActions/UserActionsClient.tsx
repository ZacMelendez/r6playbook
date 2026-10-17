"use client";

import { Button, LinkButton } from "@/components/ui/button";
import { signInAndRedirect } from "@/lib/supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { Plus, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms/user";
import { useTransitionRouter } from "next-view-transitions";
import { invalidateCache, invalidateSupabaseCache } from "@/lib/actions/cache";

export const UserActionsClient = () => {
    const supabase = createClient();
    const [user, setUser] = useAtom(userAtom);
    const router = useTransitionRouter();

    return (
        <div className="hidden sm:flex flex-row gap-3 items-center w-fit absolute right-16">
            <React.Suspense fallback={null}>
                {!user ? (
                    <div>
                        <Button
                            aria-label="sign in button"
                            onClick={async () => {
                                await signInAndRedirect(supabase);
                            }}
                        >
                            Sign In
                        </Button>
                    </div>
                ) : (
                    <div>
                        <LinkButton
                            aria-label="create a play button"
                            href="/create"
                        >
                            <Plus className="block size-12 sm:hidden" />
                            <div className="hidden sm:block">Create a Play</div>
                        </LinkButton>
                    </div>
                )}

                {user === undefined ? null : user === null ? null : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div aria-label="profile action menu trigger">
                                <Avatar className="cursor-pointer">
                                    <AvatarImage
                                        src={user?.user_metadata?.avatar_url}
                                        alt="User Icon"
                                    />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                aria-label="profile link"
                                onClick={() => {
                                    router.push("/settings");
                                }}
                            >
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                aria-label="sign out button"
                                onClick={() => {
                                    supabase.auth.signOut();
                                    setUser(async () => null);
                                }}
                            >
                                Sign Out
                            </DropdownMenuItem>
                            {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        aria-label="invalidate cache button"
                                        onClick={async () => {
                                            await invalidateSupabaseCache();
                                        }}
                                    >
                                        Reset Cache
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        aria-label="invalidate cache button"
                                        onClick={async () => {
                                            await invalidateCache(`${user.id}`);
                                        }}
                                    >
                                        Reset Cache
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </React.Suspense>
        </div>
    );
};
