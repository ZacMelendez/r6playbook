"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { userAtom } from "@/lib/atoms/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { updateUser } from "@/lib/actions/user";
import { useState } from "react";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { operators } from "@/lib/constants";
import {
    Dialog,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
    username: z
        .string()
        .min(3, {
            message: "Username must be at least 3 characters.",
        })
        .max(50, {
            message: "Username must not exceed 50 characters.",
        }),
    email: z.string(),
    operators: z.array(z.string()).optional(),
    ubisoft_profile: z.string().optional(),
});

export function UserForm() {
    const [user, setUser] = useAtom(userAtom);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user?.details?.username || "",
            email: user?.email || "",
            operators: user?.details?.favorite_operators || [],
            ubisoft_profile: user?.details?.ubisoft_profile || "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const result = await updateUser(
                {
                    username: data.username,
                    favorite_operators: data.operators || [],
                    ubisoft_profile: data.ubisoft_profile,
                },
                user!.id
            );

            if (result === "Rate limit exceeded") {
                return toast(
                    "Slow down there bud... wait a bit before trying again"
                );
            }

            const { data: userResult, error } = result;

            if (error && (error as any)?.code === "23505") {
                form.setError("username", {
                    type: "manual",
                    message: "Username is already taken",
                });
                return;
            }
            toast("Successfully saved your changes");
            form.reset({
                username: userResult?.username,
                operators: userResult?.favorite_operators || [],
                email: user?.email || "",
            });
            setUser(async (user) => {
                const userInfo = await user;

                return {
                    ...(userInfo as any),
                    details: {
                        ...userInfo?.details,
                        username: userResult?.username || "",
                        favorite_operators:
                            userResult?.favorite_operators || [],
                    },
                };
            });
            setOpen(false);
        } catch {
            toast("There was an error updating your account");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    size="icon"
                    type="button"
                    className="absolute bottom-0 right-0 sm:top-0"
                >
                    <Settings />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Settings</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={undefined}>
                        <div className="flex items-center space-x-4">
                            <div className="space-y-2 flex-1">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({
                                            field: { ref: _ref, ...field },
                                        }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Display Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter a display name"
                                                        {...field}
                                                        autoComplete="off"
                                                        hasError={
                                                            !!form.formState
                                                                .errors.username
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="ubisoft_profile"
                                        render={({
                                            field: { ref: _ref, ...field },
                                        }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Ubisoft Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your ubisoft account name"
                                                        {...field}
                                                        autoComplete="off"
                                                        hasError={
                                                            !!form.formState
                                                                .errors
                                                                .ubisoft_profile
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <FormDescription>
                                                    This is used to link to your
                                                    R6 Tracker profile
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="operators"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Favorite Operators
                                                </FormLabel>
                                                <FormControl>
                                                    <MultiSelect
                                                        options={[
                                                            ...operators.attackers,
                                                            ...operators.defenders,
                                                        ].map((i) => {
                                                            return {
                                                                label: i.name,
                                                                value: i.name,
                                                            };
                                                        })}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        value={field.value}
                                                        placeholder={`Select operators`}
                                                        variant="inverted"
                                                        maxCount={6}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        loading={loading}
                        className="w-full"
                        disabled={!form.formState.isDirty || loading}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
