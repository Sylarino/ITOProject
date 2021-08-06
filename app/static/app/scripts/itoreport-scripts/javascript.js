//Funcion para agregar una imagen en el formulario

i = 0;
var dataimg = {};
var obsimg = {};
var idsubimg = {};
var acts_id = ["first"]

$(function () {
    document.getElementById("file").onchange = function (e) {

        selectsubap = document.getElementById("select-sub-img");
        if (selectsubap.options[selectsubap.selectedIndex].disabled) {
            Swal.fire("Error", "Seleccione una SubActividad o Actividad invalida.", "warning");
            return false;
        }

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
            sub = document.getElementById('select-sub-img');
            div2 = document.createElement('div');
            label = document.createElement('p')
            label_subactividad = document.createElement('label')

            label.setAttribute("class", "lab-img-sub")
            label_subactividad.setAttribute("id", sub.options[sub.selectedIndex].id)
            div.setAttribute("id", "div_" + i);
            div.setAttribute("class", "image-section--containar");
            div2.setAttribute("class", "title-image--container");
            but.setAttribute("class", "btn btn-danger");
            but.setAttribute("value", "Borrar");
            but.setAttribute("type", "button");
            image.setAttribute("id", "img_" + i);
            image.setAttribute("class", "img-submit");
            label.textContent = det.value;
            label_subactividad.textContent = sub.options[sub.selectedIndex].textContent;

            obsimg[i] = label.textContent;
            idsubimg[i] = sub.options[sub.selectedIndex].id;
            image.src = reader.result;

            //preview.innerHTML = '';
            preview.append(div);
            div.append(image);
            div.insertBefore(but, image);
            div.appendChild(div2);
            div2.appendChild(label_subactividad);
            div2.appendChild(label)

            but.onclick = function () {

                var ultimo = document.getElementById("div_" + i);
                preview.removeChild(ultimo);
                /*Incrementable*/
                i = i - 1;
                dataimg[i].remove();
                obsimg[i].remove();
                idsubimg[i].remove();

                return dataimg, obsimg, idsubimg;

            }
        };

        return dataimg, obsimg, idsubimg;

    };
});

//Funcion para el boton de agregar referencias 
$(function () {
    document.getElementById("btn-reference").onclick = function (e) {

        i = i + 1;

        var refselectgen = document.getElementById("select-id");
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
    }
});

//Validación decimal
function validateDecimal(valor) {
    var RE = /^\d*\.?\d*$/;
    if (RE.test(valor)) {
        return true;
    } else {
        return false;
    }
}

//Validación int
function validateInt(valor) {
    var RE = /^[0-9]+$/;
    if (valor.match(RE)) {
        return true;
    } else {
        return false;
    }
}



//Funcion para el boton de agregar actividades programadas
$(function () {
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
        var selectpreap = document.getElementById("select-pre-ap");

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

                        acts_id.push(selectsubap.options[selectsubap.selectedIndex].id);

                        td3.id = inputuap.getAttribute("value");
                        td10.id = 1;
                        td4.className = "total-acumulado";
                        td.className = "actividad";
                        td2.className = "cantidad-real";
                        td3.className = "medida";
                        td8.className = "causa-no";
                        td10.className = "activity_type";

                        if (selectcumap.value != "No") {
                            td8.id = 1;
                            td8.textContent = "Cumplio";
                        }

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
});

//Funcion para el boton de agregar actividades NO programadas

$(function () {
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

        if (selectcumanp.value != "No") {
            td8.id = 1;
            td8.textContent = "Cumplio";
        }

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

    };
});

//Funcion para el boton de agregar Recursos EECC en Terreno
$(function () {
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
});

//Accion a ejecutar en select de API

