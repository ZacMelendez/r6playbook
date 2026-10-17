import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteStrategy } from "@/lib/actions/strategies";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "@/lib/atoms/user";
import { resetStrategy, strategyAtom } from "@/lib/atoms/strategies";
import { useTransitionRouter } from "next-view-transitions";

export const DeletePlayDialog = ({
    onOpenChange,
}: {
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
    const [strategy, setStrategy] = useAtom(strategyAtom);
    const router = useTransitionRouter();
    const user = useAtomValue(userAtom)!;
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        setLoading(true);
        try {
            const result = await deleteStrategy(strategy, user);
            if (!result) {
                return;
            }
            onOpenChange(false);
            setStrategy(resetStrategy);
            router.back();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DialogContent className="min-w-[50vw] max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-1">
                <DialogTitle>Delete Play</DialogTitle>
            </DialogHeader>
            <div className="flex-1">
                <p>Are you sure you want to delete this play?</p>
            </div>
            <DialogFooter className="flex-1">
                <Button
                    loading={loading}
                    type="button"
                    dynamicLoader
                    onClick={onSubmit}
                    variant={"destructive"}
                >
                    Delete Play
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
