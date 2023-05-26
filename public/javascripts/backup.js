
alert('q')




let create = document.getElementById('backup_create');
create.addEventListener('click', event => {
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