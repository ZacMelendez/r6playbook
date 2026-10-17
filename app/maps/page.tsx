import { Metadata } from "next";
import { Maps } from "./containers/Maps";
import ScrollToTop from "./components/ScrollToTop";

export const metadata: Metadata = {
    title: "Rainbow 6 Playbook - Maps",
    description:
        "Your ultimate resource for advanced Rainbow 6 Siege strategies.",
    openGraph: {
        description:
            "Your ultimate resource for advanced Rainbow 6 Siege strategies.",
        images: [
            "https://res.cloudinary.com/drmatz1gd/image/upload/v1732851101/r6playbook/r6pb_og_w6jnxt.png",
        ],
    },
};

export default function Index() {
    return (
        <>
            <ScrollToTop />
            <Maps />
        </>
    );
}
