

import { useState } from "react";
import { createTaskSchema } from "~/types/route";
import { api } from "~/utils/api";

const CreateTodo = () => {
    const [newTask, setNewTask] = useState<string>("");

    const trpc = api.useContext();

    const { mutate } = api.task.createTask.useMutation({
        onMutate: async (newTask) => {
          await trpc.task.getTasks.cancel();

          const previousTasks = trpc.task.getTasks.getData();

          trpc.task.getTasks.setData(undefined, (prev) => {
            const optimisticTask = {
              id: "temp-id",
              title: newTask,
              done: false,
              userId: "temp-user-id",
            }

            return prev ? [optimisticTask, ...prev] : [optimisticTask];
          });

          setNewTask("");

          return { previousTasks };
        },
        onError: () => {
            setNewTask(newTask);
            alert("Failed to create task");
        },
        onSettled: async () => {
            await trpc.task.getTasks.invalidate();
        }
    });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = createTaskSchema.safeParse(newTask);
            if (!result.success) {
                alert(result.error.errors.join(", "));
            }
            mutate(newTask);
        }}
        className="flex gap-2"
      >
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="New Todo..."
          type="text"
          name="new-todo"
          id="new-todo"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;
