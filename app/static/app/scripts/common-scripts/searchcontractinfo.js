$(function () {
    $('select[name="contract"]').on('change', function () {

        var id_select = this.id;
        var id = $('#' + id_select).val();

        if (id === '') {
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_only_contract', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
                $("label[name='enterprise']").text(data[0].enterprise);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        });
    });
});