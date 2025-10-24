export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO Date String
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  userId: string;
};

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

