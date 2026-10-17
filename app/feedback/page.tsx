import { FeedbackForm } from "./components/FeedbackForm";

export default async function Index() {
    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-3xl font-bold mb-6">Submit Feedback</h1>
            <FeedbackForm />
        </div>
    );
}
