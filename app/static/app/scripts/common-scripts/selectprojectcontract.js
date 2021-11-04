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
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_act_pro.html(options);
        });
    });
});