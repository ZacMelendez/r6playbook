import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Submit a New Play</h1>
            <div className="space-y-4">
                <div className="flex flex-row gap-3 items-center justify-center">
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-[288px] w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
