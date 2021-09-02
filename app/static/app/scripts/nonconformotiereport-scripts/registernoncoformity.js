//const { json } = require("modernizr");

var i = 0;
var dataImgNonCon = [];

$(function () {

    document.getElementById("file-noncon").onchange = function (e) {

        var largo = 0;
        var largo_temp = 0;
        if (dataImgNonCon.length > 0) {

            largo = dataImgNonCon.length;
            largo_temp = largo + 1;

        }

        var inc = 0;

        for (var x = 0; x < (e.target.files.length); x++) {

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[x]);

            dataImgNonCon[largo_temp + x] = e.target.files[x];

            reader.onload = function () {

                var section = document.getElementById("section-img-noncon");
                var image = document.createElement('img');
                var but = document.createElement('input');
                var div = document.createElement('div');

                div.setAttribute("class", "col-md-4 form-report");
                div.setAttribute("id", "div_" + (largo_temp + inc));
                but.setAttribute("class", "btn btn-danger");
                but.setAttribute("value", "Borrar");
                but.setAttribute("type", "button");
                image.setAttribute("id", "img_" + (largo_temp + inc));
                image.setAttribute("class", "img-thumbnail");
                but.setAttribute("onclick", "eliminarImg(" + (largo_temp + inc) +");")

                image.src = reader.result;

                section.append(div);
                div.append(image);
                div.insertBefore(but, image);

                inc++;
            }
        }

        return dataImgNonCon;
    
    };

});

function eliminarImg(id) {

    deleteDiv = document.getElementById("div_" + id).parentNode;
    imgDiv = document.getElementById("div_" + id);

    deleteDiv.removeChild(imgDiv);

    id_img_div = parseInt(imgDiv.id.replace('div_', ''));
    
    dataImgNonCon.splice(id_img_div, 1);

}

$(function () {
    document.getElementById("reset-input").onclick = function () {
        document.getElementById("file-noncon").value = "";
    }
});

$(function () {

    document.getElementById("btn_save_noncor_report").onclick = function () {

        var api = document.querySelector("#noncon_api_id");
        var contrato = document.querySelector("#noncon_con_id");
        var auditoria = document.querySelector("#noncon_audi_id");
        var corrrelativo = document.querySelector("#noncon_corre_id");
        var item = document.querySelector("#noncon_item_id");
        var area = document.querySelector("#noncon_area_id");
        var disciplina = document.querySelector("#noncon_disci_id");
        var fechacreacion = document.querySelector("#noncon_fecha_id");
        var sistema = document.querySelector("#noncon_sistem_id");
        var subsistema = document.querySelector("#noncon_subsis_id");
        var tag = document.querySelector("#noncon_tag_id");
        var criticidad = document.querySelector("#noncon_cri_id");
        var origen = document.querySelector("#noncon_ori_id");
        var clasificacion = document.querySelector("#noncon_clasi_id");
        var criterio_referencia = document.querySelector("#noncon_cri_ref_id");
        var requisito_incumplido = document.querySelector("#noncon_requi_id");
        var descripcion_detallada = document.querySelector("#noncon_desc_det_id");
        var observaciones = document.querySelector("#noncon_obs_id");
        var originador = document.querySelector("#noncon_originador_id");
        var criterio_especifico = document.querySelector("#noncon_cri_esp_id");
        var num_transmital_envio = document.querySelector("#noncon_num_tran_id");
        var num_transmital_accion = document.querySelector("#noncon_num_envio_id");
        var n_ncr_emitida = document.querySelector("#noncon_num_ncr_id");
        var estatus = document.querySelector("#noncon_stat_id");
        var fecha_compromiso = document.querySelector("#noncon_fecha_comp_id");
        var fecha_cierre = document.querySelector("#noncon_fecha_cierre_id");

        var data = new FormData();

        for (var key in dataImgNonCon) {
            data.append('images', dataImgNonCon[key]);
        }

        var largo = dataImgNonCon.length;

        if (largo > 0) {
            val_img = 1;
        } else {
            val_img = 0;
        }

        let reporte = {

            id_api: api.options[api.selectedIndex].id,
            id_contrato: contrato.options[contrato.selectedIndex].id,
            audit: auditoria.value,
            correlative: corrrelativo.value,
            item_non: item.value,
            area_non: area.options[area.selectedIndex].id,
            discipline: disciplina.options[disciplina.selectedIndex].id,
            created_at: fechacreacion.value,
            sistem: sistema.value,
            subsistem: subsistema.value,
            tag_non: tag.value,
            critical: criticidad.value,
            origin: origen.value,
            clasification: clasificacion.value,
            reference_standar: criterio_referencia.value,
            requirement: requisito_incumplido.value,
            description: descripcion_detallada.value,
            observation: observaciones.value,
            register_by: originador.options[originador.selectedIndex].id,
            specific_standar: criterio_especifico.value,
            num_envio: num_transmital_envio.value,
            num_accion: num_transmital_accion.value,
            num_ncr: n_ncr_emitida.value,
            status: estatus.value,
            stipulated_date: fecha_compromiso.value,
            close_date: fecha_cierre.value,
            exist_file: val_img

        }

        data.append('reporte[]', JSON.stringify(reporte));

        $.ajax({

            url: 'saveimages/',
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            dataType: 'json',

        }).done(function (data) {

            messageSucces(data, 'nonconformity', 'downloadpdfnoncon');

        }).fail(function (data) {

            Swal.fire("Reporte No Agregado", "Verifique que imagenés esten correctas", "warning");
            return false;

        });

    }

});
