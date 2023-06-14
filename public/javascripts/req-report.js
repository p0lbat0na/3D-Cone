



//const fileStream = fs.createWriteStream(path);
let amount_of_records3 = document.getElementById('amount_of_record').textContent;

let reportBtns = []

    for (let i = 0; i < amount_of_records3; i++) {
        reportBtns[i] = document.getElementById('report' + [i]);
}


reportBtns.forEach(function (element, index) {
    element.addEventListener('click', event => {
        

        event.preventDefault();
        let num = document.getElementById('num' + index).innerHTML;
        alert(num)
        fetch('/report/request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                num: num
            },
        }).then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.blob();
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error
            }
        })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'req__report.docx';    //'+num+'
                document.body.appendChild(a);
                a.click();
                a.remove();
            })

            .catch(error => {

                alert(error);
            });
    })
    });

