from django import forms

class UploadFileForm(forms.Form):
    file = forms.FileField()

class HistoricalForm(forms.Form):
    id_subactividad = forms.IntegerField()
    id_actividad = forms.IntegerField()
    cantidad_real = forms.IntegerField()
    id_medida = forms.IntegerField()
    id_precondicion = forms.IntegerField()
    id_especialidad = forms.IntegerField()
    id_actividad_type = forms.IntegerField()
    id_conformidad = forms.IntegerField()
    total_estimado = forms.DecimalField()
    referencia_diaria = forms.DecimalField()
    total_acumulado = forms.DecimalField()
    subactivity_no_program = forms.CharField()

