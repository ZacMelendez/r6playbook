"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signInAndRedirect } from "@/lib/supabase/auth";

export const MustBeSignedIn = () => {
    const supabase = createClient();
    return (
        <div className="container mx-auto p-4 pt-12 flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold mb-6">
                You must be signed in to use this page
            </h1>
            <Button
                onClick={async () => {
                    await signInAndRedirect(supabase);
                }}
            >
                Sign In
            </Button>
        </div>
    );
};
