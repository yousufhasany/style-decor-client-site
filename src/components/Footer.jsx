import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <span className="text-lg font-black text-white">S</span>
              </div>
              <span className="text-lg font-bold">StyleDecor</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforming spaces into extraordinary experiences with creative decoration solutions.
            </p>
            <div className="flex gap-2 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">
                📘
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">
                📸
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">
                🐦
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                   Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                   Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                   About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                   Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold mb-3 text-white">Our Services</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                <span>Wedding Decoration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400">•</span>
                <span>Birthday Parties</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                <span>Corporate Events</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400">•</span>
                <span>Interior Design</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                <span>Outdoor Events</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold mb-3 text-white">Contact Us</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">📧</span>
                <span>info@styledecor.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">📱</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">📍</span>
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">⏰</span>
                <span>Mon - Sat: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} StyleDecor. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
