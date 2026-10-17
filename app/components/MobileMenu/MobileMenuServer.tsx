"use server";
import * as React from "react";
import { HydrationBoundary } from "jotai-ssr";
import { userAtom, userDetailsAtom } from "@/lib/atoms/user";
import MobileMenu from ".";
import { getLayoutSession } from "@/lib/actions/auth-layout";

export async function MobileMenuServer() {
    const { user, userDetails } = await getLayoutSession(true);

    return (
        <React.Suspense fallback={null}>
            <HydrationBoundary
                hydrateAtoms={[
                    [userAtom, Promise.resolve(user)],
                    [userDetailsAtom, userDetails],
                ]}
            >
                <MobileMenu />
            </HydrationBoundary>
        </React.Suspense>
    );
}
