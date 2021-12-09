let allTasks = [];
let valueInput = '';
let input = null;

window.onload = async () => {
	input = document.getElementById('add_task');
	input.addEventListener('change', updateValue);
	const resp = await fetch('http://localhost:8000/allTasks', { method: 'GET' });
	let result = await resp.json();
	allTasks = result.data;
	render();
}

const onClickButton = async () => {
	const resp = await fetch('http://localhost:8000/createTask', {
		method: 'POST',
		headers: {
			"Content-Type": 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			text: valueInput,
			isCheck: false
		})
	});
	let result = await resp.json();
	allTasks = result.data;
	valueInput = '';
	input.value = '';
	render();
}

const onClickButtonAll = () => {
	allTasks.map(async item => {
		const resp = await fetch(`http://localhost:8000/deleteTask?id=${item.id}`, { method: 'DELETE' });
		const result = await resp.json();
		allTasks = result.data;
		render();
	});
}

const updateValue = (event) => {
	valueInput = event.target.value;
}

const updateEditValue = (event) => {
	valueEditInput = event.target.value;
}

const onChangeCheckbox = async (index) => {
	allTasks[index].isCheck = !allTasks[index].isCheck;
	const resp = await fetch(`http://localhost:8000/updateTask?id=${allTasks[index].id}`, {
		method: 'PATCH',
		headers: {
			"Content-Type": 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			id: allTasks[index].id,
			text: allTasks[index].text,
			isCheck: allTasks[index].isCheck
		})
	});
	let result = await resp.json();
	allTasks = result.data;
	render();
}

const onChangeTask = async (index) => {
	const resp = await fetch(`http://localhost:8000/updateTask?id=${allTasks[index].id}`, {
		method: 'PATCH',
		headers: {
			"Content-Type": 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			id: allTasks[index].id,
			text: valueEditInput,
			isCheck: allTasks[index].isCheck
		})
	});
	let result = await resp.json();
	allTasks = result.data;
	valueEditInput = '';
	render();
}

const editTask = (index) => {
	const activeContainer = document.getElementById(`task_${index}`);

	while (activeContainer.firstChild) {
		activeContainer.removeChild(activeContainer.firstChild);
	}
	const valueEditInput = allTasks[index].text;
	const editInput = document.createElement('input');
	editInput.type = 'text';
	editInput.value = valueEditInput;
	editInput.addEventListener('change', updateEditValue);
	activeContainer.appendChild(editInput);
	const imageDone = document.createElement('img');
	imageDone.src = 'img/done.svg';
	activeContainer.appendChild(imageDone);
	imageDone.onclick = () => {
		editInput.value = '';
		onChangeTask(index)
	}
	const imageBack = document.createElement('img');
	imageBack.src = 'img/back.svg';
	activeContainer.appendChild(imageBack);
	imageBack.onclick = () => {
		valueEditInput = '';
		render();
	}

}

const deleteTask = async (index) => {
	const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, { method: 'DELETE' });
	let result = await resp.json();
	allTasks = result.data;
	render();
}

const render = () => {
	const contentBlock = document.getElementById('content_page');

	while (contentBlock.firstChild) {
		contentBlock.removeChild(contentBlock.firstChild);
	}
	allTasks.sort((a, b) => 
		b.isCheck > a.isCheck ? -1 : b.isCheck < a.isCheck ? 1 : 0
	);
	allTasks.map((item, index) => {
		const { text, isCheck, id } = item;
		const container = document.createElement('div');
		container.id = `task_${index}`;
		container.className = 'task_container';
		const taskValue = document.createElement('div');
		taskValue.className = 'task_value';
		container.appendChild(taskValue);
		const taskButtons = document.createElement('div');
		taskButtons.className = 'task_buttons';
		container.appendChild(taskButtons);
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = item.isCheck;
		taskValue.appendChild(checkbox);
		checkbox.onchange = function () {
			onChangeCheckbox(index)
		}
		const textTag = document.createElement('p');
		textTag.innerText = text;
		textTag.className = isCheck ? 'task_text done_task' : 'text_task';
		taskValue.appendChild(textTag);
		const imageEdit = document.createElement('img');
		imageEdit.src = 'img/edit.svg';
		if (!isCheck) {
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
		contentBlock.appendChild(container);
	})
}