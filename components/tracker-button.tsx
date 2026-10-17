import { useAtomValue } from "jotai";
import { Button } from "./ui/button";
import { userAtom, userDetailsAtom } from "@/lib/atoms/user";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const RainbowTrackerButton = ({ className }: { className?: string }) => {
    const userDetails = useAtomValue(userDetailsAtom);
    const user = useAtomValue(userAtom);

    return (
        <Button
            className={cn(
                className,
                "font-semibold bg-[#FED30F] text-[#0C0F14] hover:bg-[#ffe159] transition-all"
            )}
            onClick={() => {
                window.open(
                    `https://r6.tracker.network/r6siege/profile/ubi/${
                        userDetails?.ubisoft_profile ||
                        user?.details?.ubisoft_profile
                    }/overview`,
                    "_blank"
                );
            }}
        >
            R6 Tracker
            <ExternalLink />
        </Button>
    );
};
