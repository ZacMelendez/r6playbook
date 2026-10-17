"use server";

import cloudinary from "cloudinary";
import { checkRateLimit } from "./rateLimit";

export async function uploadToCloudinary(
    formData: FormData
): Promise<string | null> {
    const { success } = await checkRateLimit();
    if (!success) {
        return "Rate limit exceeded";
    }

    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
    const API_KEY = process.env.CLOUDINARY_API_KEY!;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

    const timestamp = Math.floor(Date.now() / 1000);

    // Step 1: Generate the signature
    const signature = cloudinary.v2.utils.api_sign_request(
        {
            folder: "r6playbook/uploads",
            timestamp,
        },
        API_SECRET
    );

    // Step 2: Upload to Cloudinary
    formData.append("folder", "r6playbook/uploads");
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", API_KEY);
    formData.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload to Cloudinary: ${error}`);
    }

    const data = await response.json();
    return data.secure_url;
}
