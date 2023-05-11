const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', event => {
    //alert('q');
    event.preventDefault();// отменяем стандартное действие отправки формы
    const worker_id = document.getElementById('worker_id').value;
    const password = document.getElementById('password').value;
    try {
        fetch('/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ worker_id, password })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token); // сохраняем токен в localStorage
            //alert(data.token);
           // alert(window.location.href );

            window.location.href = '/catalog/staffSpec'; // перенаправляем на защищенную страницу

        })
        .catch(error => {
            console.error(error);
            alert(error);

        });
} catch (e) {
        alert(e);
}
});