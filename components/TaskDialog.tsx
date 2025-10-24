"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { Plus, Edit } from "lucide-react";

interface TaskDialogProps {
  task?: Task; // Opcional para edição
  onTaskSaved: (task: Task) => void;
}

export function TaskDialog({ task, onTaskSaved }: TaskDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (savedTask: Task) => {
    onTaskSaved(savedTask);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {task ? (
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Criar Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        <TaskForm
          initialData={task}
          onSuccess={handleSuccess}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

