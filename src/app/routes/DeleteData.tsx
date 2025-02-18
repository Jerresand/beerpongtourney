import { Button } from "@/components/ui/button";

export default function DeleteData() {
  return (
    <div className="min-h-screen bg-dashboard-background p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-dashboard-text">
        <h1 className="text-3xl font-bold text-white">Data Deletion Request</h1>
        <p className="text-sm text-dashboard-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">What We Delete</h2>
          <p>When you request data deletion, we will remove:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your account information</li>
            <li>Your tournament history and statistics</li>
            <li>Your account preferences and settings</li>
            <li>Any other personal data associated with your account</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Deletion Request Form</h2>
          <p>To submit a deletion request, please fill out the form below:</p>
          <form className="space-y-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dashboard-text">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md bg-dashboard-background-light border-dashboard-border text-dashboard-text shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-dashboard-text">Additional Information</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md bg-dashboard-background-light border-dashboard-border text-dashboard-text shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any additional information about your deletion request"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Deletion Request
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
} 