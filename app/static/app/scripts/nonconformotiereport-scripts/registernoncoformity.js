var i = 0;
var dataImgNonCon = {};

$(function () {
    document.getElementById("file-noncon").onchange = function (e) {

        debugger;
        for (var x = 0; x < e.target.files.length; x++) {

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[x]);

            dataImgNonCon[i] = e.target.files[x];

            reader.onload = function () {

                var section = document.getElementById("section-img-noncon");
                var image = document.createElement('img');
                var but = document.createElement('input');
                var div = document.createElement('div');

                div.setAttribute("class", "col-md-4 form-report");
                div.setAttribute("id", "div_" + i);
                but.setAttribute("class", "btn btn-danger");
                but.setAttribute("value", "Borrar");
                but.setAttribute("type", "button");
                image.setAttribute("id", "img_" + i);
                image.setAttribute("class", "img-thumbnail");
                but.setAttribute("onclick","eliminarImg("+ i +");")

                image.src = reader.result;

                section.append(div);
                div.append(image);
                div.insertBefore(but, image);

                //but.onclick = function () {

                //    var ultimo = document.getElementById("div_" + i);
                //    section.removeChild(ultimo);
                //    /*Incrementable*/
                //    i = i - 1;
                //    dataImgNonCon[i].remove();

                //    return dataImgNonCon;

                //}

                i = i + 1;
            }

        }

        return dataImgNonCon;
    
    };
});

function eliminarImg(id) {

    deleteDiv = document.getElementById("div_" + id).parentNode;
    imgDiv = document.getElementById("div_" + id);

    deleteDiv.removeChild(imgDiv);

    id_img_div = imgDiv.id.replace('div_mod_', '');

    for (var m = 0; m < dataImgNonCon.length; m++) {

        if (dataImgNonCon[m][0] == id_img_div) {

            dataImgNonCon[m].splice(m, 1);

        }

    }

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

        for (var x = 0; x < dataImgNonCon.length; x++) {
            var file = dataImgNonCon[x];
            data.append('images', file);
        }

        debugger;

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
            close_date: fecha_cierre.value
        }

        debugger;

        $.ajax({
            url: 'savenonconformityreport/',
            type: 'POST',
            data: {
                action: 'save_data_report',
                'reporte[]': JSON.stringify(reporte), csrfmiddlewaretoken: '{{ csrf_token }}',
            },
            dataType: 'JSON',
        }).done(function (data) {

            if (file_val === 0) {
                messageSuccessPDF(data);
            }

        }).fail(function (data) {
            Swal.fire("Reporte de No Conformidad No Agregado",
                        "Verifique los datos a ingresar",
                        "warning");
            return false;
        });

    }
});
