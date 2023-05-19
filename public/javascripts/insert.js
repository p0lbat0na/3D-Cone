const reqForm = document.getElementById('reqForm');

try {
reqForm.addEventListener('submit', event => {
    event.preventDefault();
    alert('q');
    console.log('9999')
    
    // отменяем стандартное действие отправки формы
    let department_num = document.getElementById('dep_code').value;
    let deadline = document.getElementById('deadline').value;
    let opinion_reqired = false;
    if (document.getElementById('opinion').checked)
        opinion_reqired = true;
    alert('q');
        fetch('/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ department_num,deadline,opinion_reqired })
        })            
            .catch(error => {
                console.error(error);
                alert(error);

            });
    
    });
} catch (e) {
        alert(e);
    }