//Funcion para agregar una imagen en el formulario

i = 0;
var dataimg = {};
var obsimg = {};

document.getElementById("file").onchange = function(e) {
    // Creamos el objeto de la clase FileReader
    let reader = new FileReader();
    i = i + 1;
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    reader.readAsDataURL(e.target.files[0]);

    dataimg[i] = e.target.files[0];

    // Le decimos que cuando este listo ejecute el c�digo interno
    reader.onload = function () {
        let preview = document.getElementById('preview');
        div = document.createElement('div');
        image = document.createElement('img');
        but = document.createElement('input');
        det = document.getElementById('det-img');
        label = document.createElement('p')

        label.setAttribute("class","lab-img-sub")
        div.setAttribute("id", "div_" + i);
        but.setAttribute("class", "btn btn-danger");
        but.setAttribute("value", "Borrar");
        but.setAttribute("type", "button");
        image.setAttribute("id", "img_" + i);
        image.setAttribute("class", "img-submit");
        label.textContent = det.value;

        obsimg[i] = label.textContent;

        image.src = reader.result;

        //preview.innerHTML = '';
        preview.append(div);
        div.append(image);
        div.insertBefore(but, image);
        div.appendChild(label);

        but.onclick = function () {
            var ultimo = document.getElementById("div_" + i);
            preview.removeChild(ultimo);
            /*Incrementable*/
            i = i - 1;
            dataimg[i].remove();
            obsimg[i].remove();

            return dataimg, obsimg;
        }
    };

    return dataimg, obsimg;

};

//Funcion para el boton de agregar referencias 

document.getElementById("btn-reference").onclick = function (e) {

    i = i + 1;

    var refselectgen = document.getElementById("select-id");
    var refinput = document.getElementById("ref-name");
    var tablegen = document.getElementById("table-body");

    if ((refselectgen.options[refselectgen.selectedIndex].value == "") ||
        (refinput.value == "") ||
        (refselectgen.options[refselectgen.selectedIndex].value == "Seleccione Referencia")) {

        alert("Seleccione una opci�n valida y/o Escriba el nombre");

    } else {

        var td = document.createElement("td");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var button = document.createElement("input")

        button.className = "btn btn-danger";
        button.type = "button";
        button.value = "Eliminar";

        tr.id = "tr-ref"+i;
        td.textContent = refselectgen.options[refselectgen.selectedIndex].value;
        td.className = "referencia";
        td.id = refselectgen.options[refselectgen.selectedIndex].id;
        td1.textContent = refinput.value;
        td1.className = "descripcion";
        td1.id = refselectgen.options[refselectgen.selectedIndex].id;

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

//Funcion para el boton de agregar actividades programadas

document.getElementById("act-pro").onclick = function (e) {

    i = i + 1;

    //Variablas elementos de actividades programadas
    var selectsubap = document.getElementById("select-sub-ap");
    var selectactap = document.getElementById("select-act-ap");
    var inputcrap = document.getElementById("input-cr-ap");
    var inputuap = document.getElementById("input-u-ap");
    var inputteap = document.getElementById("input-te-ap");
    var inputrdap = document.getElementById("input-rd-ap");
    var inputtaap = document.getElementById("input-ta-ap");
    var selectcumap = document.getElementById("select-cum-ap");
    var selectcauap = document.getElementById("select-cau-ap");
    var selectdetap = document.getElementById("input-det-ap");
    var tablegen = document.getElementById("table-actividad");

    $(function () {
        if ((selectactap.options[selectactap.selectedIndex].textContent === '') ||
            (selectsubap.options[selectsubap.selectedIndex].textContent === '')) {
            alert("Seleccione una SubActividad o Actividad invvalida")
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
                    td10.textContent = "Programada";

                    td.id = selectsubap.options[selectsubap.selectedIndex].id;
                    td4.id = selectactap.options[selectactap.selectedIndex].id;
                    td1.id = selectactap.options[selectactap.selectedIndex].id;
                    td7.id = selectcumap.options[selectcumap.selectedIndex].id;
                    td8.id = selectcauap.options[selectcauap.selectedIndex].id;
                    td3.id = inputuap.getAttribute("value");
                    td10.id = 1;
                    td4.className = "total-acumulado";
                    td.className = "actividad";
                    td2.className = "cantidad-real";
                    td3.className = "medida";
                    td8.className = "causa-no";
                    td10.className = "activity_type";

                    tablegen.append(tr);
                    tr.appendChild(td);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td7);
                    tr.appendChild(td7);
                    tr.appendChild(td8);
                    tr.appendChild(td6);
                    tr.appendChild(td10);
                    tr.appendChild(td11);
                    td11.append(button);

                    button.onclick = function () {
                        tablegen.removeChild(tr);
                        i = i - 1;
                        return i;
                    }
                }
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });
    });
};

//Funcion para el boton de agregar actividades NO programadas

document.getElementById("act-no-pro").onclick = function (e) {

    i = i + 1;

    //Variablas elementos de actividades no programadas
    var selectsubanp = document.getElementById("input-subact-anp");
    var selectactanp = document.getElementById("select-act-anp");
    var inputcranp = document.getElementById("input-cr-anp");
    var inputuanp = document.getElementById("input-u-anp");
    var inputteanp = document.getElementById("input-te-anp");
    var inputrdanp = document.getElementById("input-rf-anp");
    var inputtaanp = document.getElementById("input-ta-anp");
    var selectcumanp = document.getElementById("select-cum-anp");
    var selectcauanp = document.getElementById("select-cau-anp");
    var selectdetanp = document.getElementById("input-det-anp");

    var tablegen = document.getElementById("table-actividad");

    if ((selectsubanp.value == "")) {

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
        td9.textContent = selectdetanp.value;
        td10.textContent = "No Programada";
        td4.className = "total-estimado";
        td5.className = "referencia-diaria";
        td6.className = "total-acumulado";
        td.className = "act-no-programada";
        td3.id = inputuanp.options[inputuanp.selectedIndex].id;
        td3.className = "medida";
        td2.className = "cantidad-real";
        td3.className = "medida";
        td8.className = "causa-no";
        td10.className = "activity_type";

        td1.id = selectactanp.options[selectactanp.selectedIndex].id;
        td7.id = selectcumanp.options[selectcumanp.selectedIndex].id;
        td8.id = selectcauanp.options[selectcauanp.selectedIndex].id;
        td10.id = 2;

        tablegen.append(tr);
        tr.appendChild(td);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td7);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td6);
        tr.appendChild(td10);
        tr.appendChild(td11);
        td11.append(button);

        button.onclick = function () {
            tablegen.removeChild(tr);
            i = i - 1;
            return i;
        }
    }
};

//Funcion para el boton de agregar Recursos EECC en Terreno

document.getElementById("but-rec-save").onclick = function (e) {

    i = i + 1;

    //Variablas elementos de recursos EECC
    var idnombreequi = document.getElementById("id-nombre-equi");
    var idcantidadequi = document.getElementById("id-cantidad-equi");
    var inputcranp = document.getElementById("select-act-equi");
    var inputuanp = document.getElementById("select-sub-equi");
    var iddotdiequi = document.getElementById("id-dotdi-equi");
    var iddotrefequi = document.getElementById("id-dotref-equi");
    var iddotindequi = document.getElementById("id-dotind-equi");
    var tablaequipo = document.getElementById("tabla-equipo");

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

        td7.textContent = "N°" + i;
        td.textContent = idnombreequi.options[idnombreequi.selectedIndex].textContent;
        td.className = "equipo";
        td.id = idnombreequi.options[idnombreequi.selectedIndex].id;
        td1.textContent = idcantidadequi.value;
        td1.className = "cantidad";
        td2.textContent = inputcranp.options[inputcranp.selectedIndex].textContent;
        td2.className = "actividad";
        td2.id = inputcranp.options[inputcranp.selectedIndex].id;
        td3.textContent = inputuanp.options[inputuanp.selectedIndex].textContent;
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
        tr.appendChild(td3);
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

//Accion a ejecutar en select de API

$(function () {
    $('select[name="api"]').on('change', function () {
        var id = $('#api_antgen_id').val();//$(this).val();
        var select_contracts = $('select[name="contract"]');
        var options = '<option disabled selected>Seleccione N° de Contrato</option>';

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
            console.log(data);
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
            $('label[name="project_name"]').text(data[0].project_name);
        });
    });
});

//Accion para ejecutar y listar contratos

$(function () {
    $('select[name="contract"]').on('change', function () {
        var id = $('#contr_antgen_id').val();
        var select_act_pro = $('select[name="select-act-ap"]');
        var options = '<option disabled selected>Seleccione Actividad</option>';
        var select_act_nopro = $('select[name="select-act-anp"]');
        var select_act_equi = $('select[name="select-act-equi"]');

        if (id === '') {
            $('label[name="enterprise"]').text(" ");
            $('label[name="start_date"]').text(" ");
            $('label[name="finish_date"]').text(" ");
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_contract_info', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {
            debugger;
            if (!data.hasOwnProperty('error')) {

                $('label[name="enterprise"]').text(data[0].enterprise);
                $('label[name="start_date"]').text(data[0].start_date_contract);
                $('label[name="finish_date"]').text(data[0].finish_date_contract);

                $.each(data, function (key, value) {
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.activity_name + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_act_pro.html(options);
            select_act_nopro.html(options);
            select_act_equi.html(options);
        });
    });
});

//Accion para ejecutar al seleccionar un select de actividad programada.

$(function () {
    $('select[name="select-act-ap"]').on('change', function () {
        var id = $('#select-act-ap').val();
        var select_sub_ap = $('select[name="select-sub-ap"]');
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
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.subactivity_name + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_sub_ap.html(options);
        });
    });
});

