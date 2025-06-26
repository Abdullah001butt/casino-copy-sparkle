
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Crown, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Casino Games',
      links: ['Slot Machines', 'Table Games', 'Live Casino', 'Jackpot Games', 'New Releases']
    },
    {
      title: 'Sports Betting',
      links: ['Football', 'Basketball', 'Tennis', 'Esports', 'Live Betting']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact Us', 'Live Chat', 'Payment Methods', 'Game Rules']
    },
    {
      title: 'About',
      links: ['About Us', 'Careers', 'Affiliates', 'News', 'Sponsorships']
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ];

  return (
    <footer className="bg-black border-t border-casino-gold/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="h-8 w-8 text-casino-gold" />
              <span className="text-2xl font-bold gold-gradient bg-clip-text text-transparent">
                Royal Casino
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The premier destination for online casino gaming and sports betting. 
              Licensed, secure, and trusted by players worldwide since 2018.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@royalcasino.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Malta Gaming Authority Licensed</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-casino-gold transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-casino-gold/20" />

        {/* Social Media & Bottom Info */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="bg-gray-800 hover:bg-casino-gold hover:text-black p-2 rounded-full transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-casino-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-casino-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-casino-gold transition-colors">Responsible Gambling</a>
            <a href="#" className="hover:text-casino-gold transition-colors">Cookie Policy</a>
          </div>
        </div>

        <Separator className="my-6 bg-casino-gold/20" />

        {/* License & Certification Info */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">🔒 SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">🎰 Fair Play Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">✅ eCOGRA Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">🏛️ MGA Licensed</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
            <p className="mb-2">
              Royal Casino is operated by Gaming Excellence Ltd, licensed and regulated by the Malta Gaming Authority 
              under license MGA/B2C/394/2017. Registered address: Suite 15, Regent House, Bisazza Street, Sliema SLM 1640, Malta.
            </p>
            <p>
              © 2024 Royal Casino. All rights reserved. • 18+ only • Gambling can be addictive, please play responsibly • 
              BeGambleAware.org
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
