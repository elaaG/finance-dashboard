import { formatCurrency } from '@/lib/utils'

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  type?: 'currency' | 'percentage';
}

export default function StatsCard({ title, value, change, type = 'currency' }: StatsCardProps) {
  const isPositive = change && change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {type === 'currency' ? formatCurrency(value) : `${value}%`}
        </span>
        
        {change !== undefined && (
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      
      {change !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}