import UserProfile from "./containers/Profile";
import { UserDetails } from "@/lib/models";
import { getUserDetailsByUsername } from "@/lib/actions/user";
import { HydrationBoundary } from "jotai-ssr";
import { userDetailsAtom } from "@/lib/atoms/user";
import { userStrategiesAtom } from "@/lib/atoms/strategies";
import {
    getStrategiesByUsername,
    SiteStrategy,
} from "@/lib/actions/strategies";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{
        username: string;
    }>;
};

export default async function Index({ params }: Props) {
    const pathParams = await params;
    let user: UserDetails | undefined | null = null;
    let userStrategies: SiteStrategy[] = [];

    const setUserStrategies = async () => {
        const userFavorites = await getStrategiesByUsername(
            decodeURIComponent(pathParams.username)
        );

        if (userFavorites) {
            userStrategies = userFavorites;
        }
    };

    try {
        user = await getUserDetailsByUsername(
            decodeURIComponent(pathParams.username)
        );

        if (!user || !user.id) {
            return notFound();
        }

        await Promise.all([setUserStrategies()]);
    } catch {
        return notFound();
    }

    return (
        <HydrationBoundary
            hydrateAtoms={[
                [userDetailsAtom, user],
                [userStrategiesAtom, userStrategies],
            ]}
        >
            <UserProfile />
        </HydrationBoundary>
    );
}
