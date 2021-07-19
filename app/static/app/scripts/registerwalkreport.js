var inc_walk = 0;

$(function () {
    document.getElementById("btn_add_walk").onclick = function (e) {
        debugger;

        inc_walk = inc_walk + 1;

        //Variablas elementos de recursos EECC
        var descripcion = document.getElementById("con-desc-walk");
        var ubicacion = document.getElementById("con-place-walk");
        var nplano = document.getElementById("con-plane-walk");
        var codigoequipo = document.getElementById("con-equicode-walk");
        var disciplina = document.getElementById("con-disci-walk");
        var originador = document.getElementById("con-origin-walk");
        var respconstruccion = document.getElementById("con-rescon-walk");
        var lidercaminata = document.getElementById("con-lider-walk");
        var prioridad = document.getElementById("con-priority-walk");
        var fechacompromisocierre = document.getElementById("con-cierre-walk");
        var fechacierrereal = document.getElementById("con-cierrereal-walk");
        var tabla_walk = document.getElementById("tbody-walk");

        var walk_tr = '<tr id="tr_walk_' + inc_walk + '"> <td class="ubicacion_td">' + ubicacion.value + '</td>' +
            '<td class="codigo_equipo" id="2">' + codigoequipo.value + '</td>' +
            '<td class="nplano" id="2">' + nplano.value + '</value>' +
            '<td class="disciplina" id="2">' + disciplina.options[disciplina.selectedIndex].textContent + '</td>' +
            '<td class="descripcion" id="2">' + descripcion.value + '</td>' +
            '<td class="originador" id="2">' + originador.options[originador.selectedIndex].textContent + '</td>' +
            '<td class="resp_construccion" id="2">' + respconstruccion.options[respconstruccion.selectedIndex].textContent + '</td>' +
            '<td class="lider_caminata" id="2">' + lidercaminata.options[lidercaminata.selectedIndex].textContent + '</td>' +
            '<td class="prioridad" id="2">' + prioridad.options[prioridad.selectedIndex].textContent + '</td>' +
            '<td class="fecha_cierre" id="2">' + fechacompromisocierre.value + '</td>' +
            '<td class="fecha_cierre_real" id="2">' + fechacierrereal.value + '</td>' +
            '<td><input class="btn btn-danger" type="button" onclick="eliminarFila(tr_walk_' + inc_walk+');" value="Eliminar"></td>' +
                    '</tr>';

        tabla_walk.innerHTML += walk_tr;


    };
});

function eliminarFila(select_tr) {
    debugger;
    td_actual = document.getElementById(select_tr.id);
    td_parent = td_actual.parentNode;
    td_parent.removeChild(td_actual);
}

$(function () {
    $('select[name="area"]').on('change', function () {

        var id_select = this.id;

        var id = $('#' + id_select).val();
        debugger;
        if (id === '') {
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_wbs', id: id },
            url: "/searchwbs",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
                $.each(data, function (key, value) {
                    debugger;
                    $('label[name="wbs"]').text(value.wbs);
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });

    });

});


$(function () {
    $('input[id="btn_save_walk_report"]').on('click', function () {


    });
});