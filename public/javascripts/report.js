
const objReport = document.getElementById('obj_report');
const staffReport = document.getElementById('staff_report');

//alert('q')
//const fileStream = fs.createWriteStream(path);
const workerReport = document.getElementById('worker_report');



workerReport.addEventListener('submit', event => {

    event.preventDefault();  

    let num = document.getElementById('worker_report_inp').value;
    

    fetch('/report/staff', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            num:num
        },
    }).then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    //.then(res => {
      //      const doc = res.blob();
      //
      //  })
        //    .then(res => {
        //        res.body.pipe(fileStream);
        //        res.body.on("error", reject);
        //        fileStream.on("finish", resolve);
        //    })
        ////.then(data => {
        ////    alert(data);
            
        //        //const doc = new docx.Document({
        //        //    sections: [
        //        //        {
        //        //            properties: {},
        //        //            children: [
        //        //                new docx.Paragraph({
        //        //                    children: [
        //        //                        new docx.TextRun("Hello World"),
        //        //                        new docx.TextRun({
        //        //                            text: "Foo Bar",
        //        //                            bold: true
        //        //                        }),
        //        //                        new docx.TextRun({
        //        //                            text: "\tGithub is the best",
        //        //                            bold: true
        //        //                        })
        //        //                    ]
        //        //                })
        //        //            ]
        //        //        }
        //        //    ]
        //        //});

        //        //docx.Packer.toBlob(doc).then((blob) => {
        //        //    console.log(blob);
        //        //    saveAs(blob, "example.docx");
        //        //    console.log("Document created successfully");
        //        //});
            
    
        ////    })
            .catch(error => {
               
                alert(error);
            });
    });
