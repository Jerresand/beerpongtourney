export default function DeleteData() {
  return (
    <div className="min-h-screen bg-dashboard-background p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-dashboard-text">
        <h1 className="text-3xl font-bold text-white">Data Deletion Request</h1>
        <p className="text-sm text-dashboard-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Facebook Data Deletion</h2>
          <p>To delete your Facebook data associated with BeerPongTourney, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Remove our app from your Facebook settings at <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Facebook App Settings</a></li>
            <li>Email us at privacy@beerpongtourney.com with your deletion request</li>
            <li>Use the deletion request form below</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">What We Delete</h2>
          <p>When you request data deletion, we will remove:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your Facebook profile information</li>
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
              <label htmlFor="fbId" className="block text-sm font-medium text-dashboard-text">Facebook ID (optional)</label>
              <input
                type="text"
                id="fbId"
                name="fbId"
                className="mt-1 block w-full rounded-md bg-dashboard-background-light border-dashboard-border text-dashboard-text shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your Facebook ID if known"
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
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Submit Deletion Request
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Processing Time</h2>
          <p>We will process your deletion request within 30 days. You will receive a confirmation email once your data has been deleted.</p>
        </section>
      </div>
    </div>
  );
} 