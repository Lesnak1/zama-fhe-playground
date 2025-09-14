'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Github, ExternalLink, Heart, Filter, Search, Star, Calendar, Code } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const categories = ['All', 'DeFi', 'Gaming', 'Healthcare', 'Voting', 'Identity', 'Utility']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const showcaseProjects = [
  {
    id: 1,
    title: 'Fhenix Hardhat Template',
    description: 'Official hardhat template for building confidential smart contracts on Fhenix network',
    author: 'Fhenix Protocol',
    category: 'Utility',
    difficulty: 'Beginner',
    tags: ['Hardhat', 'Template', 'Fhenix'],
    votes: 187,
    githubUrl: 'https://github.com/fhenixprotocol/fhenix-hardhat-example',
    demoUrl: 'https://docs.fhenix.zone',
    featured: true,
    createdAt: '2024-03-15',
    image: '/api/placeholder/400/200'
  },
  {
    id: 2,
    title: 'TFHE-rs Rust Library',
    description: 'Pure Rust implementation of TFHE for fast homomorphic encryption',
    author: 'Zama Team',
    category: 'Utility',
    difficulty: 'Advanced',
    tags: ['Rust', 'TFHE', 'Library'],
    votes: 342,
    githubUrl: 'https://github.com/zama-ai/tfhe-rs',
    demoUrl: 'https://docs.zama.ai/tfhe-rs',
    featured: true,
    createdAt: '2024-02-20',
    image: '/api/placeholder/400/200'
  },
  {
    id: 3,
    title: 'Concrete ML',
    description: 'Privacy-preserving machine learning framework using FHE',
    author: 'Zama Team',
    category: 'Healthcare',
    difficulty: 'Advanced',
    tags: ['ML', 'Privacy', 'Healthcare'],
    votes: 298,
    githubUrl: 'https://github.com/zama-ai/concrete-ml',
    demoUrl: 'https://docs.zama.ai/concrete-ml',
    featured: false,
    createdAt: '2024-01-10',
    image: '/api/placeholder/400/200'
  },
  {
    id: 4,
    title: 'fhEVM Solidity Library',
    description: 'Solidity library for writing confidential smart contracts with TFHE',
    author: 'Zama Team',
    category: 'DeFi',
    difficulty: 'Intermediate',
    tags: ['Solidity', 'Smart Contracts', 'TFHE'],
    votes: 256,
    githubUrl: 'https://github.com/zama-ai/fhevm',
    demoUrl: 'https://docs.zama.ai/fhevm',
    featured: false,
    createdAt: '2024-03-01',
    image: '/api/placeholder/400/200'
  },
  {
    id: 5,
    title: 'Blind Auction dApp',
    description: 'Sealed-bid auction system with complete bid privacy using FHEVM',
    author: 'FHE Builders',
    category: 'DeFi',
    difficulty: 'Intermediate',
    tags: ['Auction', 'DeFi', 'Privacy'],
    votes: 134,
    githubUrl: 'https://github.com/zama-ai/fhevm-contracts',
    featured: false,
    createdAt: '2024-02-15',
    image: '/api/placeholder/400/200'
  },
  {
    id: 6,
    title: 'Encrypted ERC20 Token',
    description: 'ERC20 token with encrypted balances and private transfers',
    author: 'DeFi Privacy Labs',
    category: 'DeFi',
    difficulty: 'Advanced',
    tags: ['ERC20', 'Privacy', 'Tokens'],
    votes: 178,
    githubUrl: 'https://github.com/zama-ai/fhevm-contracts',
    demoUrl: 'https://fhevm-erc20-demo.netlify.app',
    featured: false,
    createdAt: '2024-01-25',
    image: '/api/placeholder/400/200'
  },
  {
    id: 7,
    title: 'Private Healthcare Records',
    description: 'Patient data management system with encrypted medical records',
    author: 'MedTech Innovations',
    category: 'Healthcare',
    difficulty: 'Advanced',
    tags: ['Healthcare', 'Records', 'HIPAA'],
    votes: 92,
    githubUrl: 'https://github.com/zama-ai/awesome-zama',
    featured: false,
    createdAt: '2024-02-08',
    image: '/api/placeholder/400/200'
  },
  {
    id: 8,
    title: 'Confidential Voting DAO',
    description: 'Decentralized governance with encrypted votes and transparent results',
    author: 'DAO Builders',
    category: 'Voting',
    difficulty: 'Intermediate',
    tags: ['DAO', 'Governance', 'Voting'],
    votes: 145,
    githubUrl: 'https://github.com/zama-ai/fhevm-decryption-in-solidity',
    featured: false,
    createdAt: '2024-01-30',
    image: '/api/placeholder/400/200'
  }
]

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes')

  const filteredProjects = showcaseProjects
    .filter(project => {
      const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory
      const difficultyMatch = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty
      const searchMatch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return categoryMatch && difficultyMatch && searchMatch
    })
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return b.votes - a.votes
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const featuredProjects = filteredProjects.filter(p => p.featured)

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
              <Users className="w-8 h-8 text-custom-yellow mr-3 pulse-glow" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Community <span className="text-custom-yellow glow-text">Showcase</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover amazing applications built by the FHE community. 
              Get inspired, learn from others, and showcase your own projects.
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-custom-yellow focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-custom-yellow focus:outline-none"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'votes' | 'date')}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-custom-yellow focus:outline-none"
                >
                  <option value="votes">Most Popular</option>
                  <option value="date">Most Recent</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-custom-yellow focus:outline-none w-64"
                />
              </div>
            </div>
          </motion.div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-custom-yellow" />
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.slice(0, 2).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="h-full hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105 group gradient-border glow-hover">
                      <div className="aspect-video bg-gray-800 rounded-t-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-custom-yellow/20 to-custom-yellow/5 flex items-center justify-center">
                          <Code className="w-16 h-16 text-custom-yellow/60" />
                        </div>
                        <Badge className="absolute top-4 right-4 bg-custom-yellow/20 border-custom-yellow/50">
                          Featured
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{project.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Heart className="w-4 h-4" />
                            {project.votes}
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-custom-yellow transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-400">
                            by {project.author}
                          </div>
                          <Badge 
                            variant={project.difficulty === 'Beginner' ? 'success' : project.difficulty === 'Intermediate' ? 'warning' : 'destructive'}
                          >
                            {project.difficulty}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </Link>
                          </Button>
                          {project.demoUrl && (
                            <Button size="sm" className="flex-1" asChild>
                              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Demo
                              </Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Projects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              All Projects ({filteredProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                >
                  <Card className="h-full hover:border-custom-yellow/50 transition-all hover:transform hover:scale-105 group gradient-border glow-hover floating-animation" style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="aspect-video bg-gray-800 rounded-t-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Code className="w-12 h-12 text-gray-600" />
                      </div>
                      {project.featured && (
                        <Badge className="absolute top-3 right-3 bg-custom-yellow/20 border-custom-yellow/50 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">{project.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Heart className="w-3 h-3" />
                          {project.votes}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-custom-yellow transition-colors line-clamp-1">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-400">
                          by {project.author}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3 mr-1" />
                            Code
                          </Link>
                        </Button>
                        {project.demoUrl && (
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">
                  Try adjusting your search criteria or browse all projects
                </p>
              </div>
            )}
          </motion.div>

          {/* Submit Project CTA */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-custom-yellow/10 to-custom-yellow/5 border border-custom-yellow/30 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Share Your FHE Project
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Built something amazing with FHE? Share it with the community! 
              Get feedback, inspire others, and become part of the privacy revolution.
            </p>
            <Button size="lg" asChild>
              <Link href="https://github.com/zama-ai" target="_blank" rel="noopener noreferrer">
                Submit Your Project
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
