


//const fileStream = fs.createWriteStream(path);
const workerReport = document.getElementById('worker_report');
const objReport = document.getElementById('obj_report');



workerReport.addEventListener('submit', event => {

    event.preventDefault(); 

    let num = document.getElementById('worker_report_inp').value;     

    fetch('/report/staff', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            num:num
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
            a.download = 'report.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    
            .catch(error => {
               
                alert(error);
            });
    });


objReport.addEventListener('submit', event => {

    event.preventDefault();

    let num = document.getElementById('obj_report_inp').value;


    fetch('/report/obj', {
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
            a.download = 'report'+num+'.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        
        .catch(error => {

            alert(error);
        });
});