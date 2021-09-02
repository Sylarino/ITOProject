function downloadrecentlypdf(id_pdf, typereport, url) {
    var link = document.createElement('a');
    link.href = url + '/' + typereport+'/' + id_pdf + '/';
    link.click();
}

function messageSucces(data, type, url) {

    if (data.submit == 'success') {

        swal.fire("Guardado", "Reporte Numero " + data.id + " agregado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                downloadrecentlypdf(data.id, type, url);
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