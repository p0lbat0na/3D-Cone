

try {
    let cardPanels = []
    let amount_of_records2 = document.getElementById('amount_of_record').textContent;



    for (let i = 0; i < amount_of_records2; i++) {
        cardPanels[i] = document.getElementById('cardPanel' + [i]);
    }


cardPanels.forEach(function (element, index) {
        element.addEventListener('submit', event => {
            
            event.preventDefault();
                
            
            try {
                let value = [
                     document.getElementById('num' + index).innerHTML, //num:
                     document.getElementById('control_code' + index).value, //control_code:
                     document.getElementById('reg_num' + index).value, //reg_num:
                     document.getElementById('line_num' + index).value, //line_num:
                     document.getElementById('comment' + index).value, //comment:
                     document.getElementById('files' + index).value, //files:
                     document.getElementById('executor' + index).value, //executor:
                     document.getElementById('status' + index).value //status:
                ]
                let attr = [' test_in_request_code=',//`UPDATE requests SET ` + status +
                    ` control_object_testing_code=`,// + control_code +
                    ` object_reg_number=`,// + reg_num +
                    ` line_code=`,// + line_num +
                    ` comment=`,// + comment +
                    ` files= `,// + files +
                    ` worker_id=`,// + executor +
                    ` testing_status=` //WHERE request_code= + num;
                ]

                let sql = 'UPDATE tests_in_requests SET '

                for (let i = 1; i < attr.length; i++) {
                    if (value[i])
                    sql += attr[i] + `'`+value[i]+`',`;
                }
                sql = sql.slice(0, -1) +` WHERE ` + attr[0] + value[0]
                fetch('/anyRequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql:sql

                    })
                })
                    .then(res => res.text())
                    .then(data => {
                        alert(data);
                        let urlFull = document.getElementById('refresh').href;
                        let url = urlFull.substring(urlFull.lastIndexOf('/'))
                        window.location.replace(url);
                    })
                    .catch(error => {
                        console.error(error);
                        alert(error);
                    });
            
            } catch (e) {
        alert(e);
    }
        });
    });
} catch (e) {
    alert(e);
}