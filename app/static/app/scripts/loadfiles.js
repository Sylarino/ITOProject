//Funcion para el boton de agregar datos a la tabla de consultas (No funcionando hasta la fecha)

$('#input-excel').change(function (e) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data, { type: 'array' });
        var htmlstr = XLSX.write(wb, { sheet: "Hoja1", type: 'binary', bookType: 'html' });
        debugger;
        $('#table-load')[0].innerHTML += htmlstr;


        var jt = $("tr").html();
        jt = jt.replaceAll('<td', '<th');
        jt = jt.replaceAll('td>', 'th>');

        document.getElementById('table-load').deleteRow(0);

        var tabla = document.getElementById('table-load');
        var cabezera = document.createElement('thead');
        var tr = document.createElement('tr');
        tabla.prepend(cabezera);
        cabezera.prepend(tr);
        tr.innerHTML = jt;

    }
});