import { userDetailsAtom, userFavoritesAtom } from "@/lib/atoms/user";
import { getUserFavoriteStrategies } from "@/lib/actions/favorites";
import { Favorite, UserDetails } from "@/lib/models";
import { createClient } from "@/lib/supabase/server";
import { getUserDetails } from "@/lib/actions/user";
import UserProfile from "./containers/Profile";
import { HydrationBoundary } from "jotai-ssr";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import {
    getUserDrafts,
    getUserStrategies,
    SingleStrategy,
    SiteStrategy,
} from "@/lib/actions/strategies";
import {
    draftsAtom,
    strategiesAtom,
    userStrategiesAtom,
} from "@/lib/atoms/strategies";

export const dynamic = "force-dynamic";

export default async function Index() {
    const supabase = await createClient();

    let user: User | undefined | null = null;
    let userDetails: UserDetails | undefined | null = null;
    let favorites: Favorite[] = [];
    let strategies: SiteStrategy[] = [];
    let userStrategies: SiteStrategy[] = [];
    let drafts: SingleStrategy[] = [];

    const setUserFavorites = async (userId: string) => {
        const result = await getUserFavoriteStrategies(userId);

        if (result) {
            favorites = result.favorites;
            strategies = result.strategies;
        }
    };

    const setUserStrategies = async (userId: string) => {
        const userFavorites = await getUserStrategies(userId);

        if (userFavorites) {
            userStrategies = userFavorites;
        }
    };

    const setUserDrafts = async (userId: string) => {
        if (userId) {
            try {
                drafts = (await getUserDrafts(userId)) || [];
            } catch {
                drafts = [];
            }
        }
    };

    const setUserDetails = async (userId: string) => {
        if (userId) {
            try {
                userDetails = await getUserDetails(userId);
            } catch {
                userDetails = null;
            }
        }
    };

    try {
        user = (await supabase.auth.getUser())?.data?.user;

        if (!user || !user.id) {
            if (!user) return redirect("/");
        }

        await Promise.all([
            setUserFavorites(user.id),
            setUserStrategies(user.id),
            setUserDrafts(user.id),
            setUserDetails(user.id),
        ]);
    } catch {
        return redirect("/");
    }

    return (
        <HydrationBoundary
            hydrateAtoms={[
                [draftsAtom, drafts],
                [userDetailsAtom, userDetails],
                [userFavoritesAtom, favorites],
                [strategiesAtom, strategies],
                [userStrategiesAtom, userStrategies],
            ]}
        >
            <UserProfile />
        </HydrationBoundary>
    );
}
