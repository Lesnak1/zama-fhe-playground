'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Code2, BookOpen, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Interactive Playground",
      description: "Experiment with FHE operations in real-time. Encrypt, compute, and decrypt data while preserving privacy."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Hub",
      description: "Step-by-step tutorials and guides to master Fully Homomorphic Encryption from basics to advanced."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Showcase",
      description: "Explore and share FHE applications built by the community. Get inspired and collaborate."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Contract Studio",
      description: "Build and deploy confidential smart contracts with our integrated development environment."
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full floating-animation" 
           style={{background: 'radial-gradient(circle, rgba(252,220,0,0.15) 0%, rgba(0,0,0,0) 70%)'}} />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full floating-animation" 
           style={{background: 'radial-gradient(circle, rgba(252,220,0,0.12) 0%, rgba(0,0,0,0) 70%)', animationDelay: '3s'}} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 pulse-glow"
           style={{background: 'radial-gradient(circle, rgba(252,220,0,0.1) 0%, transparent 70%)'}} />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 pt-20">
        <motion.div 
          className="text-center max-w-6xl mx-auto relative z-10"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-8"
            variants={fadeInUp}
          >
            <span className="text-custom-yellow glow-text">Learn FHE</span> <br />
            Build the Future of <br />
            <span className="text-custom-yellow glow-text shimmer-text">
              Private Computing
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12"
            variants={fadeInUp}
          >
            Master Fully Homomorphic Encryption with our interactive playground. 
            Build confidential smart contracts, explore privacy-preserving applications, 
            and join the revolution of encrypted computation.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
            variants={fadeInUp}
          >
            <Link 
              href="/playground"
              className="bg-custom-yellow text-black font-bold py-4 px-10 rounded-full text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 glow glow-hover pulse-glow flex items-center gap-2"
            >
              Start Playing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/learn"
              className="border-2 border-gray-700 text-white font-bold py-4 px-10 rounded-full text-lg hover:border-custom-yellow hover:text-custom-yellow transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Learn FHE
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-custom-yellow/50 transition-all duration-300 hover:transform hover:scale-105 group gradient-border floating-animation"
                variants={fadeInUp}
                style={{animationDelay: `${index * 0.5}s`}}
              >
                <div className="text-custom-yellow mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
