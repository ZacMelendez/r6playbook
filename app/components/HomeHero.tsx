"use client";

import { motion } from "motion/react";
import { Hero } from "./Hero";

export function HomeHero() {
    return (
        <motion.main
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col justify-center items-center relative z-10 text-center px-4 sm:px-6 lg:px-8 mb-24"
        >
            <Hero />
        </motion.main>
    );
}
