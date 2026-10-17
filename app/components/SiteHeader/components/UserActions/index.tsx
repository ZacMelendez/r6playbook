"use server";

import * as React from "react";
import { UserActionsClient } from "./UserActionsClient";
import { HydrationBoundary } from "jotai-ssr";
import { userAtom } from "@/lib/atoms/user";
import UserActionsLoading from "./loading";
import { getLayoutSession } from "@/lib/actions/auth-layout";

export const UserActions = async () => {
    const { user } = await getLayoutSession();

    return (
        <HydrationBoundary hydrateAtoms={[[userAtom, Promise.resolve(user)]]}>
            <React.Suspense fallback={<UserActionsLoading />}>
                <UserActionsClient />
            </React.Suspense>
        </HydrationBoundary>
    );
};