$(function () {
    $('select[name="api"]').on('change', function () {
        debugger;
        var id_select = this.id;

        var id = $('#' + id_select).val();
        var select_contracts = $('select[name="contract"]');
        var options = '<option id="0" disabled selected>Seleccione N° de Contrato</option>';

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
        var id_select = this.id;

        if (id_select == "contr_antgen_id") {
            var id = $('#' + id_select).val();
            var select_act_pro = $('select[name="select-act-ap"]');
            var options = '<option disabled selected>Seleccione Actividad</option>';
            var optionsimg = '<option disabled selected>Seleccione Sub Actividad</option>';
            var select_act_nopro = $('select[name="select-act-anp"]');
            var select_act_equi = $('select[name="select-act-equi"]');
            var select_act_img = $('select[name="select-sub-img"]');
        }

        if (id_select == "ant-contract-walk") {
            var id = $('#' + id_select).val();
        }
        if (id_select == "noncon_con_id") {
            var id = $('#' + id_select).val();
        }


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

            if (!data.hasOwnProperty('error')) {

                $('label[name="enterprise"]').text(data[0].enterprise);
                $('label[name="start_date"]').text(data[0].start_date_contract);
                $('label[name="finish_date"]').text(data[0].finish_date_contract);

                if (id_select == "contr_antgen_id") {

                    var data_unique = [];

                    $.each(data, function (key, value) {
                        optionsimg += '<option id="' + value.subactivity_id + '" value="' + value.subactivity_id + '">' + value.subactivity_name + '</option>';
                        data_unique.push({ id: value.id, activity_name: value.activity_name });
                    });

                    let datamap = data_unique.map(item => {
                        return [item.id, item]
                    });
                    var datamaparr = new Map(datamap); // Pares de clave y valor

                    let result = [...datamaparr.values()];

                    $.each(result, function (key, value) {
                        options += '<option id="' + value.id + '" value="' + value.id + '">' + value.activity_name + '</option>';
                    });

                    return false;
                }
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            if (id_select == "contr_antgen_id") {

                select_act_pro.html(options);
                select_act_nopro.html(options);
                select_act_equi.html(options);
                select_act_img.html(optionsimg);
            }
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

//Accion para ejecutar al seleccionar una opción de las subactividades de actividades programadas

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

//Accion para ejecutar al seleccionar una opción de las subactividades de actividades NO programadas

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
$(function () {
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
});

//Acci�n a ejecutar cuando seleccione el cumplimiento de actividades no programadas
$(function () {
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
});

$(function () {
    document.getElementById("id-nombre-equi").onclick = function (e) {

        var select_causa = document.getElementById("id-nombre-equi");
        if ((select_causa.options[select_causa.selectedIndex].textContent != "Seleccione Equipo")
            || (select_causa.options[select_causa.selectedIndex].textContent != "")) {
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
});

// Agregar reporte

function downloadrecentlypdf(id_pdf) {
    $.ajax({
        type: 'POST',
        data: { 'id': id_pdf, csrfmiddlewaretoken: '{{ csrf_token }}' },
        url: "downloadpdf/",
        success: function (response) {
            var blob = new Blob([response], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "REPORT_N" + id_pdf + ".pdf";
            link.click();
        }
    });
}

function messageSucces(data) {

    if (data.submitted == 1) {

        swal.fire("Guardado", "Reporte N°" + data.id_report + " agregado satisfactoriamente", "success", {
            confirmButtonText: "Descargar"
        }).then((result) => {

            if (result.isConfirmed) {
                downloadrecentlypdf(data.id_report);
                Swal.fire('Descargado!', '', 'success', {
                    confirmButtonText: "Ok"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    } else {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    }
                });
            }
        });

    }
}

$(function () {
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

        if (especialidad.options[especialidad.selectedIndex].disabled) {
            Swal.fire("Reporte no Agregado", "Seleccione una Especialidad", "warning");
            return false;
        }

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
                    id_subactividad: 358,
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

        val_imagen = document.getElementsByClassName("image-section--containar");
        lengimg = val_imagen.length;
        if (lengimg > 0) {
            img_val = 1;
            //Recorrido de imagenes
            var form_data = new FormData();

            debugger;
            for (var key in dataimg) {
                form_data.append('image', dataimg[key]);
            }

            for (var i in obsimg) {
                form_data.append('observation', obsimg[i]);
            }

            for (var subi in idsubimg) {
                form_data.append('image_subactivity', idsubimg[subi]);
            }

        } else {
            img_val = 0;
        }

        let filareport = {
            desviacion: desviacion.value,
            plandeaccion: plandeaccion.value,
            evidencia_obs: evidenciaobs.value,
            id_seguimiento: $('input:radio[name=exampleRadios]:checked').val(),
            img_exist: img_val
        };

        reporte.push(filareport);

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

        }).done(function (data) {

            if (img_val === 0) {
                messageSucces(data);
            }

        }).fail(function (data) {
            Swal.fire("Reporte No Agregado", "Verifique los datos a ingresar", "warning");
            return false;
        });

        if (img_val === 1) {
            $.ajax({
                url: 'saveimage/',
                type: 'POST',
                data: form_data,
                contentType: false,
                processData: false,
                dataType: 'json',
            }).done(function (data) {

                messageSucces(data);

            }).fail(function (data) {
                Swal.fire("Reporte No Agregado", "Verifique que imagenés esten correctas", "warning");
                return false;
            });
        }

    });
});

$(function () {

    $("nav .navbar-bar li").on("click", function () {
        console.log("Hola");
        $("nav").find(".active").removeClass("active");
        $(this).addClass("active");
    });

});

