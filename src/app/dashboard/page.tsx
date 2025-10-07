import StatsCard from '@/components/StatsCard'
import SpendingChart from '../../components/SpendingChart'
import RecentTransactions from '../../components/RecentTransactions'
import { sampleStats, sampleTransactions, sampleBudgets } from '@/lib/sampleData'

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses } = sampleStats

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Balance" 
          value={totalBalance}
          change={8.2}
        />
        <StatsCard 
          title="Monthly Income" 
          value={totalIncome}
          change={5.1}
        />
        <StatsCard 
          title="Monthly Expenses" 
          value={totalExpenses}
          change={-3.2}
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={sampleTransactions} />
        <RecentTransactions transactions={sampleTransactions.slice(0, 5)} />
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleBudgets.map((budget) => (
            <div key={budget.id} className="text-center">
              <h3 className="font-medium text-gray-700">{budget.category}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${budget.spent} / ${budget.amount}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}