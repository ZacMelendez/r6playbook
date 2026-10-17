"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { createFeedback } from "@/lib/actions/feedback";

const formSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters.",
        })
        .max(100, {
            message: "Title must not exceed 100 characters.",
        }),
    message: z
        .string()
        .min(10, {
            message: "Description must be at least 10 characters.",
        })
        .max(1000, {
            message: "Description must not exceed 1000 characters.",
        }),
});

export type FeedbackFormSchema = z.infer<typeof formSchema>;

export function FeedbackForm({ data }: { data?: FeedbackFormSchema }) {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
            }
        } catch {
            setIsVerified(false);
        }
    }

    const handleChange = (token: string | null) => {
        handleCaptchaSubmission(token);
    };

    function handleExpired() {
        setIsVerified(false);
    }

    const params = useSearchParams();
    const router = useTransitionRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<FeedbackFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: data || {
            title: "",
            message: "",
        },
    });

    async function onSubmit(values: FeedbackFormSchema) {
        setLoading(true);
        try {
            const result = await createFeedback(values as any);
            if (params.get("xurl")) {
                router.push(params.get("xurl") as string);
            } else {
                if (!result) return;
                if (result === "Rate limit exceeded") {
                    return toast(
                        "Slow down there bud... wait a bit before trying again"
                    );
                }

                toast("Success", {
                    description:
                        "Thank you for your feedback! Redirecting you now...",
                });

                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field: { ref: _ref, ...field } }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter a short title..."
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
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <MinimalTiptapEditor
                                        sections={[1, 2, 4]}
                                        value={field.value}
                                        onChange={field.onChange}
                                        immediatelyRender={false}
                                        className="w-full"
                                        editorContentClassName="p-3 text-sm flex-1 flex"
                                        output="html"
                                        placeholder="Please leave your feedback here..."
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
                    size="invisible"
                    onChange={handleChange}
                    onExpired={handleExpired}
                />
                <Button
                    disabled={!isVerified || submitted}
                    loading={loading}
                    type="submit"
                    dynamicLoader
                >
                    Submit Feedback
                </Button>
            </form>
        </Form>
    );
}
