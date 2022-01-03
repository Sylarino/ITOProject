$(function () {
    $('select[name="sistem"]').on('change', function () {

        var id_select = this.id;
        var id = $('#' + id_select).val();
        var select_subsistem = $('select[name="subsistem"]');
        var options = '<option id="0" disabled selected>Seleccione Subsistema</option>';

        if (id === '') {
            select_subsistem.html(options);
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_subsistem_id', id: id },
            url: "/searchsubsistem",
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
                $.each(data, function (key, value) {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.subsistema + '</option>';
                });
                return false;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_subsistem.html(options);
        });
    });
});