import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function UserActionsLoading() {
    return (
        <div className="hidden sm:flex flex-row gap-3 items-center w-fit absolute right-16">
            <div>
                <Skeleton className="h-10 w-24" />
            </div>
            <div>
                <Avatar>
                    <AvatarFallback>
                        <User className="animate-pulse" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
