import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { signInAndRedirect } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import { Dispatch, SetStateAction } from "react";

export const SignInDialog = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const supabase = createClient();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                        You must be signed in to complete this action
                    </DialogDescription>
                </DialogHeader>
                <p>Sign in to vote and favorite strategies</p>
                <Button
                    className="w-full"
                    onClick={async () => {
                        await signInAndRedirect(supabase);
                    }}
                >
                    Sign In
                </Button>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"secondary"} type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
