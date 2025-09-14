import { FHEOperation, FeatureCard } from '@/types'
import { Code2, BookOpen, Users, Zap, Lock, Calculator, Brain, Shield } from 'lucide-react'

// App Configuration
export const APP_CONFIG = {
  name: 'Zama FHE Playground',
  description: 'Interactive platform to learn and experiment with Fully Homomorphic Encryption',
  version: '1.0.0',
  githubUrl: 'https://github.com/zama-ai',
  documentationUrl: 'https://docs.zama.ai',
  discordUrl: 'https://discord.gg/zama',
  twitterUrl: 'https://twitter.com/zama_fhe',
} as const

// Theme Configuration
export const THEME = {
  colors: {
    primary: '#FCDC00',
    background: '#000000',
    foreground: '#ffffff',
    muted: '#6B7280',
    accent: '#F59E0B',
  },
  fonts: {
    primary: 'Space Grotesk',
  },
} as const

// Navigation Items
export const NAVIGATION_ITEMS = [
  { label: 'Playground', href: '/playground' },
  { label: 'Learn', href: '/learn' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Docs', href: '/docs' },
  { label: 'Examples', href: '/examples' },
] as const

// Feature Cards for Homepage
export const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Code2,
    title: 'Interactive Playground',
    description: 'Experiment with FHE operations in real-time. Encrypt, compute, and decrypt data while preserving privacy.',
    href: '/playground'
  },
  {
    icon: BookOpen,
    title: 'Learning Hub',
    description: 'Step-by-step tutorials and guides to master Fully Homomorphic Encryption from basics to advanced.',
    href: '/learn'
  },
  {
    icon: Users,
    title: 'Community Showcase',
    description: 'Explore and share FHE applications built by the community. Get inspired and collaborate.',
    href: '/showcase'
  },
  {
    icon: Zap,
    title: 'Smart Contract Studio',
    description: 'Build and deploy confidential smart contracts with our integrated development environment.',
    href: '/studio'
  }
]

// FHE Operations Configuration
export const FHE_OPERATIONS: FHEOperation[] = [
  {
    id: 'add',
    name: 'Addition',
    description: 'Add two encrypted numbers while keeping them encrypted',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'euint8',
    example: 'euint8.add(a, b)',
    gasEstimate: 5000
  },
  {
    id: 'sub',
    name: 'Subtraction',
    description: 'Subtract two encrypted numbers',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'euint8',
    example: 'euint8.sub(a, b)',
    gasEstimate: 5000
  },
  {
    id: 'mul',
    name: 'Multiplication',
    description: 'Multiply two encrypted numbers',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'euint8',
    example: 'euint8.mul(a, b)',
    gasEstimate: 15000
  },
  {
    id: 'div',
    name: 'Division',
    description: 'Divide two encrypted numbers',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'euint8',
    example: 'euint8.div(a, b)',
    gasEstimate: 25000
  },
  {
    id: 'eq',
    name: 'Equality',
    description: 'Check if two encrypted values are equal',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'ebool',
    example: 'euint8.eq(a, b)',
    gasEstimate: 8000
  },
  {
    id: 'ne',
    name: 'Not Equal',
    description: 'Check if two encrypted values are not equal',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'ebool',
    example: 'euint8.ne(a, b)',
    gasEstimate: 8000
  },
  {
    id: 'lt',
    name: 'Less Than',
    description: 'Check if first value is less than second',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'ebool',
    example: 'euint8.lt(a, b)',
    gasEstimate: 10000
  },
  {
    id: 'gt',
    name: 'Greater Than',
    description: 'Check if first value is greater than second',
    inputTypes: ['euint8', 'euint8'],
    outputType: 'ebool',
    example: 'euint8.gt(a, b)',
    gasEstimate: 10000
  },
  {
    id: 'select',
    name: 'Conditional Select',
    description: 'Select between two encrypted values based on encrypted condition',
    inputTypes: ['ebool', 'euint8', 'euint8'],
    outputType: 'euint8',
    example: 'TFHE.select(condition, a, b)',
    gasEstimate: 12000
  }
]

// Learning Difficulty Levels
export const DIFFICULTY_LEVELS = {
  beginner: {
    label: 'Beginner',
    color: '#10B981',
    description: 'New to FHE and cryptography'
  },
  intermediate: {
    label: 'Intermediate',
    color: '#F59E0B',
    description: 'Some experience with cryptography or blockchain'
  },
  advanced: {
    label: 'Advanced',
    color: '#EF4444',
    description: 'Experienced developer ready for complex topics'
  }
} as const

// Smart Contract Categories
export const CONTRACT_CATEGORIES = [
  'DeFi',
  'Gaming',
  'Healthcare',
  'Voting',
  'Identity',
  'Insurance',
  'Supply Chain',
  'Social',
  'Utility',
  'Other'
] as const

// Code Examples Languages
export const SUPPORTED_LANGUAGES = [
  { id: 'solidity', name: 'Solidity', extension: '.sol' },
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
] as const

// Animation Configurations
export const ANIMATIONS = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  WALLET_ERROR: 'Failed to connect wallet. Please try again.',
  CONTRACT_ERROR: 'Smart contract interaction failed.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CONTRACT_DEPLOYED: 'Smart contract deployed successfully!',
  WALLET_CONNECTED: 'Wallet connected successfully!',
  PROGRESS_SAVED: 'Progress saved successfully!',
  EXAMPLE_COMPLETED: 'Example completed! Well done!',
} as const
