const loginForm = document.getElementById('loginForm');
                 
loginForm.addEventListener('submit', event => {
    event.preventDefault();
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

                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                window.location.href = '/';

            })
            .catch(error => {
                console.error(error);
                alert(error);

            });
    } catch (e) {
        alert(e);
    }
});

exit.addEventListener('submit', event => {

    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        try {
            let token = localStorage.getItem('token');

            const cookie = cookies[i];



            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        catch (e) {
            alert(e)
        }

    } alert('clear')
})