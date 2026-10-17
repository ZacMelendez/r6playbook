import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Loading() {
    return (
        <div className="container mx-auto px-8 space-y-8 py-8">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-6 relative">
                <div className="flex flex-row justify-between items-start relative">
                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <div>
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-8 w-24" />
                    ))}
                </div>
                <Separator />
                <div>
                    <Tabs defaultValue="favorites" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-fit">
                            <TabsTrigger value="favorites">
                                <Skeleton className="h-6 w-20" />
                            </TabsTrigger>
                            <TabsTrigger value="my_posts">
                                <Skeleton className="h-6 w-20" />
                            </TabsTrigger>
                            <TabsTrigger
                                value="my_drafts"
                                className="hidden sm:block"
                            >
                                <Skeleton className="h-6 w-20" />
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="favorites">
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
