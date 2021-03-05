
i = 0;
document.getElementById("file").onchange = function (e) {
    // Creamos el objeto de la clase FileReader
    let reader = new FileReader();
    i = i + 1;
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    reader.readAsDataURL(e.target.files[0]);

    // Le decimos que cuando este listo ejecute el código interno
    reader.onload = function () {
        let preview = document.getElementById('preview'),
            div = document.createElement('div');
            image = document.createElement('img');
        but = document.createElement('input');

        div.setAttribute("id", "div_"+i)
        but.setAttribute("class", "btn btn-danger");
        but.setAttribute("value", "Borrar");
        but.setAttribute("type", "button");
        image.setAttribute("id", "img_"+i);
        image.setAttribute("class", "img-submit");

        image.src = reader.result;

        //preview.innerHTML = '';
        preview.append(div);
        div.append(image);
        div.insertBefore(but, image);

        but.onclick = function () {
            var ultimo = document.getElementById("div_" + i);
            preview.removeChild(ultimo);
            i = i - 1;
        }
    };
}

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
