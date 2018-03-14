(function(){
	
	var btnAdd = document.getElementById('add'),
		input = document.getElementById('input'),
		todos = document.getElementById('todos'),
		checkboxes = document.getElementsByClassName('checkbox'),
		completed  = document.getElementById('completed'),
		deletes = document.getElementsByClassName('delete'),
		edits = document.getElementsByClassName('edit'),
		clear  = document.getElementById('clear');

	clear.addEventListener('click', function(e){
		e.preventDefault();
		
		localStorage.removeItem('tasks');
		todos.innerHTML = '';
		completed.innerHTML = '';
	})

	btnAdd.addEventListener('click', function(e){
		e.preventDefault();
		console.log(input.value);

		var timestamp = Date.now();

		createElement(timestamp, input.value);

		
		//save to lockal storage
		var newTask = {
			text: input.value,
			timestamp: timestamp
		};

		console.log(newTask);

		var tasks = getTasks();

		//дозапись в lockalStorage
		tasks.push(newTask);
		localStorage.setItem('tasks', JSON.stringify(tasks));
	//
		var el = document.getElementById(timestamp),
			parent = el.parentElement,
			btnDelete = parent.querySelector('.delete'),
			btnEdit = parent.querySelector('.edit');
		
		el.addEventListener('change', function(){
			moveToCompleted(this);
		});

		btnDelete.addEventListener('click', function(e){
			removeParent(this)
		});
		btnEdit.addEventListener('click', function(e){
			createEditVeiw(this)
		});
		input.value = "";
		btnAdd.setAttribute('disabled','disabled');
	});
	input.addEventListener('input', function(){
		if (input.value.length > 3){
			btnAdd.removeAttribute('disabled');
		} else {
			btnAdd.setAttribute('disabled','disabled');
		}
	});

	var oldTasks = getTasks();

	oldTasks.forEach(function(task){
		createElement(task.timestamp, task.text);
	})

	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener('click', function(e){
		moveToCompleted(this)
	});
	}
	for (var i = 0; i < deletes.length; i++) {
		deletes[i].addEventListener('click', function(e){
		removeParent(this)
	});
	}

	for (var i = 0; i < edits.length; i++) {
			edits[i].addEventListener('click', function(e){
			createEditVeiw(this)	
		});
	}

	function moveToCompleted(el){
		console.log(el.nextElementSibling.innerText);
		setTimeout(function(){
			var li = document.createElement('li');
			li.innerText = el.nextElementSibling.innerText;
			completed.appendChild(li);
			removeParent(el);
		}, 500);
	}

	function getTasks(){
		var tasks = localStorage.getItem('tasks');
		if (tasks) {
			tasks = JSON.parse(tasks);
		} else tasks =[];
		return tasks;
	}

	function removeParent(el){
		var parent = el.parentElement,
			id = parent.querySelector('input[type="checkbox"]').id,
			tasks = getTasks();

		var state = true,
			i = 0;
		while (state && i < tasks.length){
			if (tasks[i].timestamp == id){
				tasks.splice(i,1);
				state = false;
			}
			i++;
		}
		localStorage.setItem('tasks', JSON.stringify(tasks));
		parent.remove();
	}


	function createEditVeiw(el){
		var input = document.createElement('input'),
			saveBtn = document.createElement('button'),
			label = el.previousElementSibling,
			parent = el.parentElement,
			checkbox = parent.querySelector('input[type="checkbox"]'),
			deleteBtn = parent.querySelector('.delete');

		input.type = 'text';
		input.value = label.innerText;		

		saveBtn.innerText = 'Save';
		saveBtn.classList.add('save');

		var childs = parent.querySelectorAll('*');

			childs.forEach(function(child){
				child.classList.add('hidden');
			})

		parent.insertBefore(saveBtn, parent.childNodes[0]);
		parent.insertBefore(input, parent.childNodes[0]);

		saveBtn.addEventListener('click', function(e){
			e.preventDefault();

			save(this);
		})
		input.addEventListener('change', function(e){

			save(this);
		})

		console.log(input);
	}

	function save(el) {
		// alert('kdsjfdlkf');
		var parent = el.parentElement,
			input = parent.querySelector('input[type="text"]'),
			saveBtn = parent.querySelector('.save'),
			str = input.value,
			label = parent.querySelector('label'),
			id = parent.querySelector('input[type="checkbox"]').id;

		if (str.length == 0){
			removeParent(el);
			return;
		}
		label.innerText = str;
		saveBtn.remove();
		input.remove();

		var childs = parent.querySelectorAll('*');

		childs.forEach(function(child){
			child.classList.remove('hidden');
		})
		var tasks = getTasks();

		var state = true,
			i = 0;
		while (state && i < tasks.length){
			if (tasks[i].timestamp == id){
				tasks[i].text = str;
				state = false;
			}
			i++;
		}

		localStorage.setItem('tasks', JSON.stringify(tasks));
	}
	function createElement(timestamp, text) {

		var li = document.createElement('li');

		var html = '<input class="checkbox" type="checkbox" id="' + timestamp + '">' +
			' <label for="' + timestamp + '">' + text + '</label>' +
			' <button class="edit">Edit</button>' +
			' <button class="delete">Delete</button>';

		li.innerHTML = html;

		todos.appendChild(li);
	}
})();