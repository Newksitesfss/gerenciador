"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { taskService } from "@/lib/taskService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSuccess: (task: Task) => void;
  onClose: () => void;
}

export function TaskForm({ initialData, onSuccess, onClose }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
      priority: initialData?.priority || "medium",
      status: initialData?.status || "todo",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: TaskFormValues) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate.toISOString(),
      // O userId será mockado no taskService por enquanto
    };

    try {
      let task: Task;
      if (initialData) {
        task = await taskService.updateTask(initialData.id, taskData);
      } else {
        // Omitindo id, createdAt, updatedAt e userId para criação
        const newTaskData = taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
        task = await taskService.createTask(newTaskData);
      }
      onSuccess(task);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      // Aqui você poderia usar um toast para mostrar o erro ao usuário
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da Tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes da tarefa (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-1">Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {initialData && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="done">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Salvar Alterações" : "Criar Tarefa"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
