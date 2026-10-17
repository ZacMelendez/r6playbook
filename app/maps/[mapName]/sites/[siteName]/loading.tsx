"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

export default function Index() {
    return (
        <div className="container mx-auto">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-6"
            >
                <Skeleton className="h-[40px] w-[600px]" />
            </motion.h1>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        key={i}
                    >
                        <Skeleton className="h-[125px] w-full" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
