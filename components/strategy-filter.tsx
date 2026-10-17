"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { operators, sites } from "@/lib/constants";
import { ChevronDown, FilterIcon, XIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "./ui/multi-select";
import { useAtom } from "jotai";
import filterAtom from "@/lib/atoms/filter";
import { Separator } from "./ui/separator";
import { motion, Variants } from "motion/react";
import { Button } from "./ui/button";

const formSchema = z.object({
    map: z.string().optional(),
    site: z.string().optional(),
    operators: z.array(z.string()).optional(),
});

export function StrategyFilter() {
    const [filters, setFilters] = useAtom(filterAtom);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: filters,
    });

    const selectedMap = form.watch("map");
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
                                    onValueChange={(e) => {
                                        field.onChange(e);
                                        setFilters((prev) => ({
                                            ...prev,
                                            map: e,
                                        }));
                                    }}
                                    {...field}
                                >
                                    <FormControl>
                                        <div className="flex flex-row gap-2 md:min-w-[200px] relative h-full">
                                            <SelectTrigger className="flex-1 h-full">
                                                <SelectValue
                                                    placeholder="Select a map"
                                                    className="z-[49] h-full"
                                                />
                                            </SelectTrigger>
                                            {selectedMap && (
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
                                        setFilters((prev) => ({
                                            ...prev,
                                            site: e,
                                        }));
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                    disabled={!selectedMap}
                                >
                                    <FormControl>
                                        <div className="flex flex-row gap-2 md:min-w-[200px] relative h-full">
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
                    <FormField
                        control={form.control}
                        name="operators"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-auto">
                                <FormControl>
                                    <MultiSelect
                                        options={[
                                            ...operators["defenders"],
                                            ...operators["attackers"],
                                        ].map((i) => {
                                            return {
                                                label: i.name,
                                                value: i.name,
                                            };
                                        })}
                                        onValueChange={(e) => {
                                            field.onChange(e);
                                            setFilters((prev) => ({
                                                ...prev,
                                                operators: e,
                                            }));
                                        }}
                                        defaultValue={field.value}
                                        value={field.value}
                                        placeholder="Select operators"
                                        variant="inverted"
                                        maxCount={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}

export function AccordionFilter() {
    const [isOpen, setIsOpen] = React.useState(false);

    const chevronVariants: Variants = {
        open: {
            rotateZ: 180,
            transition: { duration: 0.25, ease: "easeInOut" },
        },
        closed: {
            rotateZ: 0,
            transition: { duration: 0.25, ease: "easeInOut" },
        },
    };

    const menuVariants: Variants = {
        open: {
            height: "auto",
            transition: { duration: 0.25, ease: "easeInOut" },
        },
        closed: {
            height: 0,
            transition: { duration: 0.25, ease: "easeInOut" },
        },
    };

    return (
        <div>
            <Button
                variant={"ghost"}
                className="w-full py-0 px-6 rounded-none hover:bg-white/10 hover:text-white flex flex-row justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FilterIcon className="size-8 mr-2" />
                <motion.div
                    variants={chevronVariants}
                    animate={isOpen ? "open" : "closed"}
                >
                    <ChevronDown className="size-8" />
                </motion.div>
            </Button>

            <motion.div
                initial="closed"
                className="overflow-hidden px-1"
                variants={menuVariants}
                animate={isOpen ? "open" : "closed"}
            >
                <StrategyFilter />
            </motion.div>
        </div>
    );
}

export const ResponsiveFilter = () => {
    return (
        <div className="w-full flex justify-center border-b mb-3">
            <div className="hidden md:flex">
                <StrategyFilter />
            </div>
            <div className="block w-full md:hidden">
                <AccordionFilter />
            </div>
        </div>
    );
};
