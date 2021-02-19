const StorageTodo = {
    keys: {
        todos: 'todo-list.todos',
    },

    loadTodos() {
        return JSON.parse(localStorage.getItem(StorageTodo.keys.todos)) || [];
    },

    saveTodos(todos) {
        localStorage.setItem(StorageTodo.keys.todos, JSON.stringify(todos));
    },

};

const Todos = {
    all: StorageTodo.loadTodos(),

    updateTodosDom() {
        DOM.allTodos = [...Todos.all];
    },

    add(todo) {
        Todos.all.push(todo);

        Todos.updateTodosDom();
        App.reload();
    },

    remove(todoId) {
        Todos.all.splice(todoId, 1);
        
        Todos.updateTodosDom();
        App.reload();

    },

    complete(todoId) {
        Todos.all[todoId].completed = true;

        Todos.updateTodosDom();
        App.reload();
    },
};

const DOM = {
    allTodos: [...Todos.all],

    todoContainer: document.querySelector('#todos'),

    addTodo(todo, index) {
        const liElement = document.createElement('li');
        liElement.classList.add('todo');
        if(todo.completed) liElement.classList.add('completed');
        liElement.setAttribute('data-i', todo.id);

        const htmlTodo = DOM.createHtmlTodo(todo, index);
        liElement.innerHTML = htmlTodo;

        DOM.todoContainer.appendChild(liElement);
    },

    createHtmlTodo({ description, completed }, index) {
        const html = `
        <div class="todo-description">
            <p>${description}</p>
        </div>

        <div class="todo-btns">
            <button class="btn-icon btn-complete" onclick="Todos.complete(${index})"><img src="./assets/check.svg" alt="Check todo"></button>
            <button class="btn-icon btn-remove" onclick="Todos.remove(${index})"><img src="./assets/trash.svg" alt="Remove todo"></button>
        </div>
        `;

        return html;
    },

    renderTodos() {
        DOM.allTodos.forEach(DOM.addTodo);
    },

    clearTodos() {
        DOM.todoContainer.innerHTML = '';
    },

    resetTodos() {
        DOM.clearTodos();
        DOM.renderTodos();
    },
};

const Filter = {
    byCategory(category) {
        DOM.allTodos = [...Todos.all].filter(todo => {
            if(category === 'completed')
                return todo.completed;
            else if (category === 'notcompleted')
                return !todo.completed;
            return true
        });
    },
};

const Form = {
    newTodoDescription: document.querySelector('#todo-new'),
    todoFilterCategory: document.querySelector('#todo-category'),

    resetInputs() {
        Form.newTodoDescription.value = '';
    },

    getValuesOf(val) {
        const values = {
            new: {
                description: Form.newTodoDescription.value,
            },
            filter: {
                category: Form.todoFilterCategory.value,
            }
        };

        return values[val];
    },

    submit(e, type) {
        e.preventDefault();
        
        if(type === 'new') {
            const { description } = Form.getValuesOf('new');
            Todos.add({ id: Todos.all.length, description, completed: false });

        } else if(type === 'filter') {
            console.log('filter');
            const { category } = Form.getValuesOf('filter');
            
            Filter.byCategory(category);
        }

        DOM.resetTodos();
        Form.resetInputs();
    },
};

const App = {
    init() {
        DOM.renderTodos();

        StorageTodo.saveTodos(Todos.all);
    },

    reload() {
        DOM.clearTodos();
        
        App.init();
    },
};

App.init();