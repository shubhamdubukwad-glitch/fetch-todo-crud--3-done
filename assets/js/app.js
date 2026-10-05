const cl = console.log;

const todoForm = document.getElementById('todoForm')
const todoInput = document.getElementById('todoInput')
const addTodoBtn = document.getElementById('addTodoBtn')
const updateTodoBtn = document.getElementById('updateTodoBtn')
const todoContainer = document.getElementById('todoContainer')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app`;
const todo_url = `${BASE_URL}/todo.json`;

const state = {
    todoArr: [],
    EDIT_id: null,
}

function showspinner() {
    spinner.classList.remove('d-none')
}
function hidespinner() {
    spinner.classList.add('d-none')
}
//============================================READ-TODO=============================================================

function readtodo(arr) {
    showspinner()
    let result = ``;
    arr.forEach(ele => {
        result += `<li class="list-group-item d-flex justify-content-between" id="${ele.id}">
                                <strong>
                                    <h2>${ele.todoInput}</h2>
                                </strong>
                                <div>
                                  <button onclick="edittodo(this)" class="btn btn-info btn-sm">EDIT</button>
                                <button onclick="removetodo(this)" class="btn btn-danger btn-sm">REMOVE</button>
                                </div>
                            </li>`;
    });
    todoContainer.innerHTML = result;
}
//============================================FETCH-TODO=============================================================
function fetchtodo() {
    showspinner()
    fetch(todo_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('ERROR...')
            }
            return res.json()
        })
        .then(data => {
            //cl(data)
            for (const key in data) {
                data[key].id = key;
                state.todoArr.unshift(data[key])
            }
            readtodo(state.todoArr)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
fetchtodo()
//============================================CREATE-TODO=============================================================
function onaddtodo(eve) {
    eve.preventDefault();
    let todoObj = {
        todoInput: todoInput.value,
    }
    showspinner()
    fetch(todo_url, {
        method: "POST",
        body: JSON.stringify(todoObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('ERROR...?')
            }
            return res.json();
        })
        .then(data => {
            let li = document.createElement('li');
            todoObj.id = data.name;
            li.id = todoObj.id;
            li.className = `list-group-item d-flex justify-content-between`;
            li.innerHTML += `<strong>
                                    <h2>${todoObj.todoInput}</h2>
                                </strong>
                                <div>
                                 <button onclick="edittodo(this)" class="btn btn-info btn-sm">EDIT</button>
                                <button onclick="removetodo(this)" class="btn btn-danger btn-sm">REMOVE</button>
                                </div>`;
            todoContainer.prepend(li);
            todoForm.reset()
            Swal.fire({
                title: "TODO CREATED SUCCESSFULLY..!!",
                text: "You TODO data created has been successfully..!!",
                icon: "success",
                timer: 4000
            });

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
//============================================EDIT-TODO=============================================================
function edittodo(ele) {
    let editid = ele.closest('li').id;
    showspinner()
     //cl(editid)
    state.EDIT_id = editid;
    let edit_url = `${BASE_URL}/todo/${editid}.json`;

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wring..?')
            }
            return res.json()
        })
        .then(data => {
            todoInput.value = data.todoInput;
            addTodoBtn.classList.add('d-none')
            updateTodoBtn.classList.remove('d-none');
            showspinner()
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
//============================================UPDATE-TODO=============================================================
function onupdatetodo() {
    let update_id = state.EDIT_id;
    let update_url = `${BASE_URL}/todo/${update_id}.json`;
    let todoobj = {
        todoInput: todoInput.value,
        id: update_id,
    }
    showspinner()
    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(todoobj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            let li = document.getElementById(update_id)
            li.innerHTML = `<strong>
                                    <h2>${todoobj.todoInput}</h2>
                                </strong>
                                <div>
                                 <button onclick="edittodo(this)" class="btn btn-info btn-sm">EDIT</button>
                                <button onclick="removetodo(this)" class="btn btn-danger btn-sm">REMOVE</button>
                                </div>`;

            addTodoBtn.classList.remove('d-none');
            updateTodoBtn.classList.add('d-none');
            todoForm.reset()
            Swal.fire({
                title: "TODO UPDATED SUCCESSFULLY..!!",
                text: "You TODO data updated has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
//============================================DELETE-TODO=============================================================
function removetodo(ele) {
    let delete_id = ele.closest('li').id;
    showspinner()
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/todo/${delete_id}.json`;
            fetch(delete_url, {
                method: 'DELETE',
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "TOKEN JWT FROM LS"
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('somthing went wrong..?')
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = state.todoArr.findIndex(p => p.id === delete_id)
                    state.todoArr.splice(getIndex, 1)
                    ele.closest('li').remove()
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    hidespinner()
                })
        }
    });
}
todoForm.addEventListener('submit', onaddtodo)
updateTodoBtn.addEventListener('click', onupdatetodo)