$(function () {
    $('select[name="contract"]').on('change', function () {

        var id_select = this.id;
        var requisitos = '';
        var id = $('#' + id_select).val();
        debugger;
        $.ajax({
            type: 'GET',
            data: { action: 'search_contract_require', id: id },
            url: "/searchcontractsrequire",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {

                if (data.length == 0) {

                }
                let datamap = data.map(item => {
                    return [item.id_grupo, item]
                });

                var datamaparr = new Map(datamap); // Pares de clave y valor

                let result = [...datamaparr.values()];

                $.each(result, function (key, value) {

                    requisitos += `<div class="accordion-item">
                        <h2 class="accordion-header " id="heading`+ value.id_grupo +`">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse`+ value.id_grupo + `" aria-controls="collapse` + value.id_grupo +`">
                                `+ value.grupo_nombre +`
                            </button>
                        </h2>
                        <div id="collapse`+ value.id_grupo + `" class="accordion-collapse collapse show" aria-labelledby="heading` + value.id_grupo +`" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="row">Requisito</th>
                                            <th scope="row">Referencia</th>
                                            <th scope="row">Cumplimiento</th>
                                            <th scope="row">Metodo de verificacion</th>
                                            <th scope="row">Resultado Auditoria</th>
                                        </tr>
                                    </thead>
                                    <tbody>`

                    $.each(data, function (key, dato) {

                        requisitos += `<tr> <th class="row-quality-style" scope="row">` + dato.nombre_requisito + `</th>
                                   <th scope="row">` + dato.referencia + `</th>
                        <th scope="row">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                                    <label class="form-check-label text-muted" for="inlineRadio1">Si</label>
                                            </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
                                        <label class="form-check-label text-muted" for="inlineRadio2">No</label>
                                            </div>
                                        </th>
                                <th>
                                    <input class="form-control" type="text" placeholder="Metodo de Verificacion" aria-label="default input example">
                                        </th>
                                    <th>
                                        <input class="form-control" type="text" placeholder="Resultado Auditoria" aria-label="default input example">
                                        </th>
                                    </tr>`

                    });


                    requisitos += `</tbody></table></div></div></div>`

                });

                return false;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            $("#accordionExample").html(requisitos);
        });
    });
});