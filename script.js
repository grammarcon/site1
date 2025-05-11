// 할일 목록을 저장할 배열
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 요소
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// 페이지 로드 시 저장된 할일 목록 표시
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});

// 할일 추가 함수
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') {
        Swal.fire({
            icon: 'warning',
            title: '알림',
            text: '할일을 입력해주세요!',
            confirmButtonText: '확인',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';

    // 성공 알림
    Swal.fire({
        icon: 'success',
        title: '추가 완료!',
        text: '할일이 추가되었습니다.',
        timer: 1500,
        showConfirmButton: false
    });
}

// 할일 삭제 함수
function deleteTodo(id) {
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "삭제된 할일은 복구할 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            
            Swal.fire({
                icon: 'success',
                title: '삭제 완료!',
                text: '할일이 삭제되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// 할일 완료 상태 토글 함수
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            const newStatus = !todo.completed;
            // 상태 변경 알림
            Swal.fire({
                icon: newStatus ? 'success' : 'info',
                title: newStatus ? '완료!' : '다시 시작!',
                text: newStatus ? '할일을 완료했습니다.' : '할일을 다시 시작합니다.',
                timer: 1500,
                showConfirmButton: false
            });
            return { ...todo, completed: newStatus };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// 할일 목록 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-center w-full">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                       onclick="toggleTodo(${todo.id})"
                       class="form-checkbox">
                <span class="ml-3">${todo.text}</span>
                <button class="delete-btn ml-auto" onclick="deleteTodo(${todo.id})">
                    삭제
                </button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

// 로컬 스토리지에 할일 목록 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Enter 키로 할일 추가
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
}); 