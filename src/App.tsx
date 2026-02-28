import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('paper-todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    localStorage.setItem('paper-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now()
    }
    setTodos(prev => [newTodo, ...prev])
    setInputValue('')
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-[#f5f0e8] relative overflow-hidden flex flex-col">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative stamps */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 opacity-20 rotate-12">
        <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-[#8b4513] rounded-full flex items-center justify-center">
          <span className="text-[#8b4513] font-caveat text-xs md:text-sm text-center leading-tight">DAILY<br/>TASKS</span>
        </div>
      </div>

      <div className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="font-caveat text-5xl md:text-7xl text-[#3d3d3d] mb-2">My Tasks</h1>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#c4b8a8]" />
            <span className="font-sourceserif text-sm text-[#8b7355] italic">
              {totalCount === 0 ? 'nothing yet' : `${completedCount} of ${totalCount} complete`}
            </span>
            <div className="h-px flex-1 bg-[#c4b8a8]" />
          </div>
        </motion.header>

        {/* Add todo form */}
        <motion.form
          onSubmit={addTodo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 md:mb-10"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write a new task..."
              className="w-full px-4 md:px-6 py-4 md:py-5 bg-white/60 backdrop-blur-sm border-2 border-dashed border-[#c4b8a8] rounded-none font-sourceserif text-base md:text-lg text-[#3d3d3d] placeholder:text-[#a99f8f] focus:outline-none focus:border-[#8b7355] focus:bg-white/80 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2 md:py-3 bg-[#3d3d3d] text-[#f5f0e8] font-caveat text-lg md:text-xl hover:bg-[#5d5d5d] transition-colors duration-200 active:scale-95"
            >
              Add
            </button>
          </div>
        </motion.form>

        {/* Todo list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
                className={`group relative bg-white/70 backdrop-blur-sm p-4 md:p-5 border-l-4 transition-all duration-300 ${
                  todo.completed
                    ? 'border-l-[#7d9471] bg-[#f5f9f3]/70'
                    : 'border-l-[#c4b8a8] hover:border-l-[#8b7355]'
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Custom checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 mt-0.5 border-2 border-[#a99f8f] rounded-sm relative hover:border-[#7d9471] transition-colors cursor-pointer"
                  >
                    {todo.completed && (
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full p-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7d9471"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M4 12l6 6L20 6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      </motion.svg>
                    )}
                  </button>

                  {/* Task text */}
                  <span className={`flex-1 font-sourceserif text-base md:text-lg leading-relaxed transition-all duration-300 ${
                    todo.completed
                      ? 'text-[#8b7355]/60 line-through decoration-[#7d9471]/50 decoration-2'
                      : 'text-[#3d3d3d]'
                  }`}>
                    {todo.text}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[#a99f8f] hover:text-[#c75050] transition-all duration-200"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Completed stamp */}
                {todo.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div className="px-2 md:px-3 py-1 border-2 border-[#7d9471] text-[#7d9471] font-caveat text-sm md:text-base tracking-wider opacity-40">
                      DONE
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12 md:py-16"
          >
            <div className="inline-block p-6 md:p-8 border-2 border-dashed border-[#c4b8a8] rounded-sm">
              <p className="font-caveat text-2xl md:text-3xl text-[#8b7355] mb-2">Your list is empty</p>
              <p className="font-sourceserif text-sm text-[#a99f8f] italic">Write your first task above</p>
            </div>
          </motion.div>
        )}

        {/* Clear completed */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setTodos(prev => prev.filter(t => !t.completed))}
              className="font-sourceserif text-sm text-[#8b7355] hover:text-[#c75050] transition-colors underline underline-offset-4 decoration-dashed"
            >
              Clear {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Decorative corner fold */}
      <div className="absolute bottom-16 right-0 w-16 h-16 md:w-24 md:h-24 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#e5dcd0] to-transparent"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
          }}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 md:py-6 text-center">
        <p className="font-sourceserif text-xs text-[#a99f8f]/70">
          Requested by @xyzcryptor · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}

export default App
