export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ message: "Only POST requests allowed" }),
            { status: 405 }
        );
    }

    const data = await req.json();
    const { token } = data;
    const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
        return new Response(JSON.stringify({ message: "Token not found" }), {
            status: 405,
        });
    }

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/sitesverify?secret=${secretKey}&response=${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const data = await response.json();

        if (data.success) {
            return new Response(JSON.stringify({ message: "Success" }), {
                status: 200,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Failed to verify" }),
                {
                    status: 405,
                }
            );
        }
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            {
                status: 500,
            }
        );
    }
}
