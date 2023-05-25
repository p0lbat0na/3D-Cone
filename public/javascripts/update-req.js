


let cardPanels = []
    let amount_of_records = document.getElementById('amount_of_record').textContent;

    for (let i = 0; i < amount_of_records; i++) {
        cardPanels[i] = document.getElementById('cardPanel' + [i]);
}
alert(amount_of_records + cardPanels.length)


cardPanels.forEach(function (element, index) {
        element.addEventListener('submit', event => {
            
            event.preventDefault();
            
            try {
                let num = document.getElementById('num' + index).innerHTML;
                let opinion_required = false;
                if (document.getElementById('opinion_required' + index).checked)
                    opinion_required = true;
                let deadline = document.getElementById('deadline'+ index).value;
                let status = document.getElementById('status' + index).value
                let sql = `UPDATE requests SET status='` + status + `', opinion_required=` + opinion_required + `, deadline='` + deadline + `' WHERE request_code=` + num;
               
                fetch('/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sql: sql

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


