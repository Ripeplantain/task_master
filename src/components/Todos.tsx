import { api } from "~/utils/api";
import Todo from "./Todo";

const Todos = () => {
  const { data: todos, isLoading, isError } = api.task.getTasks.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading todos</div>;
	return (
		<>
			{todos?.length ?
				todos.map((todo) => {
					return <Todo key={todo.id} todo={todo} />
				})
				: "Create your first todo..."}
		</>
	)
};

export default Todos;