//Accion para ejecutar al seleccionar una opci�n de las subactividades de actividades programadas

$(function () {
    $('select[name="select-sub-ap"]').on('change', function () {
        var id = $('#select-sub-ap').val(); 
        var medidaid = document.getElementsByName("input-u-ap");

        if (id === '') {
            $('input[name="input-u-ap"]').val(" ");
            $('input[name="input-te-ap"]').val(" ");
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_sub_p_info', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {


            if (!data.hasOwnProperty('error')) {
                $('input[name="input-u-ap"]').val(data[0].measure);
                $('input[name="input-u-ap"]').attr("value", data[0].measure_id)
                $('input[name="input-te-ap"]').val(data[0].average_amount);
                $('input[name="input-ta-ap"]').val(data[0].total);  
                $('input[name="input-rd-ap"]').val(data[0].ref_day);

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            
        });
    });
});

//Accion para ejecutar al seleccionar una opci�n de las subactividades de actividades NO programadas

$(function () {
    $('select[name="select-sub-anp"]').on('change', function () {
        var id = $('#select-sub-anp').val();

        if (id === '') {
            $('input[name="input-u-anp"]').val(" ");
            $('input[name="input-te-anp"]').val(" ");
            return false;
        }
        $.ajax({
            type: 'GET',
            data: { action: 'search_sub_nop_info', id: id },
            url: "/buscarcontratos",
            dataType: 'json',
        }).done(function (data) {

            if (!data.hasOwnProperty('error')) {
                $('input[name="input-u-anp"]').val(data[0].measure);
                $('input[name="input-te-anp"]').val(data[0].average_amount);
                $('input[name="input-ta-anp"]').val(data[0].total);
                $('input[name="input-rf-anp"]').val(data[0].ref_day);

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });
    });
});

//Accion para ejecutar al seleccionar un select de actividad en Recursos EECC.

$(function () {
    $('select[name="select-act-equi"]').on('change', function () {
        var id = $('#select-act-equi').val();
        var select_sub_equi = $('select[name="select-sub-equi"]');
        var options = '<option disabled selected>Seleccione Sub Actividad</option>';

        if (id === '') {
            select_sub_equi.html(options);
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
                    options += '<option id="' + value.id + '" value="' + value.id + '">' + value.subactivity_name + '</option>';
                });

                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            select_sub_equi.html(options);
        });
    });
});

//Accion a ejecutar cuando seleccione el cumplimiento de actividades programadas.
document.getElementById("select-cum-anp").onclick = function (e) {

    var select_causa = document.getElementById("select-cum-anp"); 
    if (select_causa.options[select_causa.selectedIndex].textContent == "No") {
        document.getElementById('select-cau-anp').disabled = false
        document.getElementById('input-det-anp').readOnly = false;

    } else {
        document.getElementById('select-cau-anp').disabled = true;
        document.getElementById('input-det-anp').readOnly = true;
        document.getElementById('input-det-anp').value = " ";
    }
};

//Acci�n a ejecutar cuando seleccione el cumplimiento de actividades no programadas
document.getElementById("select-cum-ap").onclick = function (e) {

    var select_causa = document.getElementById("select-cum-ap");
    if (select_causa.options[select_causa.selectedIndex].textContent == "No") {
        document.getElementById('select-cau-ap').disabled = false
        document.getElementById('input-det-ap').readOnly = false;

    } else {
        document.getElementById('select-cau-ap').disabled = true;
        document.getElementById('input-det-ap').readOnly = true;
        document.getElementById('input-det-ap').value = " ";
    }
};

document.getElementById("id-nombre-equi").onclick = function (e) {

    var select_causa = document.getElementById("id-nombre-equi");
    if ((select_causa.options[select_causa.selectedIndex].textContent != "Seleccione Equipo")
        || (select_causa.options[select_causa.selectedIndex].textContent != ""))
    {
        document.getElementById('id-cantidad-equi').readOnly = false;
        document.getElementById('id-dotdi-equi').readOnly = false;
        document.getElementById('id-dotref-equi').readOnly = false;
        document.getElementById('id-dotind-equi').readOnly = false;

    } else {
        document.getElementById('id-cantidad-equi').readOnly = true;
        document.getElementById('id-dotdi-equi').readOnly = true;
        document.getElementById('id-dotref-equi').readOnly = true;
        document.getElementById('id-dotind-equi').readOnly = true;

        document.getElementById('id-cantidad-equi').value = " ";
        document.getElementById('id-dotdi-equi').value = " ";
        document.getElementById('id-dotref-equi').value = " ";
        document.getElementById('id-dotind-equi').value = " ";
    }
};

// Agregar reporte


$('input[id="btn-save_report"]').on('click', function () {

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
    var subnopro = document.getElementById("input-subact-anp");

    //Recorrido de tabla de actividades
    document.querySelectorAll('.table-actividad tr').forEach(function (e) {

        if (e.querySelector('.activity_type').id == 1) {
            let fila = {
                id_subactividad: e.querySelector('.actividad').id,
                //id de la actvidad
                id_actividad: e.querySelector('.total-acumulado').id,
                cantidad_real: e.querySelector('.cantidad-real').innerText,
                id_medida: e.querySelector('.medida').id,
                id_precondicion: selectpreap.options[selectpreap.selectedIndex].id,
                id_especialidad: especialidad.options[especialidad.selectedIndex].id,
                id_actividad_type: e.querySelector('.activity_type').id,
                id_conformidad: e.querySelector('.causa-no').id,
                total_estimado: 0.000,
                referencia_diaria: 0.000,
                total_acumulado: 0.000,
                subactivity_no_program: " "

            };
            historicos.push(fila);
        } else {
            let fila = {
                id_subactividad: 4,
                id_actividad: e.querySelector('.act-no-programada').id,
                cantidad_real: e.querySelector('.cantidad-real').innerText,
                id_medida: e.querySelector('.medida').id,
                id_precondicion: selectpreanp.options[selectpreanp.selectedIndex].id,
                id_especialidad: especialidad.options[especialidad.selectedIndex].id,
                id_actividad_type: e.querySelector('.activity_type').id,
                id_conformidad: e.querySelector('.causa-no').id,
                total_estimado: e.querySelector('.total-estimado').innerText,
                referencia_diaria: e.querySelector('.referencia-diaria').innerText,
                total_acumulado: e.querySelector('.total-acumulado').innerText,
                subactivity_no_program: e.querySelector('.act-no-programada').innerText
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
            dot_indirecta: e.querySelector('.dotacion-indirecta').innerText
        };
        equipos.push(fila);
    });

    //Recorrido de tabla de referencias
    document.querySelectorAll('.table-referencia tr').forEach(function (e) {
        let fila = {
            descripcion: e.querySelector('.descripcion').innerText,
            referencia_id: e.querySelector('.referencia').id
            /*report_id =*/
        };
        referencias.push(fila);
    });

    let filareport = {
        desviacion: desviacion.value,
        plandeaccion: plandeaccion.value,
        evidencia_obs: evidenciaobs.value,
        id_seguimiento: $('input:radio[name=exampleRadios]:checked').val()
    };

    reporte.push(filareport);

    //Recorrido de imagenes
    var form_data = new FormData();

    for (var key in dataimg) {
        form_data.append('image', dataimg[key]);
        console.log(form_data.get('image'))
    }

    for (var i in obsimg) {
        form_data.append('observation', obsimg[i]);
        console.log(form_data.get('observation'))
    }

    //Conexion a traves de ajax
    $.ajax({
        url: 'savereport/',
        type: 'POST',
        data: {
            action: 'save_report',
            'historico[]': JSON.stringify(historicos), csrfmiddlewaretoken: '{{ csrf_token }}',
            'referencias[]': JSON.stringify(referencias), csrfmiddlewaretoken: '{{ csrf_token }}',
            'equipos[]': JSON.stringify(equipos), csrfmiddlewaretoken: '{{ csrf_token }}',
            'reporte[]': JSON.stringify(reporte), csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        dataType: 'JSON',

    });

    $.ajax({
        url: 'saveimage/',
        type: 'POST',
        data: form_data,
        contentType: false,
        processData: false,
        dataType: 'json',
    }).done(function (data) {
        if (data.submitted == 1) {
            swal("Guardado", "Reporte N°" + data.id_report + " agregado satisfactoriamente", "success", {
                buttons: {
                    acept: {
                        text: "Aceptar",
                        value: "acept"
                    }
                },
            }).then((value) => {
                switch (value) {
                    case "acept":
                        window.location.reload();
                        window.scrollTo(0, 0);
                }
            });
        //    
        }
        else {
            alert("Reporte no fue agregado, verifique los datos");
        }
    });
});
