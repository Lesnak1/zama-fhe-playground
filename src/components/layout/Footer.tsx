'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Twitter, ExternalLink, Heart } from 'lucide-react'
import { APP_CONFIG } from '@/constants'

export function Footer() {
  return (
    <motion.footer
      className="relative bg-gray-900/50 border-t border-gray-800 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-custom-yellow rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">Z</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-custom-yellow">
                  FHE Playground
                </h3>
                <p className="text-sm text-gray-400">by Zama Protocol</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Master Fully Homomorphic Encryption with our interactive platform. 
              Build the future of privacy-preserving applications.
            </p>
            <div className="flex space-x-4">
              <Link
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-custom-yellow transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href={APP_CONFIG.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-custom-yellow transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href={APP_CONFIG.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-custom-yellow transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/playground"
                  className="text-gray-400 hover:text-custom-yellow transition-colors"
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="text-gray-400 hover:text-custom-yellow transition-colors"
                >
                  Learn FHE
                </Link>
              </li>
              <li>
                <Link
                  href="/showcase"
                  className="text-gray-400 hover:text-custom-yellow transition-colors"
                >
                  Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="text-gray-400 hover:text-custom-yellow transition-colors"
                >
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={APP_CONFIG.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-custom-yellow transition-colors flex items-center gap-1"
                >
                  Documentation
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.zama.ai/fhevm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-custom-yellow transition-colors flex items-center gap-1"
                >
                  FHEVM Guide
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/zama-ai/awesome-zama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-custom-yellow transition-colors flex items-center gap-1"
                >
                  Awesome Zama
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://zama.ai/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-custom-yellow transition-colors flex items-center gap-1"
                >
                  Blog
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2024 Zama Protocol. Advancing Privacy Through Cryptography.
              </p>
              <div className="flex items-center text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
                <span>for the FHE community</span>
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm hover:text-custom-yellow transition-colors">
              <span>Built by</span>
              <Link 
                href="https://github.com/Lesnak1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-custom-yellow hover:text-yellow-300 font-semibold transition-colors"
              >
                leknax
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
