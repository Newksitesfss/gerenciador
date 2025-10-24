import TaskDashboard from "@/components/TaskDashboard"

export default function Home() {
  // Simplificando para focar no gerenciador de tarefas.
  // O TaskDashboard agora é renderizado diretamente.
  // A função onLogout é um placeholder, pois a autenticação foi removida do escopo imediato.
  return <TaskDashboard onLogout={() => console.log("Logout chamado (Autenticação removida do escopo)")} />
}

