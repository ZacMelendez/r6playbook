const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getFolderContents = async (folderPath) => {
    let result = [];

    // Fetch files within the folder
    const fetchResources = async (nextCursor) => {
        const options = { type: 'upload', prefix: folderPath };
        if (nextCursor) options.next_cursor = nextCursor;

        const response = await cloudinary.api.resources(options);
        result = result.concat(response.resources.map((r) => r.secure_url));

        // Fetch additional resources if there is a next_cursor
        if (response.next_cursor) {
            await fetchResources(response.next_cursor);
        }
    };

    // Fetch subfolders within the folder
    const fetchSubfolders = async () => {
        const response = await cloudinary.api.sub_folders(folderPath);
        for (const folder of response.folders) {
            const subfolderContents = await getFolderContents(folder.path);
            result = result.concat(subfolderContents);
        }
    };

    // Fetch files and subfolders
    await fetchResources();
    try {
        await fetchSubfolders();
    } catch (e) {
        if (e.http_code !== 404) {
            console.error(`Error fetching subfolders for ${folderPath}:`, e);
        }
    }

    return result;
};

// Call the function
(async () => {
    const images = await getFolderContents('r6playbook');
    console.log('All image URLs:', images);
})();
