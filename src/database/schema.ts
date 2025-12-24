export const createTablesSQL = `
  -- Таблица пользовательских метрик
  CREATE TABLE IF NOT EXISTS health_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,
    value REAL NOT NULL,
    timestamp DATETIME NOT NULL,
    source TEXT DEFAULT 'simulation'
  );

  -- Таблица целей
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    target_value REAL NOT NULL,
    current_value REAL DEFAULT 0,
    deadline DATE,
    achieved BOOLEAN DEFAULT FALSE
  );

  -- Таблица рекомендаций
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Индексы для оптимизации запросов
  CREATE INDEX IF NOT EXISTS idx_metrics_type_timestamp ON health_metrics(metric_type, timestamp);
  CREATE INDEX IF NOT EXISTS idx_goals_type ON goals(type);
  CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations(category);
`;

