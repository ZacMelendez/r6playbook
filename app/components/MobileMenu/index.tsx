"use client";

import { AnimatePresence, motion } from "motion/react";
import { Navigation } from "./components/Navigation";
import { atom, useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { UserActions } from "./components/User";
import { Separator } from "@/components/ui/separator";
import { useTransitionRouter } from "next-view-transitions";
export const menuOpenAtom = atom(false);

const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
};

export default function MobileMenu() {
    const [open, setOpen] = useAtom(menuOpenAtom);
    const router = useTransitionRouter();
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                    className="sm:hidden h-screen w-screen px-16 absolute top-0 right-0 bg-background z-[200] flex flex-col items-center justify-center"
                >
                    <UserActions />
                    <Separator className="my-4 mx-16" />
                    <Navigation />
                    <Separator className="my-4" />
                    <Button
                        className="hover:bg-white/10 hover:text-primary-foreground font-bold px-4 py-2 box-border h-fit"
                        aria-label="create a play link"
                        onClick={() => {
                            router.push("/create");
                            setOpen(false);
                        }}
                    >
                        Create a Play
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export const MobileMenuButton = () => {
    const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpenAtom);
    return (
        <Button
            className="z-[201] sm:hidden ml-auto"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close nav menu" : "Open nav menu"}
        >
            {isMenuOpen ? (
                <X className="h-6 w-6" />
            ) : (
                <Menu className="h-6 w-6" />
            )}
        </Button>
    );
};
