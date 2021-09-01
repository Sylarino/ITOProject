function downloadrecentlypdf(id_pdf) {
    debugger;
    $.ajax({
        type: 'POST',
        data: {
            'id': id_pdf,
            'typereport': 'iscreport',
            csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        url: "downloadpdfiscreportregistered/",
        success: function (response) {
            debugger;
            var blob = new Blob([response], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "REPORT_N" + id_pdf + ".pdf";
            link.click();
        }
    });
}

function messageSucces(data) {

    if (data.submit == 'success') {

        swal.fire("Guardado", "Reporte N°" + data.id + " agregado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                downloadrecentlypdf(data.id);
                Swal.fire('Descargado!', '', 'success', {
                    confirmButtonText: "Ok"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    } else {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    }
                });
            }
        });

    }
}