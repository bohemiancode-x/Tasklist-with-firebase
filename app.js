const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const addTask = (task, id) => {
    let time = task.created_at.toDate();
    let html = `
        <li data-id="${id}">
            <div>${task.task}</div>
            <div>${time}</div>
            <button class= "btn btn-danger btn-sm my-2">delete</button>
        </li>
    `;

    list.innerHTML += html;
}

const deleteTask = (id) => {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        if(task.getAttribute('data-id') === id){
            task.remove();
        }
    })
}

//get docs
const unsub = db.collection('task1234').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addTask(doc.data(), doc.id);
        } else if (change.type === 'removed'){
            deleteTask(doc.id);
        }
    })
});

// add docs
form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();
    const task = {
        task: form.task.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection('task1234').add(task).then( () => {
        console.log('recipe added');
    }).catch(err => {
        console.log(err);
    });
});

// delete docs 
list.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        //console.log(id);
        db.collection('task1234').doc(id).delete().then(() => {
            console.log('recipe deleted');
        });
    };
});

//unsub
button.addEventListener('click', () => {
    unsub();
    console.log('unsubscribed from collection changes');
})