
function agregarHistorico(id_hist, actividad, cantidad, medida, total, refday, subactividad, cau, tot_acu, act_type, precondition, vala) {

    document.getElementById("select-act-" + vala + "-mod").value = actividad.textContent;

    if (act_type.id == 2) {
        $('input[name="input-subact-' + vala + '-mod"]').val(subactividad.textContent);
        document.getElementById("input-u-" + vala + "-mod").value = medida.textContent;

    } else {
        buscarSub(vala, subactividad.textContent);
        $('input[name="input-u-' + vala + '-mod"]').val(medida.textContent);

    }

    $('input[name="input-te-' + vala + '-mod"]').val(total.textContent);
    $('input[name="input-cr-' + vala + '-mod"]').val(cantidad.textContent);
    $('input[name="input-cr-' + vala + '-mod"]').attr('id', id_hist + "def");
    $('input[name="input-rf-' + vala + '-mod"]').val(refday.textContent);
    $('input[name="input-ta-' + vala + '-mod"]').val(tot_acu.textContent);
    $('input[name="input-u-' + vala + '-mod"]').val(medida.textContent);
    $('input[name="input-u-' + vala + '-mod"]').attr('id',medida.id);
    document.getElementById("select-cau-" + vala + "-mod").value = cau.textContent;
    document.getElementById("select-pre-" + vala + "-mod").value = precondition.textContent;
}

function modificarHistorico(id) {

    //debugger;
    //var tr = getFila($(this));
    //var oseleccionado = */

    ides = 1;
    actividad = document.getElementById(id).getElementsByClassName("actividad")[0];

    cantidad = document.getElementById(id).getElementsByClassName("cantidad")[0];
    medida = document.getElementById(id).getElementsByClassName("medida")[0];
    total = document.getElementById(id).getElementsByClassName("total")[0];
    refday = document.getElementById(id).getElementsByClassName("refday")[0];
    subactividad = document.getElementById(id).getElementsByClassName("subactividad")[0];
    causano = document.getElementById(id).getElementsByClassName("causa-no")[0];
    total_acumulado = document.getElementById(id).getElementsByClassName("total_acumulado")[0];
    activity_type = document.getElementById(id).getElementsByClassName("activity_type")[0];
    precondition = document.getElementById(id).getElementsByClassName("precondition")[0];

    let val_act = "";

    if (activity_type.id == 1) {
        val_act = "ap";
    } else {
        val_act = "anp"
    }

    agregarHistorico(id, actividad, cantidad, medida, total, refday, subactividad, causano, total_acumulado, activity_type, precondition, val_act);

}

function getFila(obj) {
    if (obj.closest('tr').hasClass(child)) {
        return obj.closest('tr').prev();
    } else {
        return obj.closest('tr');
    }
}


function buscarSub(act, subactividad) {
    var select_act_ap = document.getElementById("select-act-"+act+"-mod");
    var id = select_act_ap.options[select_act_ap.selectedIndex].id;
    var select_sub_ap = $('select[name="select-sub-'+act+'-mod"]');
    var options = '<option disabled selected>Seleccione Sub Actividad</option>';

    if (id === '') {
        select_sub_ap.html(options);
        return false;
    }

    $.ajax({
        type: 'GET',
        data: { action: 'search_subactivity', id: id },
        url: "/buscarcontratos",
        dataType: 'json',
    }).done(function (data) {

        if (!data.hasOwnProperty('error')) {

            $.each(data, function (key, value) {
                if (subactividad == value.subactivity_name) {
                    options += '<option selected id="' + value.id + '" value="' + value.id + '">' + value.subactivity_name + '</option>';
                } else {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.subactivity_name + '</option>';
                }
            });

            return false;
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    }).always(function (data) {
        select_sub_ap.html(options);
    });
}

$(function () {
    $('select[name="select-act-ap-mod"]').on('change', function () {
        buscarSub("ap", " ");
    });
});

$(function () {
    $('select[name="select-act-anp-mod"]').on('change', function () {
        buscarSub("anp", " ");
    });
});

function agregarModificado() {
    inputcr = document.getElementsByName("input-cr-ap-mod")[0];
    let id_hist = inputcr.id.replace('def', '');

    actividad = document.getElementsByName("select-act-ap-mod")[0];
    subactividad = document.getElementsByName("select-sub-ap-mod")[0];
    cantidad = document.getElementsByName("input-cr-ap-mod")[0];
    medida = document.getElementsByName("input-u-ap-mod")[0];
    total_pro = document.getElementsByName("input-te-ap-mod")[0];
    refday = document.getElementsByName("input-rf-ap-mod")[0];
    total_acumulado = document.getElementsByName("input-ta-ap-mod")[0];
    causano = document.getElementsByName("select-cau-ap-mod")[0];
    precondition = document.getElementsByName("select-pre-ap-mod")[0];

    actividad_td = document.getElementById(id_hist).getElementsByClassName("actividad")[0];
    cantidad_td = document.getElementById(id_hist).getElementsByClassName("cantidad")[0];
    medida_td = document.getElementById(id_hist).getElementsByClassName("medida")[0];
    total_td = document.getElementById(id_hist).getElementsByClassName("total")[0];
    refday_td = document.getElementById(id_hist).getElementsByClassName("refday")[0];
    subactividad_td = document.getElementById(id_hist).getElementsByClassName("subactividad")[0];
    causano_td = document.getElementById(id_hist).getElementsByClassName("causa-no")[0];
    total_acumulado_td = document.getElementById(id_hist).getElementsByClassName("total_acumulado")[0];
    activity_type_td = document.getElementById(id_hist).getElementsByClassName("activity_type")[0];
    precondition_td = document.getElementById(id_hist).getElementsByClassName("precondition")[0];

    actividad_td.textContent = actividad.options[actividad.selectedIndex].textContent;
    actividad_td.id = actividad.options[actividad.selectedIndex].id;
    cantidad_td.textContent = cantidad.value;
    cantidad_td.id = cantidad.id;
    medida_td.textContent = medida.value;
    medida_td.id = medida.id;
    total_td.textContent = total_pro.value;
    refday_td.textContent = refday.value;
    refday_td.id = refday.id;
    causano_td.textContent = causano.options[causano.selectedIndex].textContent;
    causano_td.id = causano.options[causano.selectedIndex].id;
    total_acumulado_td.textContent = total_acumulado.value;
    activity_type_td.textContent = refday.value;
    precondition_td.textContent = precondition.options[precondition.selectedIndex].textContent;
    precondition_td.id = precondition.options[precondition.selectedIndex].id;

}

function agregarEquipoModificado() {
    inputcr = document.getElementsByName("id-cantidad-equi-mod")[0];
    let id_equi = inputcr.id.replace('def', '');

    actividad = document.getElementsByName("select-act-equi-mod")[0];
    cantidad = document.getElementsByName("id-cantidad-equi-mod")[0];
    equipo = document.getElementsByName("id-nombre-equi-mod")[0];
    dot_directa = document.getElementsByName("id-dotdi-equi-mod")[0];
    dot_referencial = document.getElementsByName("id-dotref-equi-mod")[0];
    dot_indirecta = document.getElementsByName("id-dotind-equi-mod")[0];

    actividad_td = document.getElementById(id_equi).getElementsByClassName("actividad")[0];
    cantidad_td = document.getElementById(id_equi).getElementsByClassName("cantidad")[0];
    equipo_td = document.getElementById(id_equi).getElementsByClassName("equipo")[0];
    dot_directa_td = document.getElementById(id_equi).getElementsByClassName("dotacion-directa")[0];
    dot_referencial_td = document.getElementById(id_equi).getElementsByClassName("dotacion-referencial")[0];
    dot_indirecta_td = document.getElementById(id_equi).getElementsByClassName("dotacion-indirecta")[0];

    actividad_td.textContent = actividad.options[actividad.selectedIndex].textContent;
    actividad_td.id = actividad.options[actividad.selectedIndex].id;
    equipo_td.textContent = equipo.options[equipo.selectedIndex].textContent;
    equipo_td.id = equipo.options[equipo.selectedIndex].id;
    cantidad_td.textContent = cantidad.value;
    dot_directa_td.textContent = dot_directa.value;
    dot_referencial_td.textContent = dot_referencial.value;
    dot_indirecta_td.textContent = dot_indirecta.value;

}

function agregarEquipo(id, actividad, cantidad, equipo, dotdirecta, dotreferencia, dotindirecta) {

    $('input[name="id-cantidad-equi-mod"]').val(cantidad.textContent);
    $('input[name="id-cantidad-equi-mod"]').removeAttr("readonly");
    $('input[name="id-dotdi-equi-mod"]').val(dotdirecta.textContent);
    $('input[name="id-dotdi-equi-mod"]').removeAttr("readonly")
    $('input[name="id-dotref-equi-mod"]').val(dotreferencia.textContent);
    $('input[name="id-dotref-equi-mod"]').removeAttr("readonly")
    $('input[name="id-dotind-equi-mod"]').val(dotindirecta.textContent);
    $('input[name="id-dotind-equi-mod"]').removeAttr("readonly")
    $('input[name="id-cantidad-equi-mod"]').attr('id', id + "def");
    document.getElementById("select-act-equi-mod").value = actividad.textContent;
    document.getElementById("id-nombre-equi-mod").value = equipo.textContent;

}

function modificarEquipo(id) {

    actividad = document.getElementById(id).getElementsByClassName("actividad")[0];
    cantidad = document.getElementById(id).getElementsByClassName("cantidad")[0];
    equipo = document.getElementById(id).getElementsByClassName("equipo")[0];
    dot_directa = document.getElementById(id).getElementsByClassName("dotacion-directa")[0];
    dot_referencial = document.getElementById(id).getElementsByClassName("dotacion-referencial")[0];
    dot_indirecta = document.getElementById(id).getElementsByClassName("dotacion-indirecta")[0];

    agregarEquipo(id, actividad, cantidad, equipo, dot_directa, dot_referencial, dot_indirecta);

}

function agregarReferenciaModificado() {
    inputcr = document.getElementsByName("input-ref-mod")[0];
    let id_ref = inputcr.id.replace('def', '');

    referencia = document.getElementsByName("select-ref-mod")[0];
    descripcion = document.getElementsByName("input-ref-mod")[0];
    debugger;
    referencia_td = document.getElementById(id_ref).getElementsByClassName("referencia")[0];
    descripcion_td = document.getElementById(id_ref).getElementsByClassName("descripcion")[0];

    referencia_td.textContent = referencia.options[referencia.selectedIndex].textContent;
    descripcion_td.textContent = descripcion.value;
}

function modificarReferencia(id) {

    referencia = document.getElementById(id).getElementsByClassName("referencia")[0];
    descripcion = document.getElementById(id).getElementsByClassName("descripcion")[0];

    $('input[name="input-ref-mod"]').val(descripcion.textContent);
    $('input[name="input-ref-mod"]').attr('id', id + "def");

    document.getElementById("select-ref-mod").value = referencia.textContent;
    
}

function modificarReporte(id_report) {

    let historicos = [];
    let equipos = [];
    let referencias = [];
    let reporte = [];

    var selectpreap = document.getElementById("select-pre-ap");
    var selectpreanp = document.getElementById("select-pre-anp");
    var especialidad = document.getElementById("especialidad_id");
    var desviacion = document.getElementById("desviacion");
    var plandeaccion = document.getElementById("plandeaccion");
    var evidenciaobs = document.getElementById("evidencia");

    if (especialidad.options[especialidad.selectedIndex].disabled) {
        Swal.fire("Reporte no Modificado", "Seleccione una Especialidad", "warning");
        return false;
    }

    //Recorrido de tabla de actividades
    document.querySelectorAll('.table-actividad tr').forEach(function (e) {

        if (e.querySelector('.activity_type').id == 1) {
            let fila = {
                id_subactividad: e.querySelector('.subactividad').id,
                id_actividad: e.querySelector('.actividad').id,
                cantidad_real: e.querySelector('.cantidad').innerText,
                id_medida: e.querySelector('.medida').id,
                id_precondicion: e.querySelector('.precondition').id,
                id_especialidad: especialidad.options[especialidad.selectedIndex].id,
                id_actividad_type: e.querySelector('.activity_type').id,
                id_conformidad: e.querySelector('.causa-no').id,
                total_estimado: e.querySelector('.total').innerText,
                referencia_diaria: e.querySelector('.refday').innerText,
                total_acumulado: e.querySelector('.total_acumulado').innerText,
                subactivity_no_program: " ",
                id_historico: e.querySelector('.total_acumulado').id
            };
            historicos.push(fila);
        } else {
            let fila = {
                id_subactividad: 358,
                id_actividad: e.querySelector('.actividad').id,
                cantidad_real: e.querySelector('.cantidad').innerText,
                id_medida: e.querySelector('.medida').id,
                id_precondicion: e.querySelector('.precondition').id,
                id_especialidad: especialidad.options[especialidad.selectedIndex].id,
                id_actividad_type: e.querySelector('.activity_type').id,
                id_conformidad: e.querySelector('.causa-no').id,
                total_estimado: e.querySelector('.total').innerText,
                referencia_diaria: e.querySelector('.refday').innerText,
                total_acumulado: e.querySelector('.total_acumulado').innerText,
                subactivity_no_program: e.querySelector('.subactividad').innerText,
                id_historico: e.querySelector('.total_acumulado').id
            };
            historicos.push(fila);
        }

    });

    //Recorrido de tabla de equipos
    document.querySelectorAll('.tabla-equipo tr').forEach(function (e) {
        let fila = {
            id_actividad: e.querySelector('.actividad').id,
            id_equipo: e.querySelector('.equipo').id,
            cantidad: e.querySelector('.cantidad').innerText,
            dot_directa: e.querySelector('.dotacion-directa').innerText,
            dot_referen: e.querySelector('.dotacion-referencial').innerText,
            dot_indirecta: e.querySelector('.dotacion-indirecta').innerText,
            id_equipohist: e.querySelector('.cantidad').id
        };
        equipos.push(fila);
    });

    //Recorrido de tabla de referencias
    document.querySelectorAll('.table-referencia tr').forEach(function (e) {

        let fila = {
            descripcion: e.querySelector('.descripcion').innerText,
            referencia_id: e.querySelector('.referencia').id,
            id_ref_hist: e.querySelector('.descripcion').id,
        };
        referencias.push(fila);
    });


    var img_val = 0;
    var form_data = new FormData();

    if (img_mod.length != 0) {

        img_val = 1;
        for (var i = 0; i < img_mod.length; i++) {
            descripcion_img = document.getElementById("div_mod_" + img_mod[i][0]).getElementsByClassName("lab-img-sub")[0];
            subactividad_img = document.getElementById("div_mod_" + img_mod[i][0]).getElementsByClassName("subactividad")[0];

            img_mod[i][2] = subactividad_img.id;
            img_mod[i][3] = descripcion_img.textContent;

            form_data.append('image', img_mod[i][1]);
            form_data.append('observation', img_mod[i][3]);
            form_data.append('image_subactivity', img_mod[i][2]);
            form_data.append('report', img_mod[i][0]);
        }

    } else {

        img_val = 0;

    }

    let filareport = {
        desviacion: desviacion.value,
        plandeaccion: plandeaccion.value,
        evidencia_obs: evidenciaobs.value,
        id_seguimiento: $('input:radio[name=exampleRadios]:checked').val(),
        img_exist: img_val,
        report_id: id_report
    };

    reporte.push(filareport);

    //Conexion a traves de ajax
    $.ajax({
        url: 'modifiedactualreport/',
        type: 'POST',
        data: {
            action: 'save_report',
            'historico[]': JSON.stringify(historicos), csrfmiddlewaretoken: '{{ csrf_token }}',
            'referencias[]': JSON.stringify(referencias), csrfmiddlewaretoken: '{{ csrf_token }}',
            'equipos[]': JSON.stringify(equipos), csrfmiddlewaretoken: '{{ csrf_token }}',
            'reporte[]': JSON.stringify(reporte), csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        dataType: 'JSON',

    }).done(function (data) {

        if (img_val === 0) {

            messageSucces(data);

        }

    }).fail(function (data) {
        Swal.fire("Reporte No Modificado", "Verifique los datos a ingresar", "warning");
        return false;
    });


    debugger;

    if (img_val === 1) {

        $.ajax({
            url: 'savemodifiedimage/',
            type: 'POST',
            data: form_data,
            contentType: false,
            processData: false,
            dataType: 'json',
        }).done(function (data) {

            messageSucces(data);

        }).fail(function (data) {
            Swal.fire("Reporte No Modificado", "Verifique que imagenés esten correctas", "warning");
            return false;
        });

    }

    debugger;

}

var img_mod = [];

function obtenerNuevaImagen(input)  {
    console.log("llega");
    let reader = new FileReader();
    //i = i + 1;

    reader.readAsDataURL(input.files[0]);
    id_imgmod = $(input).attr('class');
    id_img_report = id_imgmod.replace('img-sub-', '');

    var pos = 0;
    esigual = false;

    if (img_mod.length == 0) {
        debugger;
        img_mod.push([id_img_report, input.files[0], 0, " "]);

    } 

    for (var i = 0; i < img_mod.length; i++) {

        if (parseInt(img_mod[i][0]) == parseInt(id_img_report)) {
            esigual = true;
            pos = i;
        }

    }

    if (esigual == true) {
        img_mod[pos][0] = id_img_report;
        img_mod[pos][1] = input.files[0];
        img_mod[pos][2] = " ";
        img_mod[pos][3] = " ";
    } else {
        img_mod.push([id_img_report, input.files[0], 0, " "]);
    }

    
    debugger;

    reader.onload = function () {

        old_image = document.getElementById("img_" + id_img_report);
        old_image.src = reader.result;

    };

};

function modificarImagen(id) {

    subactividad = document.getElementById(id).getElementsByClassName("subactividad")[0];
    descripcion = document.getElementById(id).getElementsByClassName("lab-img-sub")[0];
    debugger;
    document.getElementById("select-sub-img").value = subactividad.textContent;

    $('textarea[id="det-img"]').val(descripcion.textContent);
    $('textarea[id="det-img"]').attr('id', id + "def");

    div_mod = $('div[id="div-mod-container"]');

    button = document.createElement("input");
    button.setAttribute("class", "btn btn-danger");
    button.setAttribute("value", "Modificar");
    button.setAttribute("type", "button");
    div_mod.html(button);

    id_img = id;
    button.onclick = function agregarImgMod() {
        subactividad = document.getElementById(id_img).getElementsByClassName("subactividad")[0];
        descripcion = document.getElementById(id_img).getElementsByClassName("lab-img-sub")[0];

        inputcr = document.getElementById("det-img");

        subactividad_in = document.getElementsByName("select-sub-img")[0];
        descripcion_in = document.getElementsByName("det-img")[0];

        subactividad.textContent = subactividad_in.options[subactividad_in.selectedIndex].textContent;
        subactividad.id = subactividad_in.options[subactividad_in.selectedIndex].id;

        descripcion.textContent = descripcion_in.value;
    }

}

function eliminarImg(id) {

    deleteDiv = document.getElementById(id).parentNode;
    imgDiv = document.getElementById(id);
    debugger;
    deleteDiv.removeChild(imgDiv);

    id_img_div = imgDiv.id.replace('div_mod_', '');

    for (var i = 0; i < img_mod.length; i++) {

        if (img_mod[i][0] == id_img_div) {

            img_mod[i].splice(i, 1);

        }
    
    }

    debugger;
}

 function agregarReferencia() {

    i = i + 1;

    var refselectgen = document.getElementById("select-ref-mod");
    var refinput = document.getElementById("ref-name");
    var tablegen = document.getElementById("table-body");

    if ((refselectgen.options[refselectgen.selectedIndex].value == "") ||
        (refinput.value == "") ||
        (refselectgen.options[refselectgen.selectedIndex].value == "Seleccione Referencia")) {

        alert("Seleccione una opción valida y/o Escriba el nombre");

    } else {

        var td = document.createElement("td");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var button = document.createElement("input")

        button.className = "btn btn-danger";
        button.type = "button";
        button.value = "Eliminar";

        tr.id = "tr-ref" + i;
        td.textContent = refselectgen.options[refselectgen.selectedIndex].value;
        td.className = "referencia";
        td.id = refselectgen.options[refselectgen.selectedIndex].id;
        td1.textContent = refinput.value;
        td1.className = "descripcion";
        td1.id = 0;

        tablegen.append(tr);
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        td2.append(button);

        button.onclick = function () {
            tablegen.removeChild(tr);
            i = i - 1;
            return i;
        }
    }
};

$(function () {
    $('select[name="select-sub-ap-mod"]').on('change', function () {
        debugger;
        var id = $('#select-sub-ap-mod').val();
        var medidaid = document.getElementsByName("input-u-ap-mod");

        if (id === '') {
            $('input[name="input-u-ap-mod"]').val(" ");
            $('input[name="input-te-ap-mod"]').val(" ");
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_sub_p_info', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {


            if (!data.hasOwnProperty('error')) {
                $('input[name="input-u-ap-mod"]').val(data[0].measure);
                $('input[name="input-u-ap-mod"]').attr("value", data[0].measure_id)
                $('input[name="input-te-ap-mod"]').val(data[0].average_amount);
                $('input[name="input-ta-ap-mod"]').val(data[0].total);
                $('input[name="input-rf-ap-mod"]').val(data[0].ref_day);

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });
    });
});

function agregarHistgoricoProgramado() {

    i = i + 1;

    //Variablas elementos de actividades programadas
    var selectsubap = document.getElementById("select-sub-ap-mod");
    var selectactap = document.getElementById("select-act-ap-mod");
    var inputcrap = document.getElementById("input-cr-ap-mod");
    var inputuap = document.getElementById("input-u-ap-mod");
    var inputteap = document.getElementById("input-te-ap-mod");
    var inputrdap = document.getElementById("input-rd-ap-mod");
    var inputtaap = document.getElementById("input-ta-ap-mod");
    var selectcumap = document.getElementById("select-cum-ap-mod");
    var selectcauap = document.getElementById("select-cau-ap-mod");
    var selectdetap = document.getElementById("input-det-ap-mod");
    var tablegen = document.getElementById("table-actividad");
    var selectpreap = document.getElementById("select-pre-ap-mod");

    largo = acts_id.length;
    console.log(acts_id);

    for (var j = 0; j < largo; j++) {
        console.log(j);
        if (selectsubap.options[selectsubap.selectedIndex].id === acts_id[j]) {
            Swal.fire("Error", "Sub Actividad ya agregada.", "warning");
            return false;
        }
    }

    $(function () {

        if (selectactap.options[selectactap.selectedIndex].disabled ||
            selectsubap.options[selectsubap.selectedIndex].disabled) {
            Swal.fire("Error", "Seleccione una SubActividad o Actividad invalida.", "warning");
            return false;
        }

        if (selectcumap.options[selectcumap.selectedIndex].disabled) {
            Swal.fire("Error", "Seleccione si cumplío o no.", "warning");
            return false;
        } else {
            if (selectcumap.options[selectcumap.selectedIndex].textContent === "No") {
                if (selectcauap.options[selectcauap.selectedIndex].disabled) {
                    Swal.fire("Error", "Seleccione la causa del No Cumplimiento", "warning");
                    return false;
                }
            }
        }

        if (inputcrap.value === '') {
            Swal.fire("Error", "Ingrese el avance diario", "warning");
            return false;
        } else {
            if (validateDecimal(inputcrap.value) === false) {
                Swal.fire("Error", "Ingrese un avance diario valido", "warning");
                return false;
            }
        }

        if (inputcrap.value < 1) {
            Swal.fire("Error", "Ingrese un avance diario valido", "warning");
            return false;
        }

        if (selectpreap.options[selectpreap.selectedIndex].disabled) {
            Swal.fire("Error", "Seleccione un pre requisito.", "warning");
            return false;
        }

        $.ajax({
            type: 'GET',
            data: {
                action: 'search_subactivities',
                act: selectactap.options[selectactap.selectedIndex].textContent,
                subact: selectsubap.options[selectsubap.selectedIndex].textContent
            },
            url: "/buscarsubactividades",
            dataType: 'json',
        }).done(function (data) {

            if (!data.hasOwnProperty('error')) {
                if (data == 0) {
                    alert("Seleccione una opción valida y/o Escriba el nombre");
                } else {

                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var td3 = document.createElement("td");
                    var td4 = document.createElement("td");
                    var td5 = document.createElement("td");
                    var td6 = document.createElement("td");
                    var td7 = document.createElement("td");
                    var td8 = document.createElement("td");
                    var td9 = document.createElement("td");
                    var td10 = document.createElement("td");
                    var td11 = document.createElement("td");
                    var td12 = document.createElement("td");

                    var button = document.createElement("input")

                    button.className = "btn btn-danger";
                    button.type = "button";
                    button.value = "Eliminar";

                    tr.id = "tr-ap" + i;

                    td.textContent = selectsubap.options[selectsubap.selectedIndex].textContent;
                    td1.textContent = selectactap.options[selectactap.selectedIndex].textContent;
                    td2.textContent = inputcrap.value;
                    td3.textContent = inputuap.value;
                    td4.textContent = inputteap.value;
                    td5.textContent = inputrdap.value;
                    td6.textContent = inputtaap.value;
                    td7.textContent = selectcumap.options[selectcumap.selectedIndex].value;
                    td8.textContent = selectcauap.options[selectcauap.selectedIndex].value;
                    td9.textContent = selectdetap.value;
                    td10.textContent = "Actividad Programada";
                    td12.textContent = selectpreap.options[selectpreap.selectedIndex].value;

                    td.id = selectsubap.options[selectsubap.selectedIndex].id;
                    td4.id = selectactap.options[selectactap.selectedIndex].id;
                    td1.id = selectactap.options[selectactap.selectedIndex].id;
                    td7.id = selectcumap.options[selectcumap.selectedIndex].id;
                    td8.id = selectcauap.options[selectcauap.selectedIndex].id;
                    td12.id = selectpreap.options[selectpreap.selectedIndex].id;
                    td6.id = 0;

                    acts_id.push(selectsubap.options[selectsubap.selectedIndex].id);

                    td3.id = inputuap.getAttribute("value");
                    td10.id = 1;
                    td4.className = "total";
                    td1.className = "actividad";
                    td.className = "subactividad";
                    td2.className = "cantidad";
                    td3.className = "medida";
                    td5.className = "refday";
                    td6.className = "total_acumulado";
                    td8.className = "causa-no";
                    td10.className = "activity_type";
                    td12.className = "precondition";

                    if (selectcumap.value != "No") {
                        td8.id = 1;
                        td8.textContent = "Cumplido";
                    }

                    tablegen.append(tr);
                    tr.appendChild(td1);
                    tr.appendChild(td);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td8);
                    tr.appendChild(td6);
                    tr.appendChild(td10);
                    tr.appendChild(td12);
                    tr.appendChild(td11);
                    td11.append(button);

                    button.onclick = function () {
                        tablegen.removeChild(tr);
                        i = i - 1;
                        acts_id.splice(i, 1);
                        return i;
                        return acts_id;
                    }

                    return acts_id;
                }
            }
            //    message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });
    });
};
function agregarHistoricoNoProgramado() {

    i = i + 1;

    //Variablas elementos de actividades no programadas
    var selectsubanp = document.getElementById("input-subact-anp-mod");
    var selectactanp = document.getElementById("select-act-anp-mod");
    var inputcranp = document.getElementById("input-cr-anp-mod");
    var inputuanp = document.getElementById("input-u-anp-mod");
    var inputteanp = document.getElementById("input-te-anp-mod");
    var inputrdanp = document.getElementById("input-rf-anp-mod");
    var inputtaanp = document.getElementById("input-ta-anp-mod");
    var selectcumanp = document.getElementById("select-cum-anp-mod");
    var selectcauanp = document.getElementById("select-cau-anp-mod");
    var selectdetanp = document.getElementById("input-det-anp-mod");
    var selectpreanp = document.getElementById("select-pre-anp");
    var tablegen = document.getElementById("table-actividad");

    if (selectactanp.options[selectactanp.selectedIndex].disabled) {
        Swal.fire("Error", "Seleccione una SubActividad.", "warning");
        return false;
    }

    if ((selectsubanp.value == "")) {
        Swal.fire("Error", "Escriba una Sub Actividad valida.", "warning");
        return false;
    }

    if (selectcumanp.options[selectcumanp.selectedIndex].disabled) {
        Swal.fire("Error", "Seleccione si cumplío o no.", "warning");
        return false;
    } else {
        if (selectcumanp.options[selectcumanp.selectedIndex].textContent === "No") {
            if (selectcauanp.options[selectcauanp.selectedIndex].disabled) {
                Swal.fire("Error", "Seleccione la causa del No Cumplimiento", "warning");
                return false;
            }
        }
    }

    if (inputcranp.value === '') {
        Swal.fire("Error", "Ingrese el avance diario", "warning");
        return false;
    } else {
        if (validateDecimal(inputcranp.value) === false) {
            Swal.fire("Error", "Ingrese un avance diario valido", "warning");
            return false;
        }
    }

    if (inputcranp.value < 1) {
        Swal.fire("Error", "Ingrese un avance diario valido", "warning");
        return false;
    }

    if (selectpreanp.options[selectpreanp.selectedIndex].disabled) {
        Swal.fire("Error", "Ingrese un pre requisito", "warning");
        return false;
    }
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    var td7 = document.createElement("td");
    var td8 = document.createElement("td");
    var td9 = document.createElement("td");
    var td10 = document.createElement("td");
    var td11 = document.createElement("td");
    var td12 = document.createElement("td");

    var button = document.createElement("input")

    button.className = "btn btn-danger";
    button.type = "button";
    button.value = "Eliminar";

    tr.id = "tr-anp" + i;

    td.textContent = selectsubanp.value;
    td.id = selectactanp.options[selectactanp.selectedIndex].id;
    td1.textContent = selectactanp.options[selectactanp.selectedIndex].textContent;
    td2.textContent = inputcranp.value;
    td3.textContent = inputuanp.options[inputuanp.selectedIndex].value;
    td4.textContent = inputteanp.value;
    td5.textContent = inputrdanp.value;
    td6.textContent = inputtaanp.value;
    td7.textContent = selectcumanp.options[selectcumanp.selectedIndex].value;
    td8.textContent = selectcauanp.options[selectcauanp.selectedIndex].value;
    td12.textContent = selectpreanp.options[selectpreanp.selectedIndex].value;
    td12.id = selectpreanp.options[selectpreanp.selectedIndex].id;
    td9.textContent = selectdetanp.value;
    td10.textContent = "Actividad NO Programada";
    td1.className = "actividad";
    td.className = "subactividad";
    td4.className = "total";
    td5.className = "referencia-diaria";
    td6.className = "total_acumulado";
    td3.id = inputuanp.options[inputuanp.selectedIndex].id;
    td3.className = "medida";
    td2.className = "cantidad";
    td8.className = "causa-no";
    td10.className = "activity_type";
    td5.className = "refday";
    td12.className = "precondition";

    td1.id = selectactanp.options[selectactanp.selectedIndex].id;
    td7.id = selectcumanp.options[selectcumanp.selectedIndex].id;
    td8.id = selectcauanp.options[selectcauanp.selectedIndex].id;
    td6.id = 0;
    td10.id = 2;

    if (selectcumanp.value != "No") {
        td8.id = 1;
        td8.textContent = "Cumplido";
    }

    tablegen.append(tr);
    tr.appendChild(td1);
    tr.appendChild(td);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td8);
    tr.appendChild(td6);
    tr.appendChild(td10);
    tr.appendChild(td12);
    tr.appendChild(td11);
    td11.append(button);

    button.onclick = function () {
        tablegen.removeChild(tr);
        i = i - 1;
        return i;
    }

}

document.getElementById("id-nombre-equi-mod").onclick = function (e) {

    debugger;
    var select_causa = document.getElementById("id-nombre-equi-mod");
    if ((select_causa.options[select_causa.selectedIndex].textContent != "Seleccione Equipo")
        || (select_causa.options[select_causa.selectedIndex].textContent != "")) {
        document.getElementById('id-cantidad-equi-mod').readOnly = false;
        document.getElementById('id-dotdi-equi-mod').readOnly = false;
        document.getElementById('id-dotref-equi-mod').readOnly = false;
        document.getElementById('id-dotind-equi-mod').readOnly = false;

    } else {
        document.getElementById('id-cantidad-equi-mod').readOnly = true;
        document.getElementById('id-dotdi-equi-mod').readOnly = true;
        document.getElementById('id-dotref-equi-mod').readOnly = true;
        document.getElementById('id-dotind-equi-mod').readOnly = true;

        document.getElementById('id-cantidad-equi-mod').value = " ";
        document.getElementById('id-dotdi-equi-mod').value = " ";
        document.getElementById('id-dotref-equi-mod').value = " ";
        document.getElementById('id-dotind-equi-mod').value = " ";
    }
};

//Funcion para el boton de agregar Recursos EECC en Terreno

function agregarEquipo() {

    i = i + 1;

    //Variablas elementos de recursos EECC
    var idnombreequi = document.getElementById("id-nombre-equi-mod");
    var idcantidadequi = document.getElementById("id-cantidad-equi-mod");
    var inputcranp = document.getElementById("select-act-equi-mod");
    var iddotdiequi = document.getElementById("id-dotdi-equi-mod");
    var iddotrefequi = document.getElementById("id-dotref-equi-mod");
    var iddotindequi = document.getElementById("id-dotind-equi-mod");
    var tablaequipo = document.getElementById("tabla-equipo");

    if (validateInt(idcantidadequi.value)) {
        if (idcantidadequi.value < 0) {
            Swal.fire("Error", "Ingrese un valor númerico positivo", "warning");
            return false;
        }
    } else {
        Swal.fire("Error", "Ingrese un valor númerico correcto", "warning");
        return false;
    }


    if (validateInt(iddotdiequi.value)) {
        if (iddotdiequi.value < 0) {
            Swal.fire("Error", "Ingrese un valor númerico positivo", "warning");
            return false;
        }
    } else {
        Swal.fire("Error", "Ingrese un valor númerico correcto", "warning");
        return false;
    }


    if (validateInt(iddotrefequi.value)) {
        if (iddotrefequi.value < 0) {
            Swal.fire("Error", "Ingrese un valor númerico positivo", "warning");
            return false;
        }
    } else {
        Swal.fire("Error", "Ingrese un valor númerico correcto", "warning");
        return false;
    }


    if (validateInt(iddotindequi.value)) {
        if (iddotindequi.value < 0) {
            Swal.fire("Error", "Ingrese un valor númerico positivo", "warning");
            return false;
        }
    } else {
        Swal.fire("Error", "Ingrese un valor númerico correcto", "warning");
        return false;
    }


    if (idnombreequi.value == "") {

        alert("Seleccione una opción valida y/o Escriba el nombre");

    } else {

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var td6 = document.createElement("td");
        var td7 = document.createElement("td");
        var td8 = document.createElement("td");
        var button = document.createElement("input")

        button.className = "btn btn-danger";
        button.type = "button";
        button.value = "Eliminar";

        tr.id = "tr-rec" + i;

        td7.textContent = i;
        td.textContent = idnombreequi.options[idnombreequi.selectedIndex].textContent;
        td.className = "equipo";
        td.id = idnombreequi.options[idnombreequi.selectedIndex].id;
        td1.textContent = idcantidadequi.value;
        td1.className = "cantidad";
        td1.id = 0;
        td2.textContent = inputcranp.options[inputcranp.selectedIndex].textContent;
        td2.className = "actividad";
        td2.id = inputcranp.options[inputcranp.selectedIndex].id;
        td4.textContent = iddotdiequi.value;
        td4.className = "dotacion-directa";
        td5.textContent = iddotrefequi.value;
        td5.className = "dotacion-referencial";
        td6.textContent = iddotindequi.value;
        td6.className = "dotacion-indirecta";

        tablaequipo.append(tr);
        tr.appendChild(td7);
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td8);
        td8.append(button);

        button.onclick = function () {
            tablaequipo.removeChild(tr);
            i = i - 1;
            return i;
        }
    }
};