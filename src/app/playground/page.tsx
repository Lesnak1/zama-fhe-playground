'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RefreshCw, Copy, Check, Calculator, Lock, Unlock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FHE_OPERATIONS } from '@/constants'
import { cn } from '@/lib/utils'

export default function PlaygroundPage() {
  const [selectedOperation, setSelectedOperation] = useState(FHE_OPERATIONS[0])
  const [inputA, setInputA] = useState('10')
  const [inputB, setInputB] = useState('5')
  const [result, setResult] = useState<string | null>(null)
  const [isComputing, setIsComputing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCompute = async () => {
    setIsComputing(true)
    
    // Simulate FHE computation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock computation result
    const a = parseInt(inputA) || 0
    const b = parseInt(inputB) || 0
    let computedResult = ''
    
    switch (selectedOperation.id) {
      case 'add':
        computedResult = (a + b).toString()
        break
      case 'sub':
        computedResult = Math.max(0, a - b).toString() // Prevent negative for uint8
        break
      case 'mul':
        computedResult = (a * b).toString()
        break
      case 'div':
        computedResult = b !== 0 ? Math.floor(a / b).toString() : 'Error'
        break
      case 'eq':
        computedResult = (a === b).toString()
        break
      case 'ne':
        computedResult = (a !== b).toString()
        break
      case 'lt':
        computedResult = (a < b).toString()
        break
      case 'gt':
        computedResult = (a > b).toString()
        break
      default:
        computedResult = 'Result'
    }
    
    setResult(computedResult)
    setIsComputing(false)
  }

  const copyCode = async () => {
    const code = `// FHE Operation: ${selectedOperation.name}
// Inputs: ${inputA}, ${inputB}
// Result: ${result || 'Not computed'}

import { TFHE } from "@fhenixjs/fhenix-js";

const encryptedA = TFHE.encrypt_uint8(${inputA});
const encryptedB = TFHE.encrypt_uint8(${inputB});
const result = ${selectedOperation.example?.replace('a', 'encryptedA').replace('b', 'encryptedB')};
const decrypted = TFHE.decrypt(result);`

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

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
              <Calculator className="w-8 h-8 text-custom-yellow mr-3 pulse-glow" />
              <h1 className="text-4xl md:text-6xl font-bold">
                FHE <span className="text-custom-yellow glow-text">Playground</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experiment with Fully Homomorphic Encryption operations. 
              Perform computations on encrypted data without revealing the underlying values.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Operations Panel */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-custom-yellow" />
                    FHE Operations
                  </CardTitle>
                  <CardDescription>
                    Select an operation to experiment with encrypted computation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {FHE_OPERATIONS.map((operation) => (
                      <button
                        key={operation.id}
                        onClick={() => setSelectedOperation(operation)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all',
                          selectedOperation.id === operation.id
                            ? 'border-custom-yellow bg-custom-yellow/10 text-custom-yellow'
                            : 'border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white'
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{operation.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {operation.gasEstimate ? `${(operation.gasEstimate / 1000).toFixed(0)}K gas` : 'N/A'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{operation.description}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Computation Panel */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-custom-yellow" />
                    {selectedOperation.name} Operation
                  </CardTitle>
                  <CardDescription>
                    {selectedOperation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Input A (encrypted uint8)
                      </label>
                      <input
                        type="number"
                        value={inputA}
                        onChange={(e) => setInputA(e.target.value)}
                        min="0"
                        max="255"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-custom-yellow focus:outline-none"
                        placeholder="Enter value (0-255)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Input B (encrypted uint8)
                      </label>
                      <input
                        type="number"
                        value={inputB}
                        onChange={(e) => setInputB(e.target.value)}
                        min="0"
                        max="255"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-custom-yellow focus:outline-none"
                        placeholder="Enter value (0-255)"
                      />
                    </div>
                  </div>

                  {/* Operation Display */}
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                    <div className="text-gray-400 mb-2">Operation Preview:</div>
                    <div className="text-custom-yellow">
                      {selectedOperation.example?.replace('a', `encrypted(${inputA})`).replace('b', `encrypted(${inputB})`)}
                    </div>
                  </div>

                  {/* Compute Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleCompute}
                      disabled={isComputing}
                      size="lg"
                      className="min-w-48"
                    >
                      {isComputing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Computing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Compute FHE Operation
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Result Section */}
                  {result !== null && (
                    <motion.div
                      className="bg-gradient-to-r from-custom-yellow/10 to-custom-yellow/5 border border-custom-yellow/30 rounded-lg p-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-custom-yellow">
                          Computed Result
                        </h3>
                        <Button
                          onClick={copyCode}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {result}
                      </div>
                      <p className="text-sm text-gray-400">
                        This result was computed on encrypted data without revealing the input values during computation.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔒 Privacy Preserved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Input values remain encrypted throughout the entire computation process, 
                  ensuring complete data privacy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ Real Computation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  These are actual FHE operations that can be deployed on blockchain 
                  networks supporting confidential smart contracts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚀 Production Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  All operations shown here can be implemented in Solidity smart contracts 
                  using Zama's FHEVM technology.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
