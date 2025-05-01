import type React from "react"
import { useState } from "react"
import { useTaskStore, type Task } from "../store/taskStore"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import DeleteTaskModal from "./DeleteTaskModal"
import { CheckCircle, XCircle, Edit, Trash } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit }) => {
  const { updateTaskStatus } = useTaskStore()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const handleStatusChange = async (task: Task) => {
    try {
      await updateTaskStatus(task.id, !task.completed)
      toast.success(`Tarea ${task.completed ? "marcada como pendiente" : "completada"}`)
    } catch (error) {
      toast.error("Error al actualizar el estado de la tarea")
      console.error(error)
    }
  }

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setTaskToDelete(null)
    setDeleteModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-lg p-4 ${
              task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                >
                  {task.title}
                </h3>
                <p className={`mt-1 text-sm ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Creada: {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleStatusChange(task)}
                  className={`p-1.5 rounded-full ${
                    task.completed ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                >
                  {task.completed ? <XCircle size={20} /> : <CheckCircle size={20} />}
                </button>

                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"
                  title="Editar tarea"
                >
                  <Edit size={20} />
                </button>

                <button
                  onClick={() => handleDeleteClick(task)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                  title="Eliminar tarea"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {deleteModalOpen && taskToDelete && (
        <DeleteTaskModal task={taskToDelete} isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} />
      )}
    </div>
  )
}

export default TaskList
