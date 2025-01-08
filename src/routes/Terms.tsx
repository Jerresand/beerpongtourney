import Layout from "@/components/dashboard/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 text-dashboard-text">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="text-sm text-dashboard-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>By accessing and using BeerPongTourney, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring your use complies with all applicable laws</li>
            <li>Using the service in a responsible manner</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Service Usage</h2>
          <p>Our service is intended for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating and managing beer pong tournaments</li>
            <li>Tracking game statistics</li>
            <li>Organizing players and teams</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Intellectual Property</h2>
          <p>All content and functionality on BeerPongTourney is protected by copyright and other intellectual property laws. Users retain ownership of their tournament data.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. Limitation of Liability</h2>
          <p>BeerPongTourney is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">6. Account Termination</h2>
          <p>We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">7. Changes to Terms</h2>
          <p>We may modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">8. Contact</h2>
          <p>For any questions about these terms, please contact us at terms@beerpongtourney.com</p>
        </section>
      </div>
    </Layout>
  );
};

export default Terms; 