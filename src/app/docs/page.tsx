'use client'

import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, FileText, Video, Code, MessageCircle, Github, Star } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const resourceCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Essential resources to begin your FHE journey',
    resources: [
      {
        title: 'What is FHE?',
        description: 'Introduction to Fully Homomorphic Encryption concepts',
        type: 'documentation',
        url: 'https://docs.zama.ai/fhe-101',
        external: true
      },
      {
        title: 'FHEVM Overview',
        description: 'Understanding the FHE Virtual Machine',
        type: 'documentation',
        url: 'https://docs.zama.ai/fhevm',
        external: true
      },
      {
        title: 'Quick Start Guide',
        description: 'Build your first FHE application in 10 minutes',
        type: 'tutorial',
        url: 'https://docs.zama.ai/fhevm/quickstart',
        external: true
      },
      {
        title: 'Development Environment Setup',
        description: 'Configure your workspace for FHE development',
        type: 'tutorial',
        url: 'https://docs.zama.ai/fhevm/getting-started/setup',
        external: true
      }
    ]
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contract Development',
    description: 'Build confidential smart contracts with FHEVM',
    resources: [
      {
        title: 'TFHE Solidity Library',
        description: 'Complete reference for FHE operations in Solidity',
        type: 'documentation',
        url: 'https://docs.zama.ai/fhevm/references/functions',
        external: true
      },
      {
        title: 'Writing Confidential Contracts',
        description: 'Best practices for FHE smart contract development',
        type: 'tutorial',
        url: 'https://docs.zama.ai/fhevm/tutorials',
        external: true
      },
      {
        title: 'Gas Optimization',
        description: 'Optimize gas costs for FHE operations',
        type: 'guide',
        url: 'https://docs.zama.ai/fhevm/guides/gas',
        external: true
      },
      {
        title: 'Testing FHE Contracts',
        description: 'Unit testing strategies for confidential smart contracts',
        type: 'tutorial',
        url: 'https://docs.zama.ai/fhevm/guides/testing',
        external: true
      }
    ]
  },
  {
    id: 'client-side',
    title: 'Client-Side Development',
    description: 'Integrate FHE into your frontend applications',
    resources: [
      {
        title: 'fhEVM.js SDK',
        description: 'JavaScript library for FHE client interactions',
        type: 'documentation',
        url: 'https://docs.zama.ai/fhevm/sdk/javascript',
        external: true
      },
      {
        title: 'Encryption & Decryption',
        description: 'Handle encrypted data in your web applications',
        type: 'tutorial',
        url: 'https://docs.zama.ai/fhevm/guides/encryption',
        external: true
      },
      {
        title: 'Wallet Integration',
        description: 'Connect FHE applications with crypto wallets',
        type: 'guide',
        url: 'https://docs.zama.ai/fhevm/guides/wallet',
        external: true
      },
      {
        title: 'React.js Examples',
        description: 'Sample React applications using FHE',
        type: 'examples',
        url: 'https://github.com/zama-ai/fhevm-react-template',
        external: true
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Deep dive into FHE protocols and optimization',
    resources: [
      {
        title: 'TFHE Deep Dive',
        description: 'Understanding the underlying TFHE cryptographic scheme',
        type: 'documentation',
        url: 'https://docs.zama.ai/tfhe-rs',
        external: true
      },
      {
        title: 'Custom Gates & Circuits',
        description: 'Implement custom FHE operations and circuits',
        type: 'tutorial',
        url: 'https://docs.zama.ai/concrete',
        external: true
      },
      {
        title: 'Performance Benchmarking',
        description: 'Measure and optimize FHE application performance',
        type: 'guide',
        url: 'https://docs.zama.ai/fhevm/guides/performance',
        external: true
      },
      {
        title: 'Security Best Practices',
        description: 'Ensure the security of your FHE implementations',
        type: 'guide',
        url: 'https://docs.zama.ai/fhevm/security',
        external: true
      }
    ]
  }
]

const communityResources = [
  {
    title: 'Discord Community',
    description: 'Join thousands of developers building with FHE',
    icon: MessageCircle,
    url: 'https://discord.gg/zama',
    buttonText: 'Join Discord'
  },
  {
    title: 'GitHub Repository',
    description: 'Explore source code, examples, and contribute',
    icon: Github,
    url: 'https://github.com/zama-ai',
    buttonText: 'View GitHub'
  },
  {
    title: 'Video Tutorials',
    description: 'Watch comprehensive FHE development tutorials',
    icon: Video,
    url: 'https://www.youtube.com/@zama_fhe',
    buttonText: 'Watch Videos'
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'documentation':
      return <FileText className="w-4 h-4" />
    case 'tutorial':
      return <BookOpen className="w-4 h-4" />
    case 'examples':
      return <Code className="w-4 h-4" />
    case 'guide':
      return <Star className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'documentation':
      return 'secondary'
    case 'tutorial':
      return 'default'
    case 'examples':
      return 'outline'
    case 'guide':
      return 'success'
    default:
      return 'secondary'
  }
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <Header />
      
      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-custom-yellow mr-3 pulse-glow" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-custom-yellow glow-text">Documentation</span> & Resources
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to build privacy-preserving applications with Fully Homomorphic Encryption.
              From beginner guides to advanced cryptographic concepts.
            </p>
          </motion.div>

          {/* Quick Access Links */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-custom-yellow/10 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-custom-yellow" />
                </div>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Get up and running with FHE in minutes
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://docs.zama.ai/fhevm/quickstart" target="_blank" rel="noopener noreferrer">
                    Start Building
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-custom-yellow/10 rounded-lg flex items-center justify-center mb-3">
                  <Code className="w-6 h-6 text-custom-yellow" />
                </div>
                <CardTitle className="text-lg">API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Complete TFHE function reference
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://docs.zama.ai/fhevm/references" target="_blank" rel="noopener noreferrer">
                    Browse API
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-custom-yellow/10 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-custom-yellow" />
                </div>
                <CardTitle className="text-lg">Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Step-by-step guides and examples
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://docs.zama.ai/fhevm/tutorials" target="_blank" rel="noopener noreferrer">
                    Learn More
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-custom-yellow/10 rounded-lg flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-custom-yellow" />
                </div>
                <CardTitle className="text-lg">Get Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Join our community for support
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://discord.gg/zama" target="_blank" rel="noopener noreferrer">
                    Join Discord
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resource Categories */}
          <div className="space-y-16">
            {resourceCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">{category.title}</h2>
                  <p className="text-lg text-gray-400">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <motion.div
                      key={resourceIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + resourceIndex * 0.05 }}
                    >
                      <Card className="h-full hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105 group">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-custom-yellow">
                              {getTypeIcon(resource.type)}
                              <Badge variant={getTypeBadgeVariant(resource.type)} className="text-xs">
                                {resource.type}
                              </Badge>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-custom-yellow transition-colors" />
                          </div>
                          <CardTitle className="text-lg group-hover:text-custom-yellow transition-colors">
                            {resource.title}
                          </CardTitle>
                          <CardDescription>
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Read More
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Resources */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Community & Support</h2>
              <p className="text-lg text-gray-400">
                Connect with other developers and get help from the Zama team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {communityResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="text-center h-full hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105">
                    <CardHeader>
                      <div className="w-16 h-16 bg-custom-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <resource.icon className="w-8 h-8 text-custom-yellow" />
                      </div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" asChild>
                        <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.buttonText}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            className="mt-16 bg-gray-900/50 rounded-2xl border border-gray-800 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Still Need Help?</h2>
              <p className="text-gray-400">
                Can't find what you're looking for? Here are additional resources to help you succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <Link href="https://zama.ai/blog" target="_blank" rel="noopener noreferrer">
                  <FileText className="w-5 h-5" />
                  <span>Technical Blog</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <Link href="https://github.com/zama-ai/awesome-zama" target="_blank" rel="noopener noreferrer">
                  <Star className="w-5 h-5" />
                  <span>Awesome Zama</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <Link href="https://zama.ai/bounty-program" target="_blank" rel="noopener noreferrer">
                  <Star className="w-5 h-5" />
                  <span>Bounty Program</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <Link href="https://zama.ai/support" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Support</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
