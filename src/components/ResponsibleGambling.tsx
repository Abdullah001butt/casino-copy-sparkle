
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Clock, DollarSign, Heart, Phone, AlertTriangle } from 'lucide-react';

const ResponsibleGambling = () => {
  const tools = [
    {
      icon: DollarSign,
      title: 'Deposit Limits',
      description: 'Set daily, weekly, or monthly deposit limits to control your spending.',
      action: 'Set Limits'
    },
    {
      icon: Clock,
      title: 'Session Timers',
      description: 'Get reminders about your playing time and set automatic logouts.',
      action: 'Set Timer'
    },
    {
      icon: Shield,
      title: 'Self-Exclusion',
      description: 'Take a break from gambling for a period you choose - 24 hours to 6 months.',
      action: 'Learn More'
    },
    {
      icon: Heart,
      title: 'Reality Checks',
      description: 'Regular pop-ups remind you how long you\'ve been playing and money spent.',
      action: 'Enable Alerts'
    }
  ];

  const warningSigns = [
    'Spending more money than you can afford',
    'Chasing losses with bigger bets',
    'Gambling to escape problems or feelings',
    'Lying about gambling activities',
    'Neglecting work, family, or personal care',
    'Borrowing money to gamble'
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-black border-t border-casino-gold/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-casino-neon" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Play Responsibly
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're committed to providing a safe and enjoyable gaming experience. 
            Gambling should always be fun, never a problem. Here are tools and resources to help you stay in control.
          </p>
        </div>

        {/* Responsible Gaming Tools */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tools.map((tool, index) => (
            <Card key={index} className="casino-card text-center hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-3">
                  <tool.icon className="h-12 w-12 text-casino-neon" />
                </div>
                <CardTitle className="text-lg text-white">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tool.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
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
                <CardTitle className="text-2xl text-white">Warning Signs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                If you recognize any of these signs in yourself or someone you know, it may be time to seek help:
              </p>
              <ul className="space-y-2">
                {warningSigns.map((sign, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
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
                If you need support, these organizations provide confidential help 24/7:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">National Problem Gambling Helpline</h4>
                  <p className="text-casino-neon font-mono">1-800-522-4700</p>
                  <p className="text-xs text-gray-400">24/7 confidential support</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">Gamblers Anonymous</h4>
                  <p className="text-casino-neon">www.gamblersanonymous.org</p>
                  <p className="text-xs text-gray-400">Support groups worldwide</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-casino-gold">GamCare (UK)</h4>
                  <p className="text-casino-neon">www.gamcare.org.uk</p>
                  <p className="text-xs text-gray-400">Live chat and phone support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Guidelines */}
        <div className="bg-gradient-to-r from-casino-gold/10 to-casino-neon/10 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            🎯 Healthy Gambling Guidelines
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-casino-gold text-3xl mb-2">💰</div>
              <h4 className="font-semibold text-white mb-2">Set a Budget</h4>
              <p className="text-gray-300 text-sm">Only gamble with money you can afford to lose. Never chase losses.</p>
            </div>
            <div>
              <div className="text-casino-neon text-3xl mb-2">⏰</div>
              <h4 className="font-semibold text-white mb-2">Take Breaks</h4>
              <p className="text-gray-300 text-sm">Regular breaks help maintain perspective and prevent problem gambling.</p>
            </div>
            <div>
              <div className="text-casino-neon-pink text-3xl mb-2">🎮</div>
              <h4 className="font-semibold text-white mb-2">Keep it Fun</h4>
              <p className="text-gray-300 text-sm">Gambling should be entertainment, not a way to make money or solve problems.</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center mt-8 text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
          <p className="mb-2">
            🔒 <strong>18+ Only:</strong> You must be 18 years or older to use this site. 
            Gambling can be addictive - please play responsibly.
          </p>
          <p>
            Licensed and regulated by the Malta Gaming Authority (MGA/B2C/394/2017). 
            Games are audited by eCOGRA for fair play. SSL encryption protects all transactions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleGambling;
