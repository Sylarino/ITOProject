var inc_walk = 0;

$(function () {
    document.getElementById("btn_add_walk").onclick = function (e) {
        inc_walk = inc_walk + 1;

        //Variablas elementos de recursos EECC
        var descripcion = document.getElementById("con-desc-walk");
        var ubicacion = document.getElementById("con-place-walk");
        var nplano = document.getElementById("con-plane-walk");
        var codigoequipo = document.getElementById("con-equicode-walk");
        var disciplina = document.getElementById("con-disci-walk");
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
    td_actual = document.getElementById(select_tr.id);
    td_parent = td_actual.parentNode;
    td_parent.removeChild(td_actual);
}

$(function () {
    $('select[name="area"]').on('change', function () {

        var id_select = this.id;

        var id = $('#' + id_select).val();
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

        let observacion = [];

        var selectapi = document.getElementById("ant-api-walk");
        var selectcontrato = document.getElementById("ant-contract-walk");
        var selectarea = document.getElementById("ant-wbs-walk");
        var inputsistema = document.getElementById("ant-sistem-walk");
        var inputcaminata = document.getElementById("ant-numwalk-walk");
        var inputtop = document.getElementById("ant-top-walk");
        var inputsubsistema = document.getElementById("ant-subsistem-walk");
        var inputfiles = document.getElementById('file_walk');
        var data = new FormData();

        for (var x = 0; x < inputfiles.files.length; x++) {
            var file = inputfiles.files[x];
            data.append('files', file);
        }

        if (inputfiles.files.length > 0) {
            var file_exist = 1;
        } else {
            var file_exist = 0;
        }

        document.querySelectorAll('#tbody-walk tr').forEach(function (e) {
            let fila = {
                codigo_equipo: e.querySelector('.codigo_equipo').innerText,
                ubicacion: e.querySelector('.ubicacion_td').innerText,
                num_plano: e.querySelector('.nplano').innerText,
                disciplina_id: e.querySelector('.disciplina').id,
                descripcion: e.querySelector('.descripcion').innerText,
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
            sistema: inputsistema.options[inputsistema.selectedIndex].id,
            subsistema: inputsubsistema.options[inputsubsistema.selectedIndex].id,
            caminata: inputcaminata.value,
            top: inputtop.value,
            exist_file: file_exist
        }

        data.append('reporte[]',JSON.stringify(fila_reporte));
        data.append('observaciones[]',JSON.stringify(observacion));

        $.ajax({
            url: 'savefiles/',
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            dataType: 'json',
        }).done(function (data) {
            messageSuccessPDF(data);
        }).fail(function (data) {
            Swal.fire("Reporte No Agregado", "Verifique que los datos esten correctos", "warning");
            return false;
        });
        

    });
});

function downloadwalkreport(id_pdf) {
    $.ajax({
        type: 'POST',
        data: { 'id': id_pdf, csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "downloadwalkpdf/",
        success: function (response) {
            var blob = new Blob([response], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "REPORT_N" + id_pdf + ".pdf";
            link.click();
        }
    });
}

function messageSuccessPDF(data) {

    if (data.submitted == 1) {

        swal.fire("Guardado", "Reporte N°" + data.id_report + " agregado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                downloadwalkreport(data.id_report);
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

$(function () {
    $('a[name="a-modal"]').on('click', function () {

        var $ = jQuery.noConflict();
        var id_modal = $(this).attr("id");
        if (id_modal == "modal-user") {
            var link_modal = 'registeruser';
        } 
        
        if (id_modal == "modal-sistem"){
            var link_modal = 'registersistem';
        }

        if (id_modal == "modal-subsistem"){
            var link_modal = 'registersubsistem';
        }
    
        $('#registro').load(link_modal+'/', function () {
            $(this).modal('show');
        });
        
    });
});



function agregarUsuario() {

    var usuario = document.getElementById("username");
    var nombres = document.getElementById("names");
    var apellidos = document.getElementById("email-user");
    var correo = document.getElementById("last-names");

    $.ajax({
        url: 'registernewuser/',
        type: 'POST',
        data: {
            action: 'save_user',
            user: usuario.value,
            names: nombres.value,
            last_name: apellidos.value,
            email: correo.value
        },
        dataType: 'JSON',

    }).done(function (data) {

        messageSuccesData(data, "Usuario");

    }).fail(function (data) {
        Swal.fire("Usuario No Agregado", "Verifique los datos a ingresar", "warning");
        return false;
    });

}

function messageSuccesData(data, dato_real) {

    if (data.submitted == 1) {
        Swal.fire(dato_real + " Agregado", "Se ha agregado un usuario satisfactoriamente", "success");
    }

}

function agregarSistema() {

    var sistema = document.getElementById("sistem_name");

    $.ajax({
        url: 'registernewsistem/',
        type: 'POST',
        data: {
            action: 'save_sistem',
            data_name: sistema.value,
            column_data: 'sistem'
        },
        dataType: 'JSON',

    }).done(function (data) {
        reloadSistem('sistem', 'Sistema');
        messageSuccesData(data, "Sistema");
    }).fail(function (data) {
        Swal.fire("Sistema No Agregado", "Verifique los datos a ingresar", "warning");
        return false;
    });

}

function agregarSubSistema() {

    var subsistema = document.getElementById("subsistem_name");
    var sistema = document.getElementById("ant-sistem-walk");

    $.ajax({
        url: 'registernewsistem/',
        type: 'POST',
        data: {
            action: 'save_sistem',
            data_name: subsistema.value,
            column_data: 'subsistem',
            id_sistem: sistema.options[sistema.selectedIndex].id,
        },
        dataType: 'JSON',

    }).done(function (data) {
        reloadSistem('subsistem', 'SubSistema', sistema.options[sistema.selectedIndex].id);
        messageSuccesData(data, "SubSistema");
    }).fail(function (data) {
        Swal.fire("SubSistema No Agregado", "Verifique los datos a ingresar", "warning");
        return false;
    });

}

function reloadSistem(id, nombre, id_sistem=0) {
    var select_sistem = $('select[name="'+id+'"]');
    var options = '<option id="0" disabled selected>Seleccione '+nombre+'</option>';
    $.ajax({
        type: 'GET',
        data: { action: 'search_sistem', Id: id, sistem_id: id_sistem },
        url: "/searchsistems",
        dataType: 'json',
    }).done(function (data) {
        if (!data.hasOwnProperty('error')) {
            $.each(data, function (key, value) {
                options += '<option id="' + value.id + '" value="' + value.id + '">' + value.nombre + '</option>';
            });
            return false;
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {
        select_sistem.html(options);
        if (id == "sistem") {
            var select_subsistem = $('select[name="subsistem"]');
            select_subsistem.html('<option id="0" disabled selected>Seleccione SubSistema</option>');
        }
    });

}