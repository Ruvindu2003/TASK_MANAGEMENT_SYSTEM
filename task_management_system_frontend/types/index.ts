export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  userId: string;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSummary {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  categoryId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  categoryId?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  categoryId?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status';
  sortOrder?: 'ASC' | 'DESC';
}
