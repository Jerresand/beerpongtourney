import Layout from "@/components/dashboard/Layout";

const Rules = () => {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <section className="bg-dashboard-card rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Official Beer Pong Tournament Rules</h1>
          
          <div className="prose prose-invert">
            <h2 className="text-2xl font-semibold mb-4">Beer Pong Tournament Setup</h2>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li>Standard Beer Pong Table dimensions: 8 feet long by 2 feet wide (regulation size)</li>
              <li>10 cups per team arranged in a triangle formation</li>
              <li>Cups filled with the agreed-upon amount of beverage</li>
              <li>Two water cups for ball washing, one on each side</li>
              
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Basic Beer Pong Tournament Rules</h2>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li>Teams take turns throwing ping pong balls into the opposing team's cups</li>
              <li>Each team gets two shots per turn</li>
              <li>Elbows need to be behind the table at all times when throwing</li>
              <li>If both players hit cups in the same turn, the balls are returned for bonus shots</li>
              <li>When a cup is hit, it is removed from the table</li>
              <li>The first team to eliminate all of the opposing team's cups wins</li>
              <li>Bounced shots can be blocked or swatted away</li>
              <li>If a player is hit by a ball, they are out of the game</li>
              <li>You can defend by flicking the ball out of the glass without getting any beer on your fingers</li>
              <li>You can also defend by blowing the ball out while it spins around the glass, before it reaches the beer</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Beerpong Stats</h2>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li>A cup hit earns you a cup in the stats</li>
              <li>Hitting the last cup is called an ice, hitting an ice earns you a cup and an ice in the stats. Clutch.</li>
              <li>If you succefully defend a cup, you earn a defence in the stats</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Special Tournament Rules</h2>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li>Reformation/Racking allowed when 6, 3, and 1 cups remain</li>
              <li>Balls Back is awarded for 2+ cup hits in one turn</li>
              <li>Overtime rules: 3 cups in triangle formation if tied</li>
              <li>Redemption shot allowed for losing team</li>
            </ul>
          </div>
        </section>

        <section className="bg-dashboard-card rounded-lg p-6 mt-8">
          <h2 className="text-3xl font-bold text-white mb-6">How to Use the Beer Pong Tournament Creator</h2>
          
          <div className="prose prose-invert">
            <h3 className="text-xl font-semibold mb-4">Creating Your Beer Pong Bracket</h3>
            <p className="text-dashboard-text mb-4">
              Our Beer Pong Bracket Creator makes it easy to organize professional tournaments. Whether you're running a casual game night or a serious Beer Pong League, our tournament software has you covered.
            </p>

            <h3 className="text-xl font-semibold mb-4">Tournament Formats</h3>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li><strong>Regular Season + Playoffs:</strong> Create a Beer Pong League where teams face each other multiple times before entering playoffs</li>
              <li><strong>Playoffs Only:</strong> Use our Beer Pong Playoff Creator for single-elimination or best-of series tournaments</li>
              <li><strong>Singles or Doubles:</strong> Support for both individual and team Beer Pong Tournament formats</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li><strong>Beer Pong Stats Tracking:</strong> Keep detailed statistics for all players and teams</li>
              <li><strong>Flexible Bracket System:</strong> Support for 2-256 players in tournament brackets</li>
              <li><strong>League Management:</strong> Track regular season records and generate playoff seeding</li>
              <li><strong>Tournament History:</strong> Save and review past Beer Pong Tournament results</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">Quick Start Guide</h3>
            <ol className="list-decimal pl-6 space-y-2 text-dashboard-text">
              <li>Choose your tournament format (Regular Season + Playoffs or Playoffs Only)</li>
              <li>Add players or teams to your Beer Pong Tournament</li>
              <li>Set the number of matches or best-of series length</li>
              <li>Generate the schedule or bracket automatically</li>
              <li>Track scores and stats as games are played</li>
              <li>View comprehensive Beer Pong Stats and standings</li>
            </ol>
          </div>
        </section>

        <section className="bg-dashboard-card rounded-lg p-6 mt-8">
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our Beer Pong Tournament Creator?</h2>
          
          <div className="prose prose-invert">
            <ul className="list-disc pl-6 space-y-2 text-dashboard-text">
              <li>Professional Beer Pong Tournament management system</li>
              <li>Easy-to-use Beer Pong Bracket Creator</li>
              <li>Comprehensive Beer Pong Stats tracking</li>
              <li>Flexible tournament formats for any size event</li>
              <li>Perfect for Beer Pong League organization</li>
              <li>Mobile-friendly interface for scoring at the Beer Pong Table</li>
              <li>Free to use for all your Beer Pong Tournament needs</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Rules; 