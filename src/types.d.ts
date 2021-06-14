export declare namespace Type {
  type Id = string;

  interface Todo {
    id: TodoId;
    title: string;
    completed: boolean;
    userId: number;
  }

  type TodoId = Id;
}
