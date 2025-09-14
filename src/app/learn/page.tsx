'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, CheckCircle, Play, Trophy, ArrowRight, Zap, Shield, Lock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const learningPaths = [
  {
    id: 'beginner',
    title: 'FHE Fundamentals',
    description: 'Start your journey with the basics of Fully Homomorphic Encryption',
    difficulty: 'beginner',
    modules: 4,
    duration: 60,
    icon: BookOpen,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/30'
  },
  {
    id: 'intermediate',
    title: 'Smart Contract Development',
    description: 'Build confidential smart contracts using FHEVM',
    difficulty: 'intermediate',
    modules: 6,
    duration: 120,
    icon: Zap,
    color: 'text-custom-yellow',
    bgColor: 'bg-custom-yellow/10 border-custom-yellow/30'
  },
  {
    id: 'advanced',
    title: 'Advanced FHE Applications',
    description: 'Master complex privacy-preserving applications',
    difficulty: 'advanced',
    modules: 8,
    duration: 180,
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/30'
  }
]

const modules = [
  {
    id: 1,
    title: 'What is Fully Homomorphic Encryption?',
    description: 'Understand the fundamentals of FHE and why it\'s revolutionary for privacy',
    duration: 15,
    difficulty: 'beginner',
    completed: false,
    locked: false
  },
  {
    id: 2,
    title: 'FHE vs Traditional Encryption',
    description: 'Learn the key differences and advantages of homomorphic encryption',
    duration: 20,
    difficulty: 'beginner',
    completed: false,
    locked: false
  },
  {
    id: 3,
    title: 'Basic FHE Operations',
    description: 'Explore addition, multiplication, and comparison operations on encrypted data',
    duration: 25,
    difficulty: 'beginner',
    completed: false,
    locked: false
  },
  {
    id: 4,
    title: 'TFHE Library Overview',
    description: 'Get familiar with TFHE and its JavaScript implementation',
    duration: 30,
    difficulty: 'beginner',
    completed: false,
    locked: false
  },
  {
    id: 5,
    title: 'Setting up FHEVM',
    description: 'Configure your development environment for confidential smart contracts',
    duration: 20,
    difficulty: 'intermediate',
    completed: false,
    locked: true
  },
  {
    id: 6,
    title: 'Writing Your First Confidential Contract',
    description: 'Build a simple confidential voting smart contract',
    duration: 45,
    difficulty: 'intermediate',
    completed: false,
    locked: true
  }
]

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first module', icon: Trophy, earned: false },
  { id: 2, title: 'Knowledge Seeker', description: 'Complete 5 modules', icon: BookOpen, earned: false },
  { id: 3, title: 'FHE Explorer', description: 'Complete a learning path', icon: Shield, earned: false },
]

export default function LearnPage() {
  const [_selectedPath, _setSelectedPath] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'paths' | 'modules' | 'achievements'>('paths')

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
                Learn <span className="text-custom-yellow glow-text">FHE</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Master Fully Homomorphic Encryption through interactive lessons, hands-on tutorials, 
              and real-world examples. Start your journey to building privacy-preserving applications.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-900 rounded-full p-1 border border-gray-700">
              {[
                { id: 'paths', label: 'Learning Paths', icon: BookOpen },
                { id: 'modules', label: 'All Modules', icon: Play },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-custom-yellow text-black'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Learning Paths */}
          {activeTab === 'paths' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className={cn('h-full hover:transform hover:scale-105 transition-all gradient-border glow-hover floating-animation', path.bgColor)} style={{animationDelay: `${index * 0.3}s`}}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <path.icon className={cn('w-8 h-8', path.color)} />
                        <Badge 
                          variant={path.difficulty === 'beginner' ? 'success' : path.difficulty === 'intermediate' ? 'warning' : 'destructive'}
                        >
                          {path.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 mr-2" />
                          {path.modules} modules
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          ~{path.duration} minutes
                        </div>
                        <Button className="w-full mt-4" onClick={() => _setSelectedPath(path.id)}>
                          Start Learning
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* All Modules */}
          {activeTab === 'modules' && (
            <motion.div
              className="space-y-4 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      'transition-all hover:border-custom-yellow/50',
                      module.locked && 'opacity-60',
                      module.completed && 'border-green-500/30 bg-green-500/5'
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            module.completed 
                              ? 'bg-green-500 text-white' 
                              : module.locked 
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-custom-yellow text-black'
                          )}>
                            {module.completed ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : module.locked ? (
                              <Lock className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                            <p className="text-gray-400 text-sm">{module.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {module.duration}min
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {module.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant={module.completed ? 'secondary' : 'default'} 
                          disabled={module.locked}
                          size="sm"
                        >
                          {module.completed ? 'Review' : module.locked ? 'Locked' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Achievements */}
          {activeTab === 'achievements' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className={cn(
                    'text-center h-full',
                    achievement.earned 
                      ? 'border-custom-yellow/50 bg-custom-yellow/10 glow' 
                      : 'border-gray-800 opacity-60'
                  )}>
                    <CardHeader>
                      <div className={cn(
                        'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4',
                        achievement.earned 
                          ? 'bg-custom-yellow text-black' 
                          : 'bg-gray-700 text-gray-400'
                      )}>
                        <achievement.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={achievement.earned ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {achievement.earned ? 'Earned' : 'Locked'}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Progress Stats */}
          <motion.div
            className="mt-16 bg-gray-900/50 rounded-2xl border border-gray-800 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Learning Progress</h2>
              <p className="text-gray-400">Track your journey to becoming an FHE expert</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-custom-yellow">0</div>
                <div className="text-sm text-gray-400">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-custom-yellow">0h</div>
                <div className="text-sm text-gray-400">Time Spent Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-custom-yellow">0</div>
                <div className="text-sm text-gray-400">Achievements Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-custom-yellow">0%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
