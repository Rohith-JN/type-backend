import { Todo } from 'src/entities/todo';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from 'src/types';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  todos(@Ctx() ctx: Context): Promise<Todo[]> {
    return ctx.em.find(Todo, {});
  }

  @Query(() => Todo, { nullable: true })
  todo(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: Context
  ): Promise<Todo | null> {
    return ctx.em.findOne(Todo, { id });
  }

  @Mutation(() => Todo)
  async createTodo(
    @Ctx() ctx: Context,
    @Arg('title') title: string
  ): Promise<Todo> {
    const todo = ctx.em.create(Todo, { title });
    await ctx.em.persistAndFlush(todo);
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodo(
    @Ctx() ctx: Context,
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Todo | null> {
    const todo = await ctx.em.findOne(Todo, { id });
    if (!todo) {
      return null;
    }
    if (typeof title !== undefined) {
      todo.title = title;
      await ctx.em.persistAndFlush(todo);
    }
    return todo;
  }

  @Mutation(() => Todo, { nullable: true })
  async deleteTodo(
    @Ctx() ctx: Context,
    @Arg('id') id: number
  ): Promise<boolean> {
    await ctx.em.nativeDelete(Todo, { id });
    return true;
  }
}
