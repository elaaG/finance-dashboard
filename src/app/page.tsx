import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Take Control of Your Finances
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track your income, manage expenses, set budgets, and watch your savings grow 
          with our intuitive personal finance dashboard.
        </p>
        
        <div className="flex justify-center space-x-4 mb-12">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/transactions"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View Demo
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Spending</h3>
            <p className="text-gray-600">Monitor your expenses and income with detailed categorization</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Set Budgets</h3>
            <p className="text-gray-600">Create and manage budgets to achieve your financial goals</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Insights</h3>
            <p className="text-gray-600">Get instant visualizations of your financial health</p>
          </div>
        </div>
      </div>
    </div>
  )
}