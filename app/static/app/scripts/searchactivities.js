
//Accion para ejecutar cuando hay un cambio en el select del proyecto
$(function () {
    $('select[name="api"]').on('change', function () {
        var id = $('#api_antgen_id').val();//$(this).val();
        var select_contracts = $('select[name="contract"]');
        var options = '<option id="0" disabled selected>Seleccione N° de Contrato</option>';

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
            console.log(data);
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
            debugger;
            if (!data.hasOwnProperty('error')) {

                $.each(data, function (key, value) {
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
        id_conformidad: conformidad.options[conformidad.selectedIndex].id
    };

    datos.push(fila);

    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/busquedaactividades",
        dataType: 'json',
    }).done(function (data) {


        inc = 0;

        if (!data.hasOwnProperty('error')) {

            $.each(data, function (key, value) {
                var tr = document.createElement("tr");
                var td0 = document.createElement("td");
                var td01 = document.createElement("td");
                var td02 = document.createElement("td");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var td3 = document.createElement("td");
                var td4 = document.createElement("td");
                var td5 = document.createElement("td");
                var td6 = document.createElement("td");
                var td7 = document.createElement("td");
                var td8 = document.createElement("td");
                var tablegen = document.getElementById("table-actividad");

                inc += 1

                td0.id = value.id_api;
                td01.id = value.id_contrato;
                td02.id = value.id_contrato;
                td1.id = value.id_actividad;
                td2.id = value.id_subactividad;
                td3.id = "total-estimado";
                td4.id = value.id_medida;
                td5.id = "total-acumulado";
                td6.id = "fecha-inicio";
                td7.id = "fecha-termino";
                td8.id = "obs";
                tr.id = "fila-" + inc;

                td0.textContent = value.api;
                td01.textContent = value.contrato;
                td02.textContent = value.contrato_numero;
                td1.textContent = value.actividad;
                if (value.id_tipo_sub == 2) {
                    td2.textContent = value.subactivdad_no_programada + " (No Programada)";
                } else {
                    td2.textContent = value.subactividad;
                }
                td3.textContent = value.total_estimado;
                td4.textContent = value.medida;
                td5.textContent = value.total_acumulado;
                td6.textContent = value.fecha_inicio;
                td7.textContent = value.fecha_termino;
                td8.textContent = value.observaciones;

                tablegen.appendChild(tr);
                tr.appendChild(td0);
                tr.appendChild(td01);
                tr.appendChild(td02);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tr.appendChild(td7);
                tr.appendChild(td8);
            });
            if (data.length < 1) {
                //window.alert('No se encontraron datos, intente nuevamente.');
                swal("Oops!", "No se encontraron datos, intente nuevamente.", "error");
            }

            var divexport = document.getElementById('export');
            var exportar = document.createElement('input');
            exportar.className = 'btn btn-danger';
            exportar.type = 'button';
            exportar.value = 'Exportar a Excel';
            exportar.id = 'exportarexcel';
            divexport.appendChild(exportar);

            return false;
        }

        message_error(data.error);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });
});

//Evento para refrescar pagina
$('input[id="btn-recargar"]').on('click', function () {

    window.location.reload();

});


//Evento al hacer click en exportar excel.
$('main').on('click', "#exportarexcel", function () {

    const tabla = document.querySelector("#selectactivities");
    const fecha = new Date();
    let tableExport = new TableExport(tabla, {
        exportButtons: false, // No queremos botones
        filename: "busqueda-(" + fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + ")", //Nombre del archivo de Excel
        sheetname: "Búsqueda (ITO Project)", //Título de la hoja
    });
    let datos = tableExport.getExportData();
    debugger;

    let preferenciasDocumento = datos.selectactivities.xlsx;
    tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
});
