
const addTestForm = document.getElementById('addTestForm');
const backBtn = document.getElementById('back');
const delBtn = document.getElementById('del');

let user_id = -1;
let return_req_code = -1;
let return_test_code = [-1];
let addBtnCount = 0;
let currentTestCard = addBtnCount;

document.getElementById('addBtnCount').innerHTML = addBtnCount;

   //document.getElementById("control_code").
   //document.getElementById("reg_num").
   //document.getElementById("line_num").
   //document.getElementById("comment").
   //document.getElementById("files").
addTestForm.addEventListener("click", event => {
    event.preventDefault();

    if (addBtnCount > currentTestCard) {
        document.getElementById('control_code').required = true;
        document.getElementById("reg_num").required = true;
        document.getElementById("line_num").required = true;
        document.getElementById("comment").required = true;
        document.getElementById("files").required = true;

        document.getElementById("control_code").removeAttribute('readonly');
        document.getElementById("reg_num").removeAttribute('readonly');
        document.getElementById("line_num").removeAttribute('readonly');
        document.getElementById("comment").removeAttribute('readonly');
        document.getElementById("files").removeAttribute('readonly');

        document.getElementById('addBtnCount').innerHTML = addBtnCount;
        delBtn.setAttribute('disabled', true);
    }
    else {
        if (addBtnCount == 0) {
            let department_num = document.getElementById('dep_code').value;
            let deadline = document.getElementById('deadline').value;
            let opinion_reqired = false;
            if (document.getElementById('opinion').checked)
                opinion_reqired = true;
            fetch('say-my-name', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(data => {
                    user_id = data.user_id
                    fetch('/insert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ department_num, deadline, opinion_reqired, user_id })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (typeof (data) == 'number') {
                                
                                return_req_code = data;
                                addBtnCount++;
                                document.getElementById('addBtnCount').innerHTML = addBtnCount;
                                document.getElementById("control_code").removeAttribute('readonly');
                                document.getElementById("reg_num").removeAttribute('readonly');
                                document.getElementById("line_num").removeAttribute('readonly');
                                document.getElementById("comment").removeAttribute('readonly');
                                document.getElementById("files").removeAttribute('readonly');
                                currentTestCard = addBtnCount;

                            }
                            //else
                                //alert('ee ' + data.lenght + ' ' + data + ' ' + typeof (data));
                        })
                        .catch(error => {
                            alert(error);
                        });;
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                });
        }
        else {
            if (return_req_code == -1 || user_id == -1) {
                alert('Ошибка сервера')
            }
            else {
                

                document.getElementById("reg_num").required = false;
                document.getElementById("line_num").required = false;
                document.getElementById("comment").required = false;
                document.getElementById("files").required = false;

                let control_code = document.getElementById('control_code').value;
                let reg_num = document.getElementById('reg_num').value;
                let line_num = document.getElementById('line_num').value;
                let comment = document.getElementById('comment').value;
                let files = document.getElementById('files').value;
                

                fetch('/insert-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ return_req_code, control_code, line_num, reg_num, comment, files })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (typeof (data) == 'number') {
                            return_test_code.push(data);
                            document.getElementById("back").removeAttribute('disabled');
                            addBtnCount++;
                            currentTestCard = addBtnCount;

                            document.getElementById('addBtnCount').innerHTML = addBtnCount;
                            document.getElementById("control_code").removeAttribute('readonly');
                            document.getElementById("reg_num").removeAttribute('readonly');
                            document.getElementById("line_num").removeAttribute('readonly');
                            document.getElementById("comment").removeAttribute('readonly');
                            document.getElementById("files").removeAttribute('readonly');
                        }
                        else
                            alert('error ' + data.name + ' ' + data.code + ' ' + data.detail);
                    })
                    .catch(error => {
                        alert(error);
                    });;

            }

        }
    }
    currentTestCard = addBtnCount;
    document.getElementById('control_code').value = "";
    document.getElementById('reg_num').value = "";
    document.getElementById('line_num').value = "";
    document.getElementById('comment').value = "";
    document.getElementById('files').value = "";
})


backBtn.addEventListener('click', event => {
    event.preventDefault();
    try {

    delBtn.removeAttribute('disabled');
    

    currentTestCard--;
    document.getElementById('addBtnCount').innerHTML = currentTestCard;
    if (currentTestCard < 2)
        backBtn.setAttribute('disabled', true);

        fetch('/test-list/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num: return_test_code[currentTestCard],
                is_create_req: true,
                diagonal_dir: false
            })
        })
            .then(res => res.json())
            .then(data => { 
                document.getElementById('control_code').value = data.rows[0].control_object_testing_code;
                document.getElementById('reg_num').value=data.rows[0].object_reg_number;
                document.getElementById('line_num').value=data.rows[0].line_code;
                document.getElementById('comment').value=data.rows[0].comment;
                document.getElementById('files').value = data.rows[0].files;

                document.getElementById('control_code').readonly = true;
                document.getElementById('reg_num').readonly = true;
                document.getElementById('line_num').readonly = true;
                document.getElementById('comment').readonly = true;
                document.getElementById('files').readonly = true;

                document.getElementById('control_code').required = false;
                document.getElementById("reg_num").required = false;
                document.getElementById("line_num").required = false;
                document.getElementById("comment").required = false;
                document.getElementById("files").required = false;


            })
            .catch(error => {
                console.error(error);
                alert(error);
                
            });
    }
    catch (e) {
        alert(e)
    }
});

delBtn.addEventListener('click', event => {
    event.preventDefault();

    
    
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            table: 'tests_in_requests',
            row: 'test_in_request_code',
            condition: return_test_code[currentTestCard]
        })
    })
        .then(res => res.text())
        .then(data => {            
                alert(data);
        })
        .catch(error => {
            console.error(error);
            alert(error);

        });

});