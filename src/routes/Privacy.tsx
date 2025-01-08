export default function Privacy() {
  return (
    <div className="min-h-screen bg-dashboard-background p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-dashboard-text">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="text-sm text-dashboard-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when using BeerPongTourney:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facebook login information (name, email, profile picture)</li>
            <li>Tournament data and statistics</li>
            <li>User preferences and settings</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Store your tournament data</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about our services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Data Storage and Security</h2>
          <p>Your data is stored securely in MongoDB Atlas and protected by industry-standard security measures. We retain your data for as long as your account is active.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Your Rights (GDPR Compliance)</h2>
          <p>Under GDPR and other privacy laws, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. Cookies and Tracking</h2>
          <p>We use essential cookies for authentication and session management. We also use analytics tools to improve our services.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">6. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facebook Login for authentication</li>
            <li>MongoDB Atlas for data storage</li>
            <li>Vercel for hosting and analytics</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">7. Contact Us</h2>
          <p>For any privacy-related questions or requests, please contact us at privacy@beerpongtourney.com</p>
        </section>
      </div>
    </div>
  );
} 