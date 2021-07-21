///Elección de filtros y búsqueda de datos
$('input[id="btn-buscar-walk"]').on('click', function () {

    var exportexist = document.getElementById("export");
    var exportexcelexist = document.getElementById("exportarexcel");

    if (exportexcelexist != null) {
        exportexist.removeChild(exportexcelexist);
    }

    if (startDate === "" && endDate === "") {
        console.log("Si verifico");
    } else {
        startDate = startDate.format('DD/MM/YYYY');
        endDate = endDate.format('DD/MM/YYYY');
    }

    var api = document.getElementById("api_walk_select");
    var contrato = document.getElementById("con_walk_select");
    var autor = document.getElementById("autor_walk_select");
    var lider = document.getElementById("leader_walk_select");
    var disciplina = document.getElementById("disi_walk_select");
    var area = document.getElementById("area_walk_select");
    var prioridad = document.getElementById("prio_walk_select");

    let datos = [];

    let fila = {
        id_api: api.options[api.selectedIndex].id,
        id_contrato: 0,
        id_autor: autor.options[autor.selectedIndex].id,
        id_lider: lider.options[lider.selectedIndex].id,
        id_disciplina: disciplina.options[disciplina.selectedIndex].id,
        id_area: area.options[area.selectedIndex].id,
        id_prioridad: prioridad.options[prioridad.selectedIndex].id,
        fecha_inicio: startDate,
        fecha_termino: endDate
    };

    datos.push(fila);

    debugger
    $.ajax({
        type: 'GET',
        data: { 'listar[]': JSON.stringify(datos), csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "/searchwalks",
        dataType: 'json',
    }).done(function (search) {

        cargarTablaCaminatas(search);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {

    });
});

function cargarTablaCaminatas(response) {

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
            { "data": "id_reporte", "name": "Reporte" },
            { "data": "caminata", "name": "Caminata" },
            { "data": "ubicacion", "name": "Ubicacion" },
            { "data": "plano", "name": "N_plano" },
            { "data": "equipo", "name": "Codigo_equipo" },
            { "data": "disciplina", "name": "Disciplina" },
            { "data": "accion", "name": "Descripcion" },
            { "data": "originador", "name": "Originado_por" },
            { "data": "responsable", "name": "Resp_construccion" },
            { "data": "lider", "name": "Lider_caminata" },
            { "data": "prioridad", "name": "Prioridad" },
            { "data": "fecha_compromiso", "name": "Fecha_compromiso" },
            //{
            //    "data": "reporte", "render": function (data, type, full, meta) {
            //        return '<a onclick="Modificar(' + data + ');" class="form-control btn-danger"><i class="glyphicon glyphicon-pencil"></i></a>';
            //    }
            //}
            
        ]
    });

    //var divexport = document.getElementById('export');
    //var exportar = document.createElement('a');
    //exportar.className = 'btn btn-danger';
    //exportar.type = 'button';
    //exportar.textContent = 'Exportar a Excel';
    //exportar.id = 'exportarexcel';
    //exportar.href = 'downloadexcelsearch/excelconfiltro';
    //divexport.appendChild(exportar);

    return false;


}