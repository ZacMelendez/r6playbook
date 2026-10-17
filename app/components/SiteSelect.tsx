"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sites } from "@/lib/constants";
import { useTransitionRouter } from "next-view-transitions";
import { convertToUrlParameter } from "@/lib/string";
import { X } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    map: z.string().min(1, {
        message: "Please select a map.",
    }),
    site: z.string().optional(),
});

export function SiteSelect() {
    const router = useTransitionRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            map: "",
            site: "",
        },
    });

    const selectedMap = form.watch("map");
    const selectedSite = form.watch("site");

    React.useEffect(() => {
        form.resetField("site");
    }, [selectedMap, form]);

    const onSubmit = React.useCallback(() => {
        if (!selectedMap) return;
        router.push(convertToUrlParameter(selectedMap, selectedSite));
    }, [selectedMap, selectedSite, router]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row md:flex-wrap gap-4 items-center justify-center w-full"
            >
                <FormField
                    control={form.control}
                    name="map"
                    render={({ field }) => (
                        <FormItem className="w-full md:w-auto">
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <div className="flex flex-row gap-2 md:min-w-[200px]">
                                        <SelectTrigger
                                            aria-label="map select"
                                            className="flex-1"
                                        >
                                            <SelectValue
                                                placeholder="Select a map"
                                                className="z-[49]"
                                            />
                                        </SelectTrigger>
                                        {selectedMap && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange(null);
                                                }}
                                            >
                                                <X />
                                            </Button>
                                        )}
                                    </div>
                                </FormControl>
                                <SelectContent>
                                    {Object.keys(sites).map((map) => (
                                        <SelectItem key={map} value={map}>
                                            {map}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="site"
                    render={({ field }) => (
                        <FormItem className="w-full md:w-auto">
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                disabled={!selectedMap}
                            >
                                <FormControl>
                                    <div className="flex flex-row gap-2 md:min-w-[200px]">
                                        <SelectTrigger
                                            aria-label="site select"
                                            className="flex-1"
                                        >
                                            <SelectValue placeholder="Select a site" />
                                        </SelectTrigger>
                                        {selectedSite && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange(null);
                                                }}
                                            >
                                                <X />
                                            </Button>
                                        )}
                                    </div>
                                </FormControl>
                                <SelectContent>
                                    {sites[
                                        selectedMap as keyof typeof sites
                                    ]?.map((site) => (
                                        <SelectItem key={site} value={site}>
                                            {site}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={!selectedMap}
                    className="w-full md:w-16"
                    aria-label="go to map/sites combo"
                >
                    Go
                </Button>
            </form>
        </Form>
    );
}
