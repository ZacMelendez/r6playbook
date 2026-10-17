import { Metadata } from "next";
import { Operators } from "./containers/Operators";

export const metadata: Metadata = {
    title: "Rainbow 6 Playbook - Operators",
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
    return <Operators />;
}
