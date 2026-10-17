import * as React from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { UploadIcon } from "lucide-react";

interface ImageEditBlockProps {
    editor: Editor;
    close: () => void;
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
    editor,
    close,
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [link, setLink] = React.useState("");

    const handleClick = React.useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFile = React.useCallback(
        (files: FileList | null) => {
            if (!files?.length) return;

            const insertImages = async () => {
                const contentBucket = [];
                const filesArray = Array.from(files);

                for (const file of filesArray) {
                    contentBucket.push({ src: file });
                }

                editor.commands.setImages(contentBucket);
            };

            insertImages();
            close();
        },
        [editor, close]
    );

    const handleSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (link) {
                editor.commands.setImages([{ src: link }]);
                close();
            }
        },
        [editor, link, close]
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="image-link">Attach an image link</Label>
                <div className="flex">
                    <Input
                        id="image-link"
                        type="url"
                        required
                        placeholder="https://example.com/image.jpg"
                        value={link}
                        className="grow"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLink(e.target.value)
                        }
                    />
                    <Button type="submit" className="ml-2">
                        Submit
                    </Button>
                </div>
            </div>

            <Dropzone
                inputRef={fileInputRef}
                onChange={handleFile}
                multiple={false}
                accept="image/*"
                className="hover:bg-white/5 cursor-pointer rounded-lg border border-dashed"
                onClick={handleClick}
            >
                <div className="flex flex-col items-center justify-center ">
                    <div className="border rounded-full p-4">
                        <UploadIcon size={24} />
                    </div>
                    <div className="text-center pt-4">
                        <p className="text-lg font-semibold">
                            Drag and drop an image up to 5MB
                        </p>
                    </div>
                </div>
            </Dropzone>
        </form>
    );
};

export default ImageEditBlock;
