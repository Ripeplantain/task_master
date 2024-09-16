import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { createTaskSchema } from "~/types/route";

export const taskRouter = createTRPCRouter({
    getTasks: protectedProcedure.query(({ctx}) => {
        return ctx.db.task.findMany();
    }),

    createTask: protectedProcedure.input(createTaskSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.task.create({
            data: {
                title: input,
                user: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                }
            },
        });
    }),

    deleteTask: protectedProcedure.mutation(async ({ ctx, input }) => {
        return ctx.db.task.delete({
            where: {
                id: input,
            },
        });
    }),

    toggleTask: protectedProcedure.input(
        z.string({
            required_error: 'Task ID is required',
        }),
    ).mutation(async ({ ctx, input }) => {
        const task = await ctx.db.task.findUnique({
            where: {
                id: input,
            },
        });

        if (!task) {
            throw new Error('Task not found');
        }

        return ctx.db.task.update({
            where: {
                id: input,
            },
            data: {
                done: !task.done,
            },
        });
    }),
});