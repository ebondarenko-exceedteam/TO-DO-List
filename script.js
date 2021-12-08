let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = function init () {
    input = document.getElementById('add_task');
    input.addEventListener('change', updateValue);
    render()
}

onClickButton = () => {
    allTasks.push({
        text: valueInput,
        isDone: false
    });

    localStorage.setItem('tasks', JSON.stringify(allTasks));

    valueInput = '';
    input.value = '';

    render ();
}

onClickButtonAll = () => {
    allTasks = []

    localStorage.setItem('tasks', JSON.stringify(allTasks));

    render ();
}

updateValue = (event) => {
    valueInput = event.target.value;
}

updateEditValue = (event) => {
    valueEditInput = event.target.value;
}

onChangeCheckbox = (index) => {
    allTasks[index].isDone = !allTasks[index].isDone;
    localStorage.setItem('tasks', JSON.stringify(allTasks));


    render();
}

onChangeTask = (index) => {
    allTasks[index].text = valueEditInput;
    localStorage.setItem('tasks', JSON.stringify(allTasks))
    valueEditInput = '';

    render();
}

editTask = (index) => {
    const activeContainer = document.getElementById(`task_${index}`); // взял контейнер, в котором находится нужная задача

    // const taskEditValue = document.createElement('div');
    // taskEditValue.className = 'task_value';
    // activeContainer.appendChild(taskEditValue);

    // const taskEditButtons = document.createElement('div'); 
    // taskEditButtons.className = 'task_buttons';
    // activeContainer.appendChild(taskEditButtons);

    while(activeContainer.firstChild) {                               // удалил все элементы, чтобы отрисовать новые
        activeContainer.removeChild(activeContainer.firstChild);
    }

    let valueEditInput = allTasks[index].text;                        // переменной, которая отображает значение нового инпута, присваиваем старый текст
    let editInput = document.createElement('input');                  // создаю новый инпут
    editInput.type = 'text';                                          // добавляю инпуту тип текст                                      
    editInput.value = valueEditInput;                                 // добавляю инпуту для отображения текст задачи, который нужно изменить
    editInput.addEventListener('change', updateEditValue);            // добавляю инпуту прослушку события по изменению
    activeContainer.appendChild(editInput);                           // добавляю инпут в разметку, в контейнер

    const imageDone = document.createElement('img');                  // создал тэг картинки для сохранения редактирования
    imageDone.src = 'img/done.svg';
    activeContainer.appendChild(imageDone);                           // добавляю картинку в разметку, в контейнер
    imageDone.onclick = () =>  {                                      // добавляю картинке событие по клику
        editInput.value = '';
        onChangeTask(index)
    }

    const imageBack = document.createElement('img');                  
    imageBack.src = 'img/back.svg';
    activeContainer.appendChild(imageBack);                           
    imageBack.onclick = () =>  {                                      
        valueEditInput = '';
        render();
    }
    
}

deleteTask = (index) => {
    allTasks.splice(index, 1)
    localStorage.setItem('tasks', JSON.stringify(allTasks));

    render();
}

render = () => {
    const contentBlock = document.getElementById('content_page'); // взял из штмл див для контента

    while(contentBlock.firstChild) {                              // перед добавлением нового элемета в этот див,
        contentBlock.removeChild(contentBlock.firstChild);        // очищаем его от старых элементов, чтобы старые элементы не 
    }                                                             // дублировались при отрисовке

    allTasks.sort((a, b) => {
        if(a.isDone > b.isDone) {
            return 1;
        }

        if(a.isDone < b.isDone) {
            return -1;
        }

        return 0;
    })

    localStorage.setItem('tasks', JSON.stringify(allTasks));

    allTasks.map((item, index) => {
        const container = document.createElement('div');          // создал див для новой задачи
        container.id = `task_${index}`;                           // присвоил этому диву уникальный айди
        container.className = 'task_container';

        const taskValue = document.createElement('div');          // создал див для новой задачи
        taskValue.className = 'task_value';
        container.appendChild(taskValue);

        const taskButtons = document.createElement('div');          // создал див для новой задачи
        taskButtons.className = 'task_buttons';
        container.appendChild(taskButtons);

        const checkbox = document.createElement('input');         // создал для новой задачи инпут для флага выполнено/не выполнено
        checkbox.type = 'checkbox';                               
        checkbox.checked = item.isDone;
        taskValue.appendChild(checkbox);
        checkbox.onchange = function () {
            onChangeCheckbox(index)
        }

        const text = document.createElement('p');
        text.innerText = item.text;
        text.className = item.isDone ? 'task_text done_task' : 'text_task';
        taskValue.appendChild(text);

        const imageEdit = document.createElement('img');
        imageEdit.src = 'img/edit.svg';
        if(!item.isDone) {
            taskButtons.appendChild(imageEdit);
        }
        imageEdit.onclick = function () {
            editTask(index)
        }

        const imageDelete = document.createElement('img');
        imageDelete.src = 'img/close.svg';
        taskButtons.appendChild(imageDelete);
        imageDelete.onclick = function () {
            deleteTask(index);
        }

        // item.isDone ? contentBlock.append(container) : contentBlock.prepend(container);

        contentBlock.appendChild(container);
    })
}