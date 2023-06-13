

alert('q1');

//const fileStream = fs.createWriteStream(path);
let amount_of_records3 = document.getElementById('amount_of_record').textContent;

let reportBtns = []

    for (let i = 0; i < amount_of_records3; i++) {
        reportBtns[i] = document.getElementById('report' + [i]);
    }
alert('q2');


workerReport.forEach(function (element, index) {
    element.addEventListener('click', event => {
        alert('q3');

        event.preventDefault();
        let num = document.getElementById('num' + index).innerHTML;
        fetch('/report/request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                num: num
            },
        }).then(response => response.blob())
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

