"use client"

import { Button } from "@/components/ui/button"
import { TaskList } from "./TaskList"

interface TaskDashboardProps {
  onLogout: () => void
}

export default function TaskDashboard({ onLogout }: TaskDashboardProps) {
  const handleLogout = () => {
    // A remoção do localStorage pode ser desnecessária dependendo da implementação do login,
    // mas mantemos a chamada à prop onLogout.
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciador de Tarefas</h1>
            <p className="text-sm text-muted-foreground">Organize suas tarefas com eficiência</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <TaskList />
      </main>

      {/* Footer - Será atualizado na fase 6 */}
      <footer className="border-t bg-card mt-10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gerenciador de Tarefas. Desenvolvido por <a href="https://github.com/newksitesfss/_vitorkr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">newksitesfss/_vitorkr</a>.
        </div>
      </footer>
    </div>
  )
}

