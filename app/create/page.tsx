import { PlayForm } from "./components/PlayForm";
import { MustBeSignedIn } from "./components/Authenticated";
import { getUserSession } from "@/lib/actions/user";
import { HydrationBoundary } from "jotai-ssr";
import { getUserDrafts, SingleStrategy } from "@/lib/actions/strategies";
import { draftsAtom } from "@/lib/atoms/strategies";

export const dynamic = "force-dynamic";

export default async function Index() {
    const user = await getUserSession();
    let drafts: SingleStrategy[] = [];

    if (!user) {
        return <MustBeSignedIn />;
    }

    if (user?.id) {
        try {
            drafts = (await getUserDrafts(user?.id)) || [];
        } catch {
            drafts = [];
        }
    }
    return (
        <HydrationBoundary hydrateAtoms={[[draftsAtom, drafts]]}>
            <div className="container mx-auto p-4 relative">
                <h1 className="text-3xl font-bold mb-6">Submit a New Play</h1>
                <PlayForm />
            </div>
        </HydrationBoundary>
    );
}
