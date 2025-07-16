import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Clock,
  DollarSign,
  Heart,
  Phone,
  AlertTriangle,
} from "lucide-react";

const ResponsibleGambling = () => {
  const tools = [
    {
      icon: DollarSign,
      title: "Budget Management",
      description:
        "Learn how to set and stick to gambling budgets with our comprehensive guides.",
      action: "Learn Budgeting",
    },
    {
      icon: Clock,
      title: "Time Management",
      description:
        "Understand the importance of time limits and how to implement them effectively.",
      action: "Time Tips",
    },
    {
      icon: Shield,
      title: "Self-Control Strategies",
      description:
        "Discover proven techniques for maintaining control while gambling.",
      action: "Learn Strategies",
    },
    {
      icon: Heart,
      title: "Mental Health",
      description:
        "Resources for maintaining good mental health and recognizing problem signs.",
      action: "Get Resources",
    },
  ];

  const warningSigns = [
    "Spending more money than you can afford",
    "Chasing losses with bigger bets",
    "Gambling to escape problems or feelings",
    "Lying about gambling activities",
    "Neglecting work, family, or personal care",
    "Borrowing money to gamble",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-black border-t border-casino-gold/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-casino-neon" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Responsible Gambling Education
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Learn about responsible gambling practices and get the knowledge you
            need to stay safe. Education is the key to enjoying gambling
            responsibly.
          </p>
        </div>

        {/* Educational Resources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="casino-card text-center hover:scale-105 transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-3">
                  <tool.icon className="h-12 w-12 text-casino-neon" />
                </div>
                <CardTitle className="text-lg text-white">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tool.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
                  onClick={() =>
                    (window.location.href =
                      "/blog?category=responsible-gambling")
                  }
                >
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Warning Signs */}
          <Card className="casino-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <CardTitle className="text-2xl text-white">
                  Warning Signs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                If you recognize any of these signs in yourself or someone you
                know, it may be time to seek help:
              </p>
              <ul className="space-y-2">
                {warningSigns.map((sign, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-sm text-gray-300"
                  >
                    <span className="text-yellow-500 mt-1">⚠️</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Help Resources */}
          <Card className="casino-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Phone className="h-6 w-6 text-casino-neon" />
                <CardTitle className="text-2xl text-white">Get Help</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you need support, these organizations provide confidential
                help 24/7:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">
                    National Problem Gambling Helpline
                  </h4>
                  <p className="text-casino-neon font-mono">1-800-522-4700</p>
                  <p className="text-xs text-gray-400">
                    24/7 confidential support
                  </p>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">
                    National Problem Gambling Helpline
                  </h4>
                  <p className="text-casino-neon font-mono">1-800-522-4700</p>
                  <p className="text-xs text-gray-400">
                    24/7 confidential support
                  </p>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">
                    Gamblers Anonymous
                  </h4>
                  <p className="text-casino-neon">www.gamblersanonymous.org</p>
                  <p className="text-xs text-gray-400">
                    Support groups and meetings
                  </p>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">
                    National Suicide Prevention Lifeline
                  </h4>
                  <p className="text-casino-neon font-mono">988</p>
                  <p className="text-xs text-gray-400">
                    Crisis support and prevention
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-casino-neon text-black hover:bg-casino-neon/80 font-semibold"
                onClick={() =>
                  window.open("https://www.ncpgambling.org/", "_blank")
                }
              >
                Find More Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content CTA */}
        <div className="text-center bg-gradient-to-r from-casino-gold/10 to-casino-neon/10 rounded-lg p-8 border border-casino-gold/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Learn More About Responsible Gambling
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Knowledge is power. Read our comprehensive guides on responsible
            gambling practices, risk management, and maintaining a healthy
            relationship with gambling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="gold-gradient text-black font-semibold"
              onClick={() =>
                (window.location.href = "/blog?category=responsible-gambling")
              }
            >
              📚 Read Educational Articles
            </Button>
            <Button
              variant="outline"
              className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
              onClick={() =>
                (window.location.href = "/blog?search=budget+management")
              }
            >
              🎯 Budget Management Tips
            </Button>
          </div>
        </div>

        {/* Age Verification Notice */}
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            🔞 <strong>18+ Only</strong> • Gambling should be entertaining, not
            a way to make money • Never gamble more than you can afford to lose
            •<span className="text-casino-gold">BeGambleAware.org</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleGambling;
