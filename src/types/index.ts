// Core FHE Types
export interface FHEOperation {
  id: string
  name: string
  description: string
  inputTypes: string[]
  outputType: string
  example?: string
  gasEstimate?: number
}

export interface EncryptedData {
  value: string
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool'
  encrypted: boolean
}

export interface FHEExample {
  id: string
  title: string
  description: string
  code: string
  language: 'solidity' | 'javascript' | 'typescript'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  category: 'arithmetic' | 'comparison' | 'conditional' | 'custom'
}

export interface LearningModule {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // minutes
  topics: string[]
  prerequisites?: string[]
  content: LearningContent[]
  quiz?: Quiz
}

export interface LearningContent {
  type: 'text' | 'code' | 'interactive' | 'video'
  title: string
  content: string
  code?: string
  language?: string
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'code'
  options?: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface UserProgress {
  userId: string
  completedModules: string[]
  completedExamples: string[]
  scores: { [moduleId: string]: number }
  badges: string[]
  totalTimeSpent: number
}

export interface ShowcaseProject {
  id: string
  title: string
  description: string
  author: string
  githubUrl?: string
  demoUrl?: string
  tags: string[]
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  votes: number
  createdAt: Date
  updatedAt: Date
  featured?: boolean
}

export interface SmartContractTemplate {
  id: string
  name: string
  description: string
  code: string
  language: 'solidity'
  category: string
  gasEstimate: number
  fheOperations: string[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// UI Component Types
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href?: string
}

// Theme and Styling
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  foreground: string
  muted: string
  accent: string
}

// Blockchain Types
export interface WalletConnection {
  address: string
  chainId: number
  isConnected: boolean
  provider?: any
}

export interface ContractDeployment {
  address: string
  transactionHash: string
  blockNumber: number
  gasUsed: number
  status: 'pending' | 'success' | 'failed'
}
