var dataload;

function upload(event) {
    event.preventDefault();
    var data = new FormData($('form').get(0));

    $.ajax({
        url: 'readexcel/',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
    }).done(function (load) {
        cargarTabla(load)
    }).fail(function (response) {
        Swal.fire("Archivo Incorrecto", "El archivo no cumple estructura o no es valido.", "warning");
        return false;
    });
    return false;
}

$(function () {
    $('form').submit(upload);
});

function cargarTabla(response) {

    var saveexist = document.getElementById("button_cont");
    var savebuttonexist = document.getElementById("save_data");

    if (savebuttonexist != null) {
        saveexist.removeChild(savebuttonexist);
    }

    $("#divTabla").addClass("hidden");

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }
    $("#divTabla").removeClass("hidden");

    var tablaActividades = "";
    /*    if (!$.fn.dataTable.fnIsDataTable($('#tableActivities'))) {*/
    tablaActividades = $('#table-load').DataTable({
        paging: true,
        destroy: true,
        searching: false,
        "language": {
            "lengthMenu": "Mostrando _MENU_ registros por pagina",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "infoEmpty": "Sin informacion",
            "infoFiltered": "(filtrando en _MAX_ registros)",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente",
                "first": "Primero",
                "last": "Último"
            }
        },
        data: response,
        "columns": [
            { "data": "numero_contrato", "name": "Contrato" },
            { "data": "actividad", "name": "Actividad" },
            { "data": "subactividad", "name": "Subactividad" },
            { "data": "dias_programado", "name": "Dias_programado" },
            { "data": "fecha_inicio_programada", "name": "Fecha_inicio_programada" },
            { "data": "fecha_inicio_programada", "name": "Fecha_inicio_programada" },
            { "data": "dias_proyectado", "name": "Dias_proyectado" },
            { "data": "fecha_inicio_proyectado", "name": "Fecha_inicio_proyectado" },
            { "data": "fecha_inicio_proyectado", "name": "Fecha_inicio_proyectado" },
            { "data": "total_estimado", "name": "Total_estimado" },
            { "data": "referencia_diaria", "name": "Referencia_diaria" },
            { "data": "medida", "name": "Medida" },
            {
                "data": "obs_validacion", "name": "Observacion",
                createdCell: function (td, cellData, rowData, row, col) {
                    $(td).addClass(rowData.clase_validacion);
                }
            }
            //{
            //    "name": "Observacion", "data": null,"render": function (data, type, full, meta) {
            //        var classObs = data.clase_validacion;
            //        var Obser = data.obs_validacion;

            //        resultado = '<td class="danger" >' + Obser + '</td>';
            //        return resultado;
            //    }
            //}
        ]
    });

    dataload = response;
    var divbutton = document.getElementById('button_cont');
    var loadbutton = document.createElement('a');
    loadbutton.className = 'btn btn-danger';
    loadbutton.type = 'button';
    loadbutton.textContent = 'Guardar';
    data_click = "guardarDatos();";
    loadbutton.setAttribute("onclick", data_click);
    loadbutton.id = 'save_data';
    //loadbutton.href = 'downloadexcelsearch/excelconfiltro';
    divbutton.appendChild(loadbutton);
    debugger;
    return false;

}

function guardarDatos() {

    debugger;
    $.ajax({
        url: 'submitdata/',
        type: 'POST',
        data: { 'data[]': JSON.stringify(dataload), csrfmiddlewaretoken: '{{ csrf_token }}' },
        dataType: 'json',
    }).done(function (data) {

        if (data == 1) {

            Swal.fire("Guardado!", "Datos cargados y guardados correctamente.", "success");
            return false;

        }
        else {

            Swal.fire("Error", "Revise que los datos esten correctos.", "warning");
            return false;
        }

    });

}