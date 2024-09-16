import { z } from 'zod';


export const createTaskSchema = z.string({
    required_error: 'Task name is required',
}).min(1, 'Task name must be at least 1 character long').max(100, 'Task name must be at most 100 characters long');