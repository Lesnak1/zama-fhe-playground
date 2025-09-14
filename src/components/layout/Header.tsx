'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Github, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAVIGATION_ITEMS, APP_CONFIG } from '@/constants'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/50' 
            : 'bg-transparent',
          className
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJZFPCpl6hWIs9mdq2LpcfGYLGQVosq8YHJubwSR2unTz9AFn_CHZ1hNBLLh9I2UJse6YN6PIGoJh6a7-vuQZsCRmG6xX6eW_RL58MpSE3pUd3OQCgESqH5NiOwc4mtpcz1ARS--DwfkiLz2CH0v_To0pQWamlhLQqDcpsZd5MXImF0vJSTzEevg1z3m1-uTsD9TafY0aJMS0OTRImutoPk0c5BHiR_lls2RfMCs92zwbFTPpiJRLLaNJB2lr16YoPxoE6zc7ahdg"
                  alt="Zama logo"
                  width={40}
                  height={40}
                  className="rounded-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-lg bg-custom-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity glow" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-custom-yellow">
                  FHE Playground
                </span>
                <p className="text-xs text-gray-400 -mt-1">by Zama</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-custom-yellow',
                    pathname === item.href
                      ? 'text-custom-yellow'
                      : 'text-gray-300'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={APP_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={APP_CONFIG.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Docs
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-custom-yellow p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-16 sm:top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-4">
                  {NAVIGATION_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'block text-lg font-medium py-3 px-4 rounded-lg transition-colors',
                          pathname === item.href
                            ? 'text-custom-yellow bg-gray-800/50'
                            : 'text-gray-300 hover:text-custom-yellow hover:bg-gray-800/30'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link
                        href={APP_CONFIG.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link
                        href={APP_CONFIG.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Docs
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
