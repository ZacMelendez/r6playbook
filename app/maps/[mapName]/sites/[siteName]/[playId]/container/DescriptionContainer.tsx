import { motion } from "motion/react";
import React from "react";
import parse from "html-react-parser";
import { DisplayMap } from "../components/MapDisplay";

const renderContent = (htmlString: string) => {
    return parse(htmlString, {
        replace: (domNode: any) => {
            if (domNode.name === "react-component") {
                const url = domNode.attribs?.url;
                const markers = JSON.parse(domNode.attribs?.markers);

                return (
                    <div
                        className="py-2"
                        style={{
                            touchAction: "none",
                        }}
                    >
                        <DisplayMap url={url} markers={markers} />
                    </div>
                );
            }
        },
    });
};

interface DescriptionContainerProps {
    htmlContent: string;
}

const DescriptionContainer: React.FC<DescriptionContainerProps> = ({
    htmlContent,
}) => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="prose pt-3"
            >
                {renderContent(htmlContent)}
            </motion.div>
        </>
    );
};

export default DescriptionContainer;
