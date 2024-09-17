import { z } from 'zod';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allTodosOutput = RouterOutputs["task"]["getTasks"]

export type Todo = allTodosOutput[number];

export const createTaskSchema = z.string({
    required_error: 'Task name is required',
}).min(1, 'Task name must be at least 1 character long').max(100, 'Task name must be at most 100 characters long');