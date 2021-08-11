///Agregar nuevas imagenes (Intentar reciclarlo más adelante con el registernonconformity.js)
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
                but.setAttribute("onclick", "eliminarImg(" + (largo_temp + inc) + ");")

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