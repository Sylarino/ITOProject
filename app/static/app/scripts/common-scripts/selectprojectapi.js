//Accion para ejecutar cuando hay un cambio en el select del proyecto
$(function () {
    $('select[name="api"]').on('change', function () {

        var id_select = this.id;

        var id = $('#' + id_select).val();
        var select_contracts = $('select[name="contract"]');
        var options = '<option id="0" disabled selected>Seleccione Contrato</option>';

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


