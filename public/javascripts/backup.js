


let create = document.getElementById('backup_create');
create.addEventListener('click', event => {
    event.preventDefault();

    fetch('/backup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        
    })
        .then(res => res.text())
        .then(data => {
            alert(data);


        })
        .catch(error => {
            console.error(error);
            alert(error);
        });

})
let restore = document.getElementById('restore');
restore.addEventListener('click', event => {
    event.preventDefault();

    fetch('/restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(res => res.text())
        .then(data => {
            alert(data);

        })
        .catch(error => {
            console.error(error);
            alert(error);
        });

})