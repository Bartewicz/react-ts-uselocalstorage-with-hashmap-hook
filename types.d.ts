export declare namespace Type {
  type Id = string | number;

  interface Todo {
    id: TodoId;
    title: string;
    completed: boolean;
    userId: number;
  }

  type TodoId = number;
}
