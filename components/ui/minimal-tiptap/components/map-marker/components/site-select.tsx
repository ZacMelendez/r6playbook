"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sites } from "@/lib/constants";
import { XIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useSetAtom } from "jotai";
import { Separator } from "@/components/ui/separator";
import { siteAtom } from "../atoms/siteAtom";
import { PlayFormSchema } from "@/app/create/components/PlayForm";

const formSchema = z.object({
    map: z.string().optional(),
    site: z.string().optional(),
});

export function SiteSelect() {
    const setSite = useSetAtom(siteAtom);

    const { watch } = useFormContext<PlayFormSchema>();
    const selectedMap = watch("map");
    const parentSite = watch("site");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            map: selectedMap,
            site: parentSite,
        },
    });

    React.useEffect(() => {
        setSite((prev) => ({
            ...prev,
            map: selectedMap,
        }));
        setSite((prev) => ({
            ...prev,
            site: parentSite,
        }));
    }, [selectedMap, setSite, parentSite]);

    const selectedSite = form.watch("site");

    return (
        <div className="my-3">
            <Form {...form}>
                <form
                    onSubmit={undefined}
                    className="flex flex-col md:flex-row md:flex-wrap gap-4 items-center justify-center h-fit md:h-10 sm:box-content w-full"
                >
                    <FormField
                        control={form.control}
                        name="map"
                        render={({ field: { ref: _ref, ...field } }) => (
                            <FormItem className="w-full md:w-auto h-full">
                                <Select
                                    disabled
                                    onValueChange={(e) => {
                                        field.onChange(e);
                                        setSite((prev) => ({
                                            ...prev,
                                            map: e,
                                        }));
                                    }}
                                    {...field}
                                >
                                    <FormControl>
                                        <div className="flex flex-row gap-2 md:min-w-[300px] relative h-full">
                                            <SelectTrigger className="flex-1 h-full">
                                                <SelectValue
                                                    placeholder="Select a map"
                                                    className="z-[49] h-full"
                                                />
                                            </SelectTrigger>
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
                            <FormItem className="w-full md:w-auto h-full">
                                <Select
                                    onValueChange={(e) => {
                                        field.onChange(e);
                                        setSite((prev) => ({
                                            ...prev,
                                            site: e,
                                        }));
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                    disabled={!selectedMap}
                                >
                                    <FormControl>
                                        <div className="flex flex-row gap-2 md:min-w-[300px] relative h-full">
                                            <SelectTrigger className="flex-1 h-full">
                                                <SelectValue placeholder="Select a site" />
                                            </SelectTrigger>
                                            {selectedSite && (
                                                <div className="absolute right-9 top-1/2 -translate-y-1/2 flex flex-row gap-1 items-center">
                                                    <XIcon
                                                        className="h-4 cursor-pointer text-muted-foreground"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            field.onChange(
                                                                null
                                                            );
                                                        }}
                                                    />
                                                    <Separator
                                                        orientation="vertical"
                                                        className="flex min-h-6 h-full"
                                                    />
                                                </div>
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
                </form>
            </Form>
        </div>
    );
}
