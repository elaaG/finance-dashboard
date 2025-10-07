-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    shares DECIMAL(15,8) NOT NULL CHECK (shares > 0),
    purchase_price DECIMAL(15,4) NOT NULL CHECK (purchase_price > 0),
    current_price DECIMAL(15,4) NOT NULL CHECK (current_price > 0),
    purchase_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('stock', 'crypto', 'etf', 'mutual-fund')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO budgets (category, amount) VALUES 
('Food', 400.00),
('Transportation', 200.00),
('Entertainment', 150.00),
('Shopping', 300.00),
('Healthcare', 100.00),
('Utilities', 250.00)
ON CONFLICT (category) DO NOTHING;

INSERT INTO transactions (amount, description, category, type, date) VALUES
(1200.00, 'Monthly Salary', 'Income', 'income', '2024-01-15'),
(65.50, 'Groceries', 'Food', 'expense', '2024-01-14'),
(45.00, 'Gas Station', 'Transportation', 'expense', '2024-01-13'),
(29.99, 'Netflix Subscription', 'Entertainment', 'expense', '2024-01-12'),
(120.00, 'Restaurant Dinner', 'Food', 'expense', '2024-01-11'),
(89.99, 'Amazon Shopping', 'Shopping', 'expense', '2024-01-10'),
(75.00, 'Electricity Bill', 'Utilities', 'expense', '2024-01-09')
ON CONFLICT DO NOTHING;

INSERT INTO investments (symbol, name, shares, purchase_price, current_price, purchase_date, type) VALUES
('AAPL', 'Apple Inc.', 10.00000000, 150.0000, 185.0000, '2024-01-10', 'stock'),
('MSFT', 'Microsoft Corporation', 5.00000000, 380.0000, 420.0000, '2024-01-15', 'stock'),
('BTC', 'Bitcoin', 0.05000000, 45000.0000, 52000.0000, '2024-01-20', 'crypto'),
('VOO', 'Vanguard S&P 500 ETF', 8.00000000, 450.0000, 470.0000, '2024-01-25', 'etf')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON investments(symbol);