var startDate = "";
var endDate = "";

$(function () {
    $('input[name="daterange"]').daterangepicker({
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        "locale": {
            "daysOfWeek": [
                "Dom",
                "Lun",
                "Mar",
                "Mie",
                "Jue",
                "Vie",
                "Sáb"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            format: 'DD/MM/YYYY'
        },
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        startDate = start;
        endDate = end;
    });
});

//Accion para ejecutar cuando hay un cambio en el select del proyecto
$(function () {
    $('select[name="api"]').on('change', function () {

        var id_select = this.id;

        var id = $('#' + id_select).val();
        var select_contracts = $('select[name="contract"]');
        var options = '';

        if (id === '') {
            select_contracts.html(options);
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_contract_id', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
                $.each(data, function (key, value) {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.contract_number + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_contracts.html(options);
        });
    });
});

//Accion a realizar al seleccionar un contrato
$(function () {
    $('select[name="contract"]').on('change', function () {
        var id = $('#contr_antgen_id').val();
        var select_act_pro = $('select[name="select-act-ap"]');
        var options = '<option id="0" disabled selected>Seleccione Actividad</option>';

        if (id === '') {
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_contract_info', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {

                let datamap = data.map(item => {
                    return [item.id, item]
                });
                var datamaparr = new Map(datamap); // Pares de clave y valor

                let result = [...datamaparr.values()];

                $.each(result, function (key, value) {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.activity_name + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_act_pro.html(options);
        });
    });
});

//Accion a ejecutar al seleccionar una actividad
$(function () {
    $('select[name="select-act-ap"]').on('change', function () {
        var id = $('#select-act-ap').val();
        var select_sub_ap = $('select[name="select-sub-ap"]');
        var options = '<option id="0" disabled selected>Seleccione Sub Actividad</option>';

        if (id === '') {
            select_sub_ap.html(options);
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_subactivity', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {

            if (!data.hasOwnProperty('error')) {

                $.each(data, function (key, value) {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.subactivity_name + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_sub_ap.html(options);
        });
    });
});

//Accion a ejecutar cuando seleccione el cumplimiento de actividades programadas.
document.getElementById("select-sub-ap").onchange = function (e) {

    var select_sub = document.getElementById("select-sub-ap");
    if (select_sub.options[select_sub.selectedIndex].textContent == "Seleccione Sub Actividad") {
        document.getElementById('select-tip-act').disabled = false
    } else {
        document.getElementById('select-tip-act').disabled = true;
    }
};

//Accion para realizar la búsqueda con los filtros elegidos.
$('input[id="btn-buscar"]').on('click', function () {

    //var Table = document.getElementById("table-actividad");
    //Table.innerHTML = "";
    var exportexist = document.getElementById("export");
    var exportexcelexist = document.getElementById("exportarexcel");
    debugger;
    if (exportexcelexist != null) {
        exportexist.removeChild(exportexcelexist);
    }

    if (startDate === "" && endDate === "") {
        console.log("Si verifico");
    } else {
        startDate = startDate.format('DD/MM/YYYY');
        endDate = endDate.format('DD/MM/YYYY');
    }

    var api = document.getElementById("api_antgen_id");
    var contrato = document.getElementById("contr_antgen_id");
    var actividad = document.getElementById("select-act-ap");
    var subactividad = document.getElementById("select-sub-ap");
    //var cumplimiento = document.getElementById("select-pre-ap");
    //var historico 
    var seguimiento = document.getElementById("select-seguimiento");
    var tipoactividad = document.getElementById("select-tip-act");
    var conformidad = document.getElementById("select-confor");

    let datos = [];

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: contrato.options[contrato.selectedIndex].id,
        id_actividad: actividad.options[actividad.selectedIndex].id,
        id_subactividad: subactividad.options[subactividad.selectedIndex].id,
        id_seguimiento: seguimiento.options[seguimiento.selectedIndex].id,
        id_tipoactividad: tipoactividad.options[tipoactividad.selectedIndex].id,
        id_conformidad: conformidad.options[conformidad.selectedIndex].id,
        fecha_inicio: startDate,
        fecha_termino: endDate
    };

    datos.push(fila);

    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/busquedaactividades",
        dataType: 'json',
    }).done(function (search) {

        cargarTabla(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });
});

function cargarTabla(response) {

    console.log(response);

    $("#divTabla").addClass("hidden");

    if (response == null) {

        swal("Oops!", "No se encontraron datos, intente nuevamente.", "warning");
        return false;
    }
    $("#divTabla").removeClass("hidden");

    var tablaActividades = "";
/*    if (!$.fn.dataTable.fnIsDataTable($('#tableActivities'))) {*/
    tablaActividades = $('#tableActivities').DataTable({
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
        "data": response,
        "columns": [
            { "data": "subactividad", "name": "Subactividad" },
            { "data": "reporte", "name": "Reporte" },
            { "data": "fecha_reporte", "name": "Fecha_reporte" },
            { "data": "avance_diario", "name": "Avance_diario" },
            { "data": "medida", "name": "Medida" },
            { "data": "fecha_inicio", "name": "Fecha_inicio" },
            { "data": "fecha_termino", "name": "Fecha_termino" },
            { "data": "dias", "name": "Dias" },
            { "data": "total_estimado", "name": "Total_estimado" },
            { "data": "total_acumulado", "name": "Total_acumulado" },
            { "data": "dias_acumulado", "name": "Dias_acumulado" },
            { "data": "ref_dia", "name": "Ref_dia" },
            {
                "data": "reporte", "render": function (data, type, full, meta) {
                    return '<a onclick="Modificar(' + data + ');" class="form-control btn-danger"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
            }
            ,
        ]
    });

    var divexport = document.getElementById('export');
    var exportar = document.createElement('a');
    exportar.className = 'btn btn-danger';
    exportar.type = 'button';
    exportar.textContent = 'Exportar a Excel';
    exportar.id = 'exportarexcel';
    exportar.href = 'downloadexcelsearch/excelconfiltro';
    divexport.appendChild(exportar);

    return false;

    
}

function Modificar(id) {
    Swal.fire({
        title: '¿Seguro que deseas modificar el reporte?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Modificar`,
        denyButtonText: `No modificar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            location.href = "/modifiedreport/" + id;
/*            $('input[id="btn-buscar"]').click();*/
        } 
    })

}

//function modifiedHist(id) {
//    $.ajax({
//        type: 'POST',
//        data: { 'id': id },
//        url: "modifiedreport/",
//        dataType: 'json',
//    }).done(function (data, search) {

//        Swal.fire('Saved!', '', 'success')
//        cargarTabla(search);

//    }).fail(function (jqXHR, textStatus, errorThrown) {
//        Swal.fire('Changes are not saved', '', 'info')
//    });
//}


//Evento para refrescar pagina
$('input[id="btn-recargar"]').on('click', function () {

    window.location.reload();

});


//Evento al hacer click en exportar excel.
//$('main').on('click', "#exportarexcel", function () {

//    const tabla = document.querySelector("#selectactivities");
//    const fecha = new Date();
//    let tableExport = new TableExport(tabla, {
//        exportButtons: false, // No queremos botones
//        filename: "busqueda-(" + fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + ")", //Nombre del archivo de Excel
//        sheetname: "Búsqueda (ITO Project)", //Título de la hoja
//    });
//    let datos = tableExport.getExportData();
//    debugger;

//    let preferenciasDocumento = datos.selectactivities.xlsx;
//    tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
//});
