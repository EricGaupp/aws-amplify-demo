import { useEffect } from "react";
import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const AddToDoButton = () => {
  const handleCreateTodoClick = () => {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content })
        .then((response) => {
          if (!response.data || response.errors) {
            console.error("Error creating todo:", response.errors);
            alert("Failed to create todo.");
          }
        })
        .catch((error) => {
          console.error("Network or other error:", error);
          alert("Failed to create todo due to a network or other error.");
        });
    }
  };
  return <button onClick={handleCreateTodoClick}>Add Todo</button>;
};

const App = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos([...data.items]);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
      <ul>
        {todos.map(({ content, id }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
      <AddToDoButton />
    </main>
  );
};

export default App;
