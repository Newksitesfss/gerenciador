"use client";

import { useEffect, useState } from "react";
import { taskService } from "@/lib/taskService";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "./TaskDialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Clock, Edit, List, Loader2, Plus, Trash } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Filter = TaskStatus | 'all';

const statusMap: Record<TaskStatus, string> = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  done: "Concluída",
};

const priorityMap: Record<TaskPriority, { label: string, color: 'default' | 'secondary' | 'destructive' }> = {
  low: { label: "Baixa", color: 'default' },
  medium: { label: "Média", color: 'secondary' },
  high: { label: "Alta", color: 'destructive' },
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const loadTasks = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const loadedTasks = await taskService.getTasks();
    setTasks(loadedTasks);
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Não mostra o loading global para uma mudança de status rápida
    const originalTasks = tasks;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const updatedTask = await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t)); // Atualiza com a resposta do serviço para garantir consistência
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setTasks(originalTasks); // Reverte em caso de erro
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
      }
    }
  };

  const handleTaskSaved = (savedTask: Task) => {
    const isNew = !tasks.some(t => t.id === savedTask.id);
    if (isNew) {
      // Adiciona a nova tarefa e recarrega para ordenar
      loadTasks(false); 
    } else {
      // Atualiza a tarefa existente
      setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
    }
  };

  const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
        <TaskDialog onTaskSaved={handleTaskSaved} />
      </div>

      <div className="flex items-center space-x-4">
        <List className="h-5 w-5 text-muted-foreground" />
        <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(statusMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                  <Badge variant={priorityMap[task.priority].color}>{priorityMap[task.priority].label}</Badge>
                </div>
                <CardDescription className="flex items-center space-x-1 pt-1">
                  {isPast(new Date(task.dueDate)) && task.status !== 'done' ? (
                    <Clock className="h-4 w-4 text-red-500" />
                  ) : (
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={isPast(new Date(task.dueDate)) && task.status !== 'done' ? "text-red-500 font-medium" : "text-muted-foreground"}>
                    {format(new Date(task.dueDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    {isPast(new Date(task.dueDate)) && task.status !== 'done' && " (Atrasada)"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{task.description}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusMap).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="space-x-2">
                    <TaskDialog task={task} onTaskSaved={handleTaskSaved} />
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(task.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Nenhuma tarefa encontrada com o filtro atual.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
