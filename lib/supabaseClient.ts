// Arquivo limpo. O Supabase foi removido do escopo imediato para focar
// na funcionalidade do Gerenciador de Tarefas. O taskService.ts está usando dados mockados.
// Para re-integrar o Supabase, este arquivo deve ser restaurado.

// Mock do objeto supabase para evitar erros de importação nos componentes que ainda o referenciam
export const supabase = {
    auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                single: () => Promise.resolve({ data: null, error: null })
            })
        })
    })
};
