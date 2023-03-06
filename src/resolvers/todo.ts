import { Todo } from 'src/entities/todo';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  todo() {
    return [];
  }
}
