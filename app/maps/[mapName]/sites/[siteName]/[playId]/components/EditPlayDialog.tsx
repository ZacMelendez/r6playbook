import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { operators, siteImages, sites } from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";
import { updateStrategy } from "@/lib/actions/strategies";
import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { userAtom } from "@/lib/atoms/user";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { strategyAtom } from "@/lib/atoms/strategies";
import { toast } from "sonner";

const formSchema = z.object({
    id: z.string(),
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters.",
        })
        .max(100, {
            message: "Title must not exceed 100 characters.",
        }),
    description: z
        .string()
        .min(10, {
            message: "Description must be at least 10 characters.",
        })
        .max(1000, {
            message: "Description must not exceed 1000 characters.",
        }),
    map: z.string().min(1, {
        message: "Please select a map.",
    }),
    site: z.string().min(1, {
        message: "Please select a site.",
    }),
    side: z.enum(["defense", "attack"]),
    operators: z.array(z.string()).min(1, {
        message: "Please select at least one operator.",
    }),
});

export type PlayFormSchema = z.infer<typeof formSchema>;

export const EditPlayDialog = ({
    data,
    onOpenChange,
}: {
    data: PlayFormSchema;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
    const setStrategy = useSetAtom(strategyAtom);
    const user = useAtomValue(userAtom)!;
    const [siteImg, setSiteImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<PlayFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: data,
    });

    const selectedMap = form.watch("map");
    const selectedSite = form.watch("site");
    const side = form.watch("side");

    useEffect(() => {
        form.resetField("operators", { defaultValue: [] });
    }, [side, form]);

    useEffect(() => {
        form.resetField("site");
    }, [selectedMap, form]);

    async function onSubmit(values: PlayFormSchema) {
        setLoading(true);
        try {
            const result = await updateStrategy(values as any, user);

            if (result === "Rate limit exceeded") {
                return toast(
                    "Slow down there bud... wait a bit before trying again"
                );
            }

            if (result) {
                setStrategy(result);
            }
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedSite || !selectedMap) return setSiteImg(null);
        setSiteImg(
            siteImages[selectedMap as keyof typeof siteImages]?.[selectedSite]
        );
    }, [selectedSite, selectedMap]);

    return (
        <DialogContent className="min-w-[50vw] max-h-[90vh] flex flex-col">
            <Form {...form}>
                <DialogHeader className="flex-1">
                    <DialogTitle>Edit Play</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={undefined}
                    className="overflow-y-scroll flex-1 pr-1"
                >
                    <div className="space-y-4 p-2 flex-1">
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                            <div className="flex flex-col gap-4 w-full sm:flex-1">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({
                                        field: { ref: _ref, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>Play Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your Play title"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="map"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Map</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <div className="flex flex-row gap-2">
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue
                                                                placeholder="Select a map"
                                                                className="z-[50]"
                                                            />
                                                        </SelectTrigger>
                                                        {selectedMap && (
                                                            <Button
                                                                className="px-2"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                <X />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.keys(sites).map(
                                                        (map) => (
                                                            <SelectItem
                                                                key={map}
                                                                value={map}
                                                            >
                                                                {map}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                        <FormItem>
                                            <FormLabel>Site</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                                disabled={!selectedMap}
                                            >
                                                <FormControl>
                                                    <div className="flex flex-row gap-2">
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select a site" />
                                                        </SelectTrigger>
                                                        {selectedSite && (
                                                            <Button
                                                                className="px-2"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(
                                                                        null
                                                                    );
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
                                                        <SelectItem
                                                            key={site}
                                                            value={site}
                                                        >
                                                            {site}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {siteImg && (
                                <div className="sm:flex-1 w-full flex items-center justify-center">
                                    <img
                                        src={siteImg}
                                        alt={`${selectedMap}-${selectedSite}`}
                                        width={320}
                                        height={180}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <FormField
                            control={form.control}
                            name="side"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Operators</FormLabel>
                                    <FormControl>
                                        <Tabs
                                            defaultValue={field.value}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="w-auto"
                                        >
                                            <TabsList className="grid w-auto grid-cols-2">
                                                <TabsTrigger value="defense">
                                                    Defenders
                                                </TabsTrigger>
                                                <TabsTrigger value="attack">
                                                    Attackers
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="operators"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <MultiSelect
                                            options={operators[
                                                side === "defense"
                                                    ? "defenders"
                                                    : "attackers"
                                            ].map((i) => {
                                                return {
                                                    label: i.name,
                                                    value: i.name,
                                                };
                                            })}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            placeholder={`Select ${
                                                side === "defense"
                                                    ? "defenders"
                                                    : "attackers"
                                            }`}
                                            variant="inverted"
                                            maxCount={5}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <TooltipProvider>
                                            <MinimalTiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                immediatelyRender={false}
                                                className="w-full"
                                                editorContentClassName="p-3 text-sm flex-1 flex"
                                                output="html"
                                                placeholder="Explain your play here..."
                                                editable={true}
                                                editorClassName="focus:outline-none h-full flex-1"
                                            />
                                        </TooltipProvider>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
                <DialogFooter className="flex-1">
                    <Button
                        loading={loading}
                        type="button"
                        dynamicLoader
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    );
};
