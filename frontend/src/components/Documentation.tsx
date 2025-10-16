import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto py-16 px-8 space-y-16">
        {/* Overview Section */}
        <section className="space-y-6">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent pb-2">
            Overview
          </h1>
          <div className="prose prose-invert mx-auto max-w-3xl">
            <p className="text-2xl text-center text-amber-300 mb-8">
              Why is more than just a crypto project - it's a movement built on the foundation of purpose and power.
            </p>
            <p className="text-lg text-gray-300 text-center leading-relaxed">
              Why is a project on brand to the philosophy of a man or woman's "why power". Why provides value in regards to all things from project building, modern technological tools, art and good vibes for everyone. Why embraces a culture of dreaming big, never settling for less, and ultimately living your best life.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">Introduction</h2>
          <div className="prose prose-invert mx-auto max-w-3xl">
            <p className="text-lg text-gray-300 text-center leading-relaxed mb-8">
              In a realm full of high emotion, winning and losing at the highest levels we need some light. A reminder as to "why" you first began and "why" you will finish strong.
            </p>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-amber-500/20 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-center text-amber-300">Our Vision</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Our vision is to harbor a community of like-minded individuals and be the source that provides everything we possibly can to stay true to what our brand stands for. Think run clubs mixed with modern day AI tech mixed with cool branding and an amazing community culture all on the Solana blockchain.
              </p>
            </div>
          </div>
        </section>

        {/* Project Overview Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">Project Overview</h2>
          <div className="prose prose-invert mx-auto max-w-3xl space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              With the technologies we have available and understanding the current state of advancements and economic trends it is clear that outdated physical labor grueling 9 to 5s and mundane careers are longer what we look for or need.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are creating the tools that empower everyone to pursue their true version of success and fulfillment. We are providing a space for people to come together and walk in the footprints of their true selves. In a world filled with abundant opportunities and beauty, there's no time to settle for doing to being something you dislike - or even worse something you hate.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are harnessing the power of social media to build a community through inspiring art, thought provoking quotes and other forms of engaging content. Beyond this, we are creating value in the form of modern tools and technologies, we provide a place for people to discuss, connect and collaborate, we are going to be hosting events IRL, and have other social aspects planned out for the future.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are leveraging the power of the blockchain in various ways. One key aspect is the incorporation of a coin that will be deeply integrated into our project. The goal is to not only on-board more onto the Solana blockchain but to also onboard many onto the culture of $why with our coin.
            </p>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Use case cards with consistent styling */}
            {[
              {
                title: "1. Community Building and Networking",
                items: ["User Connection: Platform for like-minded individuals", "Collaboration Opportunities", "Inspiring Content"]
              },
              {
                title: "2. Personal Development Tools",
                items: ["Goal Setting & Tracking", "AI-Powered Coaching", "Workshops & Events"]
              },
              {
                title: "3. Blockchain Integration",
                items: ["$WHY Coin Utility", "Solana Blockchain Adoption", "Tokenized Rewards"]
              },
              {
                title: "4. Creator Economy",
                items: ["Content Creation & Monetization", "Collaboration with AI", "Artist Support System"]
              },
              {
                title: "5. Modern Work Opportunities",
                items: ["Decentralized Workspaces", "Skill Development", "Future-Ready Training"]
              },
              {
                title: "6. Web3 and DeFi",
                items: ["Web3 Onboarding", "Staking and Yield Farming", "NFT Integration"]
              },
              {
                title: "7. AI-Powered Growth",
                items: ["Custom AI Coaching", "AI-Driven Insights", "Smart Reminders"]
              },
              {
                title: "8. Social and Events",
                items: ["IRL Meetups & Networking", "Virtual Events & Webinars", "Live Coaching Sessions"]
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-amber-500/20 shadow-xl hover:border-amber-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-amber-300">{useCase.title}</h3>
                <ul className="space-y-2">
                  {useCase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-300 flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">Conclusion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "High Demand for Personal Development",
                items: ["Growing Interest in Self-Improvement", "Convenience of AI-Powered Assistance", "Flexible Support System"]
              },
              {
                title: "Personalized Experience",
                items: ["Tailored Assistance", "Ongoing Support", "Progress Tracking"]
              },
              {
                title: "Scalability",
                items: ["Automated Assistance", "Cost-Effective Solutions", "Sustainable Growth"]
              },
              {
                title: "Modern Technology",
                items: ["Advanced AI Integration", "Tool Integration", "Enhanced User Experience"]
              }
            ].map((conclusion, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-amber-500/20 shadow-xl hover:border-amber-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-amber-300">{conclusion.title}</h3>
                <ul className="space-y-2">
                  {conclusion.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-300 flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">Tokenomics</h2>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-amber-500/20 shadow-xl max-w-3xl mx-auto">
            <p className="text-2xl text-amber-300 text-center">Coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
