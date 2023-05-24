
//alert(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
const searchForm = document.getElementById('searchForm');


let amount_of_records = document.getElementById('amount_of_record').textContent;
let cardPanels = []
try{    
for (let i = 0; i < amount_of_records; i++) {
    cardPanels[i] = document.getElementById('cardPanel' + [i]);    
    }
cardPanels[amount_of_records] = document.getElementById('searchForm' + amount_of_records);
alert(cardPanels[amount_of_records-1].className + cardPanels[amount_of_records].className)
} catch (e) {
    alert(e);
}

cardPanels.forEach(function (element, index) {
    element.addEventListener('submit', event => {
       
            event.preventDefault();           
            
            let url = '/';
            let urlFull = '/'


            // page + '/search'//page + '?num=' + num + '&req_proc=' + requires_processing;
            //let page = window.location.href.substring(window.location.href.lastIndexOf('/'))
            //page= page.slice(0, -1);
            let requires_processing = false;
            let diagonal_dir = false;
            let num = -1;
            try {
                if (element.className == "card-panel hoverable" || document.title.slice(0, 9) == "Испытания") {
                    if (document.title.slice(0, 9) == "Испытания" && element.className != "card-panel hoverable") {
                        num = document.getElementById('num_input' + amount_of_records).value;
                        //url = url + window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
                        urlFull = document.getElementById('refresh').href;
                        url = urlFull.substring(urlFull.lastIndexOf('/'))
                        diagonal_dir = false;
                        if (document.getElementById('requires_processing').checked)
                            requires_processing = true;

                    } else {
                        num = document.getElementById('num' + index).innerHTML;
                        
                        urlFull = document.getElementById('diagonal').href;
                        url = urlFull.substring(urlFull.lastIndexOf('/'))
                        diagonal_dir = true;
                    }

                }
                else {
                    alert('qй')
                    alert(document.getElementById('searchForm').value)
                    urlFull = document.getElementById('refresh').href;
                    url = urlFull.substring(urlFull.lastIndexOf('/'))
                    num = document.getElementById('num_input'+amount_of_records).value;
                    if (document.getElementById('requires_processing').checked)
                        requires_processing = true;
                }
                if (element.className == "card-panel hoverable" && document.title.slice(0, 9) == "Испытания") {
                    url = url + window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

                    diagonal_dir = false;
                    if (document.getElementById('requires_processing').checked)
                        requires_processing = true;
                }

            }
            catch (e) {
                alert(e)
            }
            //alert(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
            if (url[url.length - 1] == "?") {
                url = url.slice(0, url.length - 1);
        }
        
            //alert(diagonal_dir +element.className)
            url = url + '/search'
            //alert(url);
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    num: num,
                    requires_processing: requires_processing,
                    diagonal_dir: diagonal_dir
                })
            })
                .then(res => res.text())
                .then(data => {
                    if (data.length < 200)
                        alert(data);
                    else {
                        const newWindow = window.open();
                        newWindow.document.write(data);
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    });

        });
});

