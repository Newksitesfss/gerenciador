import { Task, TaskPriority, TaskStatus } from "../types/task";
import { v4 as uuidv4 } from 'uuid';

// Mock database
let mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Implementar CRUD de Tarefas",
    description: "Criar as funções de Create, Read, Update e Delete para as tarefas.",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // + 2 days
    priority: "high",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
  {
    id: uuidv4(),
    title: "Refatorar Componentes de Vendas",
    description: "Remover ou adaptar componentes legados do SaaS de vendas.",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // - 1 day (overdue)
    priority: "medium",
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
  {
    id: uuidv4(),
    title: "Atualizar Rodapé",
    description: "Adicionar a assinatura 'newksitesfss/_vitorkr' ao layout principal.",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // + 5 days
    priority: "low",
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
];

export const taskService = {
  // Read all tasks
  getTasks: async (): Promise<Task[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  // Create a new task
  createTask: async (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTask: Task = {
      ...newTaskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user-1", // Mock user ID
    };
    mockTasks.push(newTask);
    return newTask;
  },

  // Update an existing task
  updateTask: async (id: string, updateData: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    const updatedTask: Task = {
      ...mockTasks[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[index] = updatedTask;
    return updatedTask;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockTasks = mockTasks.filter(task => task.id !== id);
  },
};
