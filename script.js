document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const addButton = document.getElementById("add-button");
  const todoList = document.getElementById("todo-list");
  const maxItems = 4;

  addButton.addEventListener("click", () => {
    const title = titleInput.value;
    const content = contentInput.value;

    if (title && content) {
      if (todoList.children.length < maxItems) {
        createTodoItem(title, content);
        titleInput.value = "";
        contentInput.value = "";
      } else {
        alert("최대 4개의 항목만 추가할 수 있습니다.");
      }
    }
  });

  const createTodoItem = (title, content) => {
    fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then((todo) => {
        renderTodoItem(todo);
      })
      .catch((error) => console.error(error));
  };

  const renderTodoItem = (todo) => {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");
    listItem.dataset.id = todo.id;
    listItem.innerHTML = `
            <div class="todo-content" data-id="${todo.id}">
              <strong contenteditable="true">${todo.title}</strong>
              <p contenteditable="true">${todo.content}</p>
            </div>
            <div class="todo-buttons">
              <button class="edit-button" data-id="${todo.id}">Edit</button>
              <button class="delete-button" data-id="${todo.id}">Delete</button>
            </div>
          `;

    const editButton = listItem.querySelector(".edit-button");
    const deleteButton = listItem.querySelector(".delete-button");

    editButton.addEventListener("click", () => {
      const titleElement = listItem.querySelector("strong");
      const contentElement = listItem.querySelector("p");
      titleElement.setAttribute("contenteditable", "true");
      contentElement.setAttribute("contenteditable", "true");
      titleElement.focus();
    });

    listItem.querySelector(".todo-content").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.target.blur();
      }
    });

    listItem.querySelector(".todo-content").addEventListener("blur", (e) => {
      const id = e.target.getAttribute("data-id");
      const updatedTitle = listItem.querySelector("strong").textContent;
      const updatedContent = listItem.querySelector("p").textContent;
      updateTodoItem(id, updatedTitle, updatedContent);
      e.target.querySelector("strong").setAttribute("contenteditable", "false");
      e.target.querySelector("p").setAttribute("contenteditable", "false");
    });

    deleteButton.addEventListener("click", () => {
      deleteTodoItem(todo.id, listItem);
    });

    todoList.appendChild(listItem);
  };

  const updateTodoItem = (id, title, content) => {
    fetch(`/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then((todo) => {
        const listItem = todoList.querySelector(`[data-id="${todo.id}"]`);
        if (listItem) {
          listItem.querySelector("strong").textContent = todo.title;
          listItem.querySelector("p").textContent = todo.content;
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteTodoItem = (id, listItem) => {
    fetch(`/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        listItem.remove();
      })
      .catch((error) => console.error(error));
  };

  const loadTodos = () => {
    fetch("/todos")
      .then((response) => response.json())
      .then((todos) => {
        todos.forEach(renderTodoItem);
      })
      .catch((error) => console.error(error));
  };

  loadTodos();
});
