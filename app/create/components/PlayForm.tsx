"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type ReCAPTCHAComponent from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
import { operators, sites } from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";
import { createStrategy, updateStrategy } from "@/lib/actions/strategies";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { siteAtom } from "@/lib/atoms/site";
import { X } from "lucide-react";
import { userAtom } from "@/lib/atoms/user";
import { useSearchParams } from "next/navigation";
const MinimalTiptapEditor = dynamic(
    () =>
        import("../../../components/ui/minimal-tiptap").then((mod) => ({
            default: mod.MinimalTiptapEditor,
        })),
    { ssr: false }
);

const ReCAPTCHA = dynamic(() => import("./RecaptchaField"), { ssr: false });
import { TooltipProvider } from "../../../components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { convertToUrlParameter } from "@/lib/string";
import { addVote } from "@/lib/actions/votes";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { activeDraftAtom, draftsAtom } from "@/lib/atoms/strategies";
import { Drafts } from "@/app/create/components/Drafts";

const formSchema = z.object({
    id: z.string().optional(),
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
        .max(5000, {
            message: "Description must not exceed 5000 characters.",
        }),
    map: z.string().min(1, {
        message: "Please select a map.",
    }),
    site: z.string().min(1, {
        message: "Please select a site.",
    }),
    side: z.enum(["defense", "attack"]),
    is_draft: z.boolean(),
    operators: z.array(z.string()).min(1, {
        message: "Please select at least one operator.",
    }),
});

export type PlayFormSchema = z.infer<typeof formSchema>;

export function PlayForm({ data }: { data?: PlayFormSchema }) {
    const recaptchaRef = useRef<ReCAPTCHAComponent>(null);
    const [_isVerified, setIsVerified] = useState(false);
    const params = useSearchParams();
    const router = useTransitionRouter();
    const defaultMap = useAtomValue(siteAtom);
    const user = useAtomValue(userAtom)!;
    const [draft, setDraft] = useAtom(activeDraftAtom)!;
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const setDrafts = useSetAtom(draftsAtom);
    const hasMounted = useRef(false);

    async function handleCaptchaSubmission(token: string | null) {
        try {
            if (token) {
                await fetch("/api/recaptcha", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });
                setIsVerified(true);
                return true;
            }
        } catch {
            setIsVerified(false);
            return false;
        }
    }

    function handleExpired() {
        setIsVerified(false);
    }

    const form = useForm<PlayFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues:
            data || draft
                ? {
                      description: draft!.description,
                      id: draft!.id,
                      map: draft!.map,
                      title: draft!.title,
                      is_draft: draft!.is_draft!,
                      operators: draft!.operators,
                      side: draft!.side as any,
                      site: draft!.site,
                  }
                : {
                      id: undefined,
                      title: "",
                      description: "",
                      map: defaultMap.map || "",
                      site: defaultMap.site || "",
                      operators: [],
                      side: "defense",
                      is_draft: false,
                  },
    });

    const selectedMap = form.watch("map");
    const selectedSite = form.watch("site");
    const side = form.watch("side");

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        form.resetField("operators", { defaultValue: [] });
    }, [side, form]);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        form.resetField("site", { defaultValue: undefined });
    }, [selectedMap, form]);

    async function onSubmit(values: PlayFormSchema) {
        try {
            if (values.id) {
                const result = await updateStrategy(values as any, user);
                if (result === "Rate limit exceeded") {
                    return toast(
                        "Slow down there bud... wait a bit before trying again"
                    );
                }
                if (result) {
                    setDrafts((drafts) =>
                        (drafts || []).map((draft) => {
                            if (draft.id === result.id) {
                                return result;
                            } else return draft;
                        })
                    );
                    form.reset({
                        id: undefined,
                        title: "",
                        description: "",
                        map: defaultMap.map || "",
                        site: defaultMap.site || "",
                        operators: [],
                        side: "defense",
                        is_draft: false,
                    });
                    setDraft(null);
                }
            }
            const result = await createStrategy(values as any, user);
            if (params.get("xurl")) {
                router.push(params.get("xurl") as string);
            } else {
                if (!result) return;
                if (result === "Rate limit exceeded") {
                    return toast(
                        "Slow down there bud... wait a bit before trying again"
                    );
                }

                if (values?.is_draft) {
                    form.reset({
                        id: undefined,
                        title: "",
                        description: "",
                        map: defaultMap.map || "",
                        site: defaultMap.site || "",
                        operators: [],
                        side: "defense",
                        is_draft: false,
                    });
                    setDrafts((drafts) =>
                        (drafts || []).map((draft) => {
                            if (draft.id === result.id) {
                                return result;
                            } else return draft;
                        })
                    );
                } else {
                    await addVote(result.id, user, null, true);
                    router.push(
                        convertToUrlParameter(
                            result?.map,
                            result?.site,
                            result?.id
                        )
                    );
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setDraftLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={undefined} className="space-y-4">
                <Drafts />
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <div className="flex flex-col gap-4 w-full sm:flex-1">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field: { ref: _ref, ...field } }) => (
                                <FormItem>
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
                                                        className="z-[49]"
                                                    />
                                                </SelectTrigger>
                                                {selectedMap && (
                                                    <Button
                                                        className="px-2"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={(e) => {
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
                                            {Object.keys(sites).map((map) => (
                                                <SelectItem
                                                    key={map}
                                                    value={map}
                                                >
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
                                <FormItem>
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
                                                        onClick={(e) => {
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
                </div>
                <FormField
                    control={form.control}
                    name="side"
                    render={({ field }) => (
                        <FormItem>
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
                            <FormControl>
                                <TooltipProvider>
                                    <MinimalTiptapEditor
                                        value={field.value}
                                        content={field.value}
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
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    ref={recaptchaRef}
                    onExpired={handleExpired}
                    size="invisible"
                />
                <div className="flex flex-row justify-end gap-4">
                    <Button
                        variant={"outline"}
                        className="mr-auto"
                        type="button"
                        onClick={() => {
                            setDraft(null);
                            form.reset({
                                id: undefined,
                                title: "",
                                description: "",
                                map: defaultMap.map || "",
                                site: defaultMap.site || "",
                                operators: [],
                                side: "defense",
                                is_draft: false,
                            });
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        loading={draftLoading}
                        type="button"
                        dynamicLoader
                        onClick={async () => {
                            setDraftLoading(true);
                            if (!(await form.trigger())) return;
                            const token =
                                await recaptchaRef.current?.executeAsync();
                            if (!token) return;
                            const result = await handleCaptchaSubmission(token);
                            if (!result) return;
                            await onSubmit({
                                ...form.getValues(),
                                is_draft: true,
                            });
                        }}
                    >
                        Save Draft
                    </Button>

                    <Button
                        loading={loading}
                        type="button"
                        onClick={async () => {
                            setLoading(true);
                            if (!(await form.trigger())) return;
                            const token =
                                await recaptchaRef.current?.executeAsync();
                            if (!token) return;
                            const result = await handleCaptchaSubmission(token);
                            if (!result) return;
                            await onSubmit({
                                ...form.getValues(),
                                is_draft: false,
                            });
                        }}
                        dynamicLoader
                    >
                        Submit Play
                    </Button>
                </div>
            </form>
        </Form>
    );
}
