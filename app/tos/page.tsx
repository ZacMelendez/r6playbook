/* eslint-disable react/no-unescaped-entities */
import { LinkButton } from "@/components/ui/button";

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <h2 className="mb-6">Effective Date: Dec. 1, 2024</h2>

            <div className="space-y-4">
                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        1. Agreement to Terms
                    </h2>
                    <p>
                        By accessing or using Rainbow 6 Playbook (the
                        "Service"), you agree to these Terms of Service
                        ("Terms"). If you do not agree, do not use the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        2. Eligibility
                    </h2>
                    <p>
                        You must be at least 13 years old to use the Service. By
                        using the Service, you represent that you meet this
                        requirement.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        3. Use of the Service
                    </h2>
                    <p>You agree to:</p>
                    <ul className="list-disc list-inside">
                        <li>Use the Service for lawful purposes.</li>
                        <li>
                            Not upload illegal, harmful, or infringing content.
                        </li>
                        <li>
                            Acknowledge that all game-related trademarks, maps,
                            assets, and intellectual property belong to Ubisoft
                            Entertainment.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        4. Ubisoft Disclaimer
                    </h2>
                    <p>
                        Rainbow 6 Playbook is an independent fan-created tool
                        and is not endorsed, affiliated with, or sponsored by
                        Ubisoft Entertainment. Rainbow Six Siege®, Ubisoft, and
                        their respective logos are trademarks or registered
                        trademarks of Ubisoft Entertainment. Use of the Service
                        is at your own discretion and risk, and users must
                        comply with Ubisoft's{" "}
                        <a
                            className="text-accent hover:text-primary hover:underline"
                            rel="noreferrer"
                            target="_blank"
                            href="https://legal.ubi.com/termsofuse/en-US"
                        >
                            Terms of Use
                        </a>{" "}
                        and{" "}
                        <a
                            className="text-accent hover:text-primary hover:underline"
                            rel="noreferrer"
                            target="_blank"
                            href="https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/4h4MEtQwhxnOtNrH6KGMi2/rainbow-six-siege-code-of-conduct"
                        >
                            Code of Conduct
                        </a>
                        .
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        5. Account Responsibilities
                    </h2>
                    <p>If you create an account:</p>
                    <ul className="list-disc list-inside">
                        <li>
                            You are responsible for maintaining its security.
                        </li>
                        <li>You must notify us of any unauthorized use.</li>
                        <li>
                            You may revoke our access to your Google account at
                            any time, but this may limit your ability to use the
                            Service.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        6. Intellectual Property
                    </h2>
                    <p>
                        All content, trademarks, and branding on the Service
                        belong to us or our licensors, except for Ubisoft’s
                        intellectual property, which remains their sole
                        property. User-created strategies or content uploaded to
                        the Service are owned by the user, but by uploading, you
                        grant us a license to display and distribute them within
                        the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        7. Termination
                    </h2>
                    <p>
                        We reserve the right to suspend or terminate your access
                        to the Service for violations of these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        8. Limitation of Liability
                    </h2>
                    <p>
                        The Service is provided "as is" without warranties of
                        any kind. We are not liable for any damages arising from
                        your use of the Service or Ubisoft’s enforcement of its
                        intellectual property rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        9. Governing Law
                    </h2>
                    <p>
                        These Terms are governed by the laws of the United
                        States, without regard to its conflict of laws
                        principles.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        10. Changes to These Terms
                    </h2>
                    <p>
                        We may update these Terms from time to time. Continued
                        use of the Service constitutes your acceptance of the
                        updated terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        11. Contact Us
                    </h2>
                    <p>
                        For questions about these Terms, contact us at{" "}
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
