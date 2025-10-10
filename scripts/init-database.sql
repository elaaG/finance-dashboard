-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (updated version)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for OAuth)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON investments(symbol);

-- Insert demo user for testing
INSERT INTO users (email, name, password_hash)
VALUES ('demo@example.com', 'Demo User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPVqMZbK3oBhG')
ON CONFLICT (email) DO NOTHING;

-- Insert sample budgets
INSERT INTO budgets (category, amount)
VALUES 
('Food', 400.00),
('Transportation', 200.00),
('Entertainment', 150.00),
('Shopping', 300.00),
('Healthcare', 100.00),
('Utilities', 250.00)
ON CONFLICT (category) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (amount, description, category, type, date)
VALUES
(1200.00, 'Monthly Salary', 'Income', 'income', '2024-01-15'),
(65.50, 'Groceries', 'Food', 'expense', '2024-01-14'),
(45.00, 'Gas Station', 'Transportation', 'expense', '2024-01-13'),
(29.99, 'Netflix Subscription', 'Entertainment', 'expense', '2024-01-12'),
(120.00, 'Restaurant Dinner', 'Food', 'expense', '2024-01-11'),
(89.99, 'Amazon Shopping', 'Shopping', 'expense', '2024-01-10'),
(75.00, 'Electricity Bill', 'Utilities', 'expense', '2024-01-09')
ON CONFLICT DO NOTHING;

-- Insert sample investments
INSERT INTO investments (symbol, name, shares, purchase_price, current_price, purchase_date, type)
VALUES
('AAPL', 'Apple Inc.', 10.00000000, 150.0000, 185.0000, '2024-01-10', 'stock'),
('MSFT', 'Microsoft Corporation', 5.00000000, 380.0000, 420.0000, '2024-01-15', 'stock'),
('BTC', 'Bitcoin', 0.05000000, 45000.0000, 52000.0000, '2024-01-20', 'crypto'),
('VOO', 'Vanguard S&P 500 ETF', 8.00000000, 450.0000, 470.0000, '2024-01-25', 'etf')
ON CONFLICT DO NOTHING;
