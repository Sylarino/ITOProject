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
            '<td class="disciplina" id="' + disciplina.options[disciplina.selectedIndex].id +'">' + disciplina.options[disciplina.selectedIndex].textContent + '</td>' +
            '<td class="descripcion" id="2">' + descripcion.value + '</td>' +
            '<td class="originador" id="' + originador.options[originador.selectedIndex].id +'">' + originador.options[originador.selectedIndex].textContent + '</td>' +
            '<td class="resp_construccion" id="' + respconstruccion.options[respconstruccion.selectedIndex].id +'">' + respconstruccion.options[respconstruccion.selectedIndex].textContent + '</td>' +
            '<td class="lider_caminata" id="' + lidercaminata.options[lidercaminata.selectedIndex].id +'">' + lidercaminata.options[lidercaminata.selectedIndex].textContent + '</td>' +
            '<td class="prioridad" id="' + prioridad.options[prioridad.selectedIndex].id +'">' + prioridad.options[prioridad.selectedIndex].textContent + '</td>' +
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

        debugger;
        let reporte = [];
        let observacion = [];

        var selectapi = document.getElementById("ant-api-walk");
        var selectcontrato = document.getElementById("ant-contract-walk");
        var selectarea = document.getElementById("ant-wbs-walk");
        var inputsistema = document.getElementById("ant-sistem-walk");
        var inputcaminata = document.getElementById("ant-numwalk-walk");
        var inputtop = document.getElementById("ant-top-walk");
        var inputsubsistema = document.getElementById("ant-subsistem-walk");
        var inputfechayhora = document.getElementById("ant-date-walk");
        var inputfiles = document.getElementById('file_walk');
        var data = new FormData();

        for (var x = 0; x < inputfiles.files.length; x++) {
            var file = inputfiles.files[x];
            data.append('files', file);
        }

        if (inputfiles.files.length > 0) {
            var file_val = 1;
            var file_exist = 1;
        } else {
            var file_val = 0;
            var file_exist = 0;
        }

        document.querySelectorAll('#tbody-walk tr').forEach(function (e) {
            let fila = {
                codigo_equipo: e.querySelector('.codigo_equipo').innerText,
                ubicacion: e.querySelector('.ubicacion_td').innerText,
                num_plano: e.querySelector('.nplano').innerText,
                disciplina_id: e.querySelector('.disciplina').id,
                descripcion: e.querySelector('.descripcion').innerText,
                originador: e.querySelector('.originador').id,
                resp_construccion: e.querySelector('.resp_construccion').id,
                lider_caminata: e.querySelector('.lider_caminata').id,
                prioridad: e.querySelector('.prioridad').id,
                fecha_cierre: e.querySelector('.fecha_cierre').innerText,
                fecha_cierre_real: e.querySelector('.fecha_cierre_real').innerText
            };
            observacion.push(fila);
        });

        let fila_reporte = {
            api_id: selectapi.options[selectapi.selectedIndex].id,
            contrato_id: selectcontrato.options[selectcontrato.selectedIndex].id,
            area_id: selectarea.options[selectarea.selectedIndex].id,
            sistema: inputsistema.value,
            subsistema: inputsubsistema.value,
            caminata: inputcaminata.value,
            top: inputtop.value,
            fecha: inputfechayhora.value,
            exist_file: file_exist
        }

        reporte.push(fila_reporte);

        $.ajax({
            url: 'savewalkreport/',
            type: 'POST',
            data: {
                action: 'save_data_report',
                'observacion[]': JSON.stringify(observacion), csrfmiddlewaretoken: '{{ csrf_token }}',
                'reporte[]': JSON.stringify(reporte), csrfmiddlewaretoken: '{{ csrf_token }}',
            },
            dataType: 'JSON',

        }).done(function (data) {

            if (file_val === 0) {
                messageSucces(data);
            }

        }).fail(function (data) {
            Swal.fire("Reporte de Caminata No Agregado", "Verifique los datos a ingresar", "warning");
            return false;
        });

        if (file_val===1) {
            $.ajax({
                url: 'savefiles/',
                type: 'POST',
                data: data,
                contentType: false,
                processData: false,
                dataType: 'json',
            }).done(function (data) {

                messageSucces(data);

            }).fail(function (data) {
                Swal.fire("Reporte No Agregado", "Verifique que imagenés esten correctas", "warning");
                return false;
            });
        }

    });
});