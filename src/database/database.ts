import * as SQLite from 'expo-sqlite';
import { createTablesSQL } from './schema';
import { HealthMetric, Goal, Recommendation } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('healthtracker.db');
  await db.execAsync(createTablesSQL);
  return db;
};

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    return await initDatabase();
  }
  return db;
};

// Health Metrics CRUD
export const insertHealthMetric = async (metric: HealthMetric): Promise<number> => {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO health_metrics (metric_type, value, timestamp, source) VALUES (?, ?, ?, ?)',
    [metric.metric_type, metric.value, metric.timestamp.toString(), metric.source || 'simulation']
  );
  return result.lastInsertRowId;
};

export const getHealthMetrics = async (
  metricType?: string,
  startDate?: Date,
  endDate?: Date
): Promise<HealthMetric[]> => {
  const database = await getDatabase();
  
  let query = 'SELECT * FROM health_metrics WHERE 1=1';
  const params: any[] = [];

  if (metricType) {
    query += ' AND metric_type = ?';
    params.push(metricType);
  }

  if (startDate) {
    query += ' AND timestamp >= ?';
    params.push(startDate.toISOString());
  }

  if (endDate) {
    query += ' AND timestamp <= ?';
    params.push(endDate.toISOString());
  }

  query += ' ORDER BY timestamp DESC';

  const result = await database.getAllAsync(query, params) as any[];
  return result.map(row => ({
    ...row,
    timestamp: new Date(row.timestamp as string),
  })) as HealthMetric[];
};

export const getLatestHealthMetric = async (metricType: string): Promise<HealthMetric | null> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync(
    'SELECT * FROM health_metrics WHERE metric_type = ? ORDER BY timestamp DESC LIMIT 1',
    [metricType]
  ) as any;
  
  if (!result) return null;
  
  return {
    ...result,
    timestamp: new Date(result.timestamp as string),
  } as HealthMetric;
};

export const deleteHealthMetric = async (id: number): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM health_metrics WHERE id = ?', [id]);
};

// Goals CRUD
export const insertGoal = async (goal: Goal): Promise<number> => {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO goals (type, target_value, current_value, deadline, achieved) VALUES (?, ?, ?, ?, ?)',
    [
      goal.type,
      goal.target_value,
      goal.current_value || 0,
      goal.deadline?.toString() || null,
      goal.achieved ? 1 : 0,
    ]
  );
  return result.lastInsertRowId;
};

export const getGoals = async (): Promise<Goal[]> => {
  const database = await getDatabase();
  const result = await database.getAllAsync(
    'SELECT * FROM goals ORDER BY type'
  ) as any[];
  
  return result.map(row => ({
    ...row,
    deadline: row.deadline ? new Date(row.deadline as string) : null,
    achieved: Boolean(row.achieved),
  })) as Goal[];
};

export const updateGoal = async (id: number, updates: Partial<Goal>): Promise<void> => {
  const database = await getDatabase();
  const updatesList: string[] = [];
  const params: any[] = [];

  if (updates.current_value !== undefined) {
    updatesList.push('current_value = ?');
    params.push(updates.current_value);
  }

  if (updates.achieved !== undefined) {
    updatesList.push('achieved = ?');
    params.push(updates.achieved ? 1 : 0);
  }

  if (updatesList.length === 0) return;

  params.push(id);
  await database.runAsync(
    `UPDATE goals SET ${updatesList.join(', ')} WHERE id = ?`,
    params
  );
};

export const deleteGoal = async (id: number): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM goals WHERE id = ?', [id]);
};

// Recommendations CRUD
export const insertRecommendation = async (recommendation: Recommendation): Promise<number> => {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO recommendations (title, description, category, priority, completed, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      recommendation.title,
      recommendation.description,
      recommendation.category,
      recommendation.priority,
      recommendation.completed ? 1 : 0,
      recommendation.created_at?.toString() || new Date().toISOString(),
    ]
  );
  return result.lastInsertRowId;
};

export const getRecommendations = async (completed?: boolean): Promise<Recommendation[]> => {
  const database = await getDatabase();
  
  let query = 'SELECT * FROM recommendations';
  const params: any[] = [];

  if (completed !== undefined) {
    query += ' WHERE completed = ?';
    params.push(completed ? 1 : 0);
  }

  query += ' ORDER BY priority DESC, created_at DESC';

  const result = await database.getAllAsync(query, params) as any[];
  
  return result.map(row => ({
    ...row,
    completed: Boolean(row.completed),
    created_at: new Date(row.created_at as string),
  })) as Recommendation[];
};

export const updateRecommendation = async (id: number, completed: boolean): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE recommendations SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );
};

export const deleteRecommendation = async (id: number): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM recommendations WHERE id = ?', [id]);
};

export const clearAllRecommendations = async (): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM recommendations');
};

