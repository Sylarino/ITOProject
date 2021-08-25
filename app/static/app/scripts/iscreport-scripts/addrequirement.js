var load_requirement = []

$(function () {

    document.getElementById("btn-load-require").onclick = function (e) {

        var grupo_requisito = document.getElementById("isc_requi_id");
        var tabla_requisito = document.getElementById("table-requirement")
        id_requi = grupo_requisito.options[grupo_requisito.selectedIndex].id;

        var requisito = '<tr id="tr_req_' + id_requi + '"> <td>' + grupo_requisito.options[grupo_requisito.selectedIndex].textContent + '</td>' +
            '<td> ISO 2008 </td>' +
            '<td><input class="btn btn-danger" type="button" onclick="abrir_modal_edicion(' + grupo_requisito.options[grupo_requisito.selectedIndex].id +');" value="Ver"></td>' +
            '<td><input class="btn btn-danger" type="button" onclick="eliminarRequisito(this);" value="Eliminar"></td>' +
            '</tr>';

        grupo_requisito.options[grupo_requisito.selectedIndex].disabled = true;
        $('#isc_requi_id').get(0).selectedIndex = 0;

        load_requirement.push(id_requi);
        tabla_requisito.innerHTML += requisito;

        debugger;
    };

});

$(function () {
    $('select[name="contract"]').on('change', function () {

        var id_select = this.id;

        var id = $('#' + id_select).val();
        var select_requirement = $('select[name="requirement"]');

        if (id === '') {
            select_requirement.html(options);
            return false;
        }
    
        $.ajax({
            type: 'GET',
            data: { action: 'search_contract_add', id: id },
            url: "/searchcontractsrequire",
            dataType: 'json',
        }).done(function (data) {

            if (!data.hasOwnProperty('error')) {

                $("#isc_requi_id option").each(function () {

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].id_grupo == $(this).attr('value')) {

                            $(this).attr("disabled", "disabled");

                        }
                             
                    }

                });

                return false;

            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_requirement.html(options);
        });

    });

});

function eliminarRequisito(e) {

    td_actual = e;
    td_parent = td_actual.parentNode;
    td_parent_2 = td_parent.parentNode;
    td_parent_3 = td_parent_2.parentNode;
    id_tr = td_parent_2.id.replace('tr_req_', '');
    td_parent_3.removeChild(td_parent_2);

    var largo_require = load_requirement.length;
    for (var i = 0; i < largo_require; i++) {
        if (parseInt(id_tr) == parseInt(load_requirement[i])) {
            load_requirement.splice(i, 1);
        }
    }

    var grupo_requisito = document.getElementById("isc_requi_id");

    var largo_options = grupo_requisito.length;

    for (var i = 1; i < largo_options; i++) {
        if (parseInt(id_tr) == parseInt(grupo_requisito[i].id)) {
            grupo_requisito[i].disabled = false;
        }
    }

}

function abrir_modal_edicion(id_group) {

    var $ = jQuery.noConflict();

    $('#edicion').load('searchrequirements/' + id_group, function () {

        $(this).modal('show');

    });

}

$(function () {

    document.getElementById("btn-save-require").onclick = function (e) {

        var selectpreanp = document.getElementById("isc_con_id");
        debugger;
        $.ajax({
            url: 'saverequirements/',
            type: 'POST',
            data: {
                action: 'save_qualities',
                id: selectpreanp.options[selectpreanp.selectedIndex].id,
                'qualities[]': JSON.stringify(load_requirement), csrfmiddlewaretoken: '{{ csrf_token }}',
            },
            dataType: 'JSON'
        }).done(function (data) {
            if (data.submit == 'success') {
                Swal.fire("Requisitos agregados", "Requisitos de Calidad agregados al contrato", "success");
                return false;
            }
        }).fail(function (data) {
            Swal.fire("Requisitos no agregados", "Verifique los datos a ingresar", "warning");
            return false;
        });
    };

});