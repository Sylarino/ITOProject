//var data_requisitos = [];

//$(function () {
//    $('select[name="contract"]').on('change', function () {

//        var id_select = this.id;
//        var requisitos = '';
//        var id = $('#' + id_select).val();
//         
//        $.ajax({
//            type: 'GET',
//            data: { action: 'search_contract_require', id: id },
//            url: "/searchcontractsrequire",
//            dataType: 'json',
//        }).done(function (data) {
//            if (!data.hasOwnProperty('error')) {

//                data_requisitos = [];

//                let datamap = data.map(item => {
//                    return [item.id_grupo, item]
//                });

//                var datamaparr = new Map(datamap); // Pares de clave y valor

//                let result = [...datamaparr.values()];

//                $.each(result, function (key, value) {

//                    requisitos += `<div class="accordion-item">
//                                        <h2 class="accordion-header " id="heading`+ value.id_grupo +`">
//                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse`+ value.id_grupo + `" aria-controls="collapse` + value.id_grupo +`">
//                                                `+ value.grupo_nombre +`
//                                            </button>
//                                        </h2>
//                                    <div id="collapse`+ value.id_grupo + `" class="accordion-collapse collapse show" aria-labelledby="heading` + value.id_grupo +`" data-bs-parent="#accordionExample">
//                                        <div class="accordion-body">
//                                            <table class="table table-striped">
//                                                <thead>
//                                                    <tr>
//                                                        <th scope="row">Requisito</th>
//                                                        <th scope="row">Referencia</th>
//                                                        <th scope="row">Cumplimiento</th>
//                                                        <th scope="row">Metodo de verificacion</th>
//                                                        <th scope="row">Resultado Auditoria</th>
//                                                    </tr>
//                                                </thead>
//                                                <tbody id="tabla-isc-`+ value.id_grupo +`">`

//                    data_requisitos.push(value.id_grupo);

//                    $.each(data, function (key2, dato) {

//                        if (value.id_grupo == dato.id_grupo) {
//                            requisitos += `<tr> 
//                                            <th id="td-requisito-` + dato.id_requisito + `" class="requisito-td row-quality-style" scope="row">` + dato.nombre_requisito + `</th>
//                                            <th scope="row">` + dato.referencia + `</th>
//                                            <th id="cumplimiento" scope="row">
//                                                <div class="form-check form-check-inline">
//                                                    <input class="form-check-input" type="radio" name="td-requisito-` + dato.id_requisito + `" id="inlineRadio1" value="option1">
//                                                    <label class="form-check-label text-muted" for="inlineRadio1">Si</label>
//                                                </div>
//                                                <div class="form-check form-check-inline">
//                                                    <input class="form-check-input" type="radio" name="td-requisito-` + dato.id_requisito + `" id="inlineRadio2" value="option2">
//                                                    <label class="form-check-label text-muted" for="inlineRadio2">No</label>
//                                                </div>
//                                            </th>
//                                            <th>
//                                                <input id="met-verificacion" class="form-control" type="text" placeholder="Metodo de Verificacion" aria-label="default input example">
//                                            </th>
//                                            <th>
//                                                <input id="res-auditoria" class="form-control" type="text" placeholder="Resultado Auditoria" aria-label="default input example">
//                                            </th>
//                                        </tr>`
//                        }

//                    });


//                    requisitos += `</tbody></table></div></div></div>`

//                });

//                if (data.length == 0) {

//                    requisitos += `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
//                                      <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
//                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
//                                      </symbol>
//                                      <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
//                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
//                                      </symbol>
//                                      <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
//                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
//                                      </symbol>
//                                    </svg>

//                                    <div class="alert alert-warning d-flex align-items-center" role="alert">
//                                      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
//                                      <div>
//                                        Contrato no posee requisitos de calidad registrados. 
//                                        <a href="/addqualityrequirement/" class="link-primary">Ingrese aqui para cargar requisitos al contrato.</a> 
//                                      </div>
//                                    </div>`
//                }

//                return false;

//            }
//        }).fail(function (jqXHR, textStatus, errorThrown) {
//            alert(textStatus + ': ' + errorThrown);
//        }).always(function (data) {
//            $("#accordionExample").html(requisitos);
//        });
//    });
//});

$(function () {
    $('input[type="radio"]').on('change', this, function () {
        var requisitos_grupo = $(this).parent().parent().parent().parent().attr('id');
        requisitos_grupo = requisitos_grupo.replace('tabla-isc-', '');
         
        var inc_radio = 0;
        var inc_group = 0;
        document.querySelectorAll('#tabla-isc-' + requisitos_grupo + ' tr').forEach(function (e) {
            var id_req = e.querySelector('.requisito-td').id;
            id_req = id_req.replace('td-requisito-', '');
            inc_group++;
            if ($("input:radio[name='td-requisito-" + id_req + "']:radio").is(':checked')) {
                inc_radio++;
            }
        });

        var porcentaje = ((inc_radio * 100) / inc_group);
        porcentaje = Math.trunc(porcentaje);
        $("#progress-gr-" + requisitos_grupo).css("width", porcentaje + "%");
        if (porcentaje == 100) {
            $("#progress-gr-" + requisitos_grupo).switchClass("bg-danger", "bg-success", 500, "linear");
        }
    });
});

$(function () {

    document.getElementById("btn-save-iscreport").onclick = function (e) {

        var requirements = []
        var contract = document.querySelector('#isc_con_id');
        var correlativo = document.querySelector("#isc_corr_id");
        var auditoria = document.querySelector("#isc_audit_id");
        var fecha_isc = document.querySelector("#isc_date_id");
        var requisitos_in = document.getElementsByName('grupos-requisitos');
        var req_largo = requisitos_in.length;
        var files_submit = document.querySelector("#file-iscreport");
        var data = new FormData();

        for (var x = 0; x < (files_submit.files.length); x++) {
            data.append('files', files_submit.files[x]);
        }

        for (var i = 0; i < req_largo; i++) {
            var id_div = requisitos_in[i].id

            //if ($("#progress-gr-" + id_div).css("width") != "100%") {
            //    Swal.fire("Lista de Verificacion NO registrada",
            //        "Verifique que requisitos de calidad esten completos",
            //        "warning");
            //    return false;
            //}

            id_div = id_div.replace('div-container-', '');
            document.querySelectorAll('#tabla-isc-' + id_div + ' tr').forEach(function (e) {
                var id_req = e.querySelector('.requisito-td').id;
                id_req = id_req.replace('td-requisito-', '');
                if ($("input:radio[name='td-requisito-" + id_req + "']:radio").is(':checked')) {
                    var opcion = $('input:radio[name="td-requisito-' + id_req + '"]:checked').val();
                } else {
                    var opcion = 'not-selected'
                }
                let fila = {
                    id_grupo: id_div,
                    id_requisito: id_req,
                    metodo_verificacion: e.querySelector('#met-verificacion').value,
                    auditoria: e.querySelector('#res-auditoria').value,
                    cumplimiento: opcion,
                };
                requirements.push(fila);
            });
        }

        data.append('requirements[]', JSON.stringify(requirements));
        data.append('id', contract.options[contract.selectedIndex].id);
        data.append('corr', correlativo.value);
        data.append('audit', auditoria.value);
        data.append('date_isc', fecha_isc.value);

        $.ajax({

            url: 'saveregisteriscreport/',
            type: 'POST',
            data: data,
            dataType: 'JSON',
            contentType: false,
            processData: false,

        }).done(function (data) {

            if (data.submit == 'success') {
                messageSucces(data, 'iscreport', 'downloadpdfiscreportregistered');
            }

        }).fail(function (data) {

            Swal.fire("Requisitos no agregados", "Verifique los datos a ingresar", "warning");
            return false;

        });

    };

});
