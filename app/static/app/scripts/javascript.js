//Funcion para agregar una imagen en el formulario

i = 0;
document.getElementById("file").onchange = function (e) {
    // Creamos el objeto de la clase FileReader
    let reader = new FileReader();
    i = i + 1;
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    reader.readAsDataURL(e.target.files[0]);

    // Le decimos que cuando este listo ejecute el código interno
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

        image.src = reader.result;

        //preview.innerHTML = '';
        preview.append(div);
        div.append(image);
        div.insertBefore(but, image);
        div.appendChild(label);

        but.onclick = function () {
            var ultimo = document.getElementById("div_" + i);
            preview.removeChild(ultimo);
            i = i - 1;
        }
    };
};

//Funcion para el boton de agregar datos a la tabla de consultas (No funcionando hasta la fecha)

$('#input-excel').change(function (e) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data, { type: 'array' });
        var htmlstr = XLSX.write(wb, { sheet: "Hoja1", type: 'binary', bookType: 'html' });
        $('#wrapper')[0].innerHTML += htmlstr;
    }
});

//Funcion para el boton de agregar referencias 

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

        tr.id = "tr-ref"+i;
        td.textContent = refselectgen.options[refselectgen.selectedIndex].value;
        td.id = refselectgen.options[refselectgen.selectedIndex].id;
        td1.textContent = refinput.value;
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
    var selectdetap = document.getElementById("select-det-ap");

    var tablegen = document.getElementById("table-actividad");

    if (selectsubap.options[selectsubap.selectedIndex].value == "") {

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

        td.textContent = selectsubap.options[selectsubap.selectedIndex].value;
        td1.textContent = selectactap.options[selectactap.selectedIndex].value;
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
        td1.id = selectactap.options[selectactap.selectedIndex].id;
        td7.id = selectcumap.options[selectcumap.selectedIndex].id;
        td8.id = selectcauap.options[selectcauap.selectedIndex].id;

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

//Funcion para el boton de agregar actividades NO programadas

document.getElementById("act-no-pro").onclick = function (e) {

    i = i + 1;

    //Variablas elementos de actividades no programadas
    var selectsubanp = document.getElementById("select-sub-anp");
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

    if ((selectsubanp.options[selectsubanp.selectedIndex].value == "")) {

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

        td.textContent = selectsubanp.options[selectsubanp.selectedIndex].value;
        td1.textContent = selectactanp.options[selectactanp.selectedIndex].value;
        td2.textContent = inputcranp.value;
        td3.textContent = inputuanp.value;
        td4.textContent = inputteanp.value;
        td5.textContent = inputrdanp.value;
        td6.textContent = inputtaanp.value;
        td7.textContent = selectcumanp.options[selectcumanp.selectedIndex].value;
        td8.textContent = selectcauanp.options[selectcauanp.selectedIndex].value;
        td9.textContent = selectdetanp.value;
        td10.textContent = "No Programada";

        td.id = selectsubanp.options[selectsubanp.selectedIndex].id;
        td1.id = selectactanp.options[selectactanp.selectedIndex].id;
        td7.id = selectcumanp.options[selectcumanp.selectedIndex].id;
        td8.id = selectcauanp.options[selectcauanp.selectedIndex].id;

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
        var button = document.createElement("input")

        button.className = "btn btn-danger";
        button.type = "button";
        button.value = "Eliminar";

        tr.id = "tr-rec" + i;

        td.textContent = idnombreequi.value;
        td1.textContent = idcantidadequi.value;
        td2.textContent = inputcranp.options[inputcranp.selectedIndex].value;
        td3.textContent = inputuanp.options[inputuanp.selectedIndex].value;
        td4.textContent = iddotdiequi.value;
        td5.textContent = iddotrefequi.value;
        td6.textContent = iddotindequi.value;

        tablaequipo.append(tr);
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        td7.append(button);

        button.onclick = function () {
            tablaequipo.removeChild(tr);
            i = i - 1;
            return i;
        } 
    }
};