/* eslint-disable react/no-unescaped-entities */
import { LinkButton } from "@/components/ui/button";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <h2 className="mb-6">Effective Date: Dec. 1, 2024</h2>
            <div className="space-y-4">
                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        1. Introduction
                    </h2>
                    <p>
                        Rainbow 6 Playbook ("we," "our," or "us") is committed
                        to protecting your privacy. This Privacy Policy explains
                        how we collect, use, and share your personal information
                        when you use our web app (the "Service"). By using the
                        Service, you consent to the practices described in this
                        policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        2. Information We Collect
                    </h2>
                    <p>
                        We collect the following types of information:
                        <ul className="list-disc list-inside">
                            <li>
                                <strong>Personal Information:</strong> When you
                                sign in using Google Authentication, we collect
                                your name, email address, and avatar URL from
                                your Google account.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> We automatically
                                collect IP address, browser type, operating
                                system, and other technical data to improve the
                                Service.
                            </li>
                            <li>
                                <strong>Content:</strong> Strategies, maps, or
                                other game-related content you create or share
                                through the Service.
                            </li>
                        </ul>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        3. How We Use Your Information
                    </h2>
                    <p>
                        We use the information we collect to:
                        <ul className="list-disc list-inside">
                            <li>
                                Authenticate your account using Google
                                Authentication.
                            </li>
                            <li>
                                Facilitate the creation and sharing of game
                                strategies.
                            </li>
                            <li>
                                Personalize your experience by displaying your
                                name and avatar.
                            </li>
                            <li>
                                Communicate with you about updates or support
                                inquiries.
                            </li>
                            <li>Analyze usage to improve the Service.</li>
                        </ul>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        4. Sharing Your Information
                    </h2>
                    <p>
                        We do not sell or rent your personal information to
                        third parties. However, we may share your information
                        with:
                        <ul className="list-disc list-inside">
                            <li>
                                <strong>Service Providers:</strong> Third-party
                                vendors who help us operate the Service (e.g.,
                                hosting providers, analytics tools).
                            </li>
                            <li>
                                <strong>Legal Authorities:</strong> If required
                                by law or to protect our rights.
                            </li>
                        </ul>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        5. Data Security
                    </h2>
                    <p>
                        We take reasonable measures to protect your information.
                        However, no system is completely secure. Use the Service
                        at your own risk.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        6. Your Rights
                    </h2>
                    <p>
                        You may request to:
                        <ul className="list-disc list-inside">
                            <li>
                                Access, update, or delete your personal
                                information stored by us.
                            </li>
                            <li>
                                Revoke access to your Google account for the
                                Service.
                            </li>
                        </ul>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        7. Changes to This Policy
                    </h2>
                    <p>
                        We may update this Privacy Policy from time to time.
                        Continued use of the Service constitutes your acceptance
                        of the updated terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        8. Contact Us
                    </h2>
                    <p>
                        For questions or concerns, contact us at{" "}
                        <a
                            className="text-accent hover:text-primary hover:underline"
                            href="mailto:support@r6playbook.com"
                        >
                            support@r6playbook.com
                        </a>
                        .
                    </p>
                </section>
            </div>

            <div className="mt-8">
                <LinkButton href="/">Return to Home</LinkButton>
            </div>
        </div>
    );
}
