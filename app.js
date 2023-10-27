const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const todos = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    const todo = { title, content, id: todos.length + 1 };
    todos.push(todo);
    res.json(todo);
  } else {
    res.status(400).json({ error: "Title and content are required" });
  }
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.title = title;
    todo.content = content;
    res.json(todo);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.json({ message: "Todo deleted" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
