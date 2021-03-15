from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import User

# Create your models here.


class Image(models.Model):
    url = models.CharField(max_length=100, verbose_name="URL de la imagén")
    created_at = models.DateTimeField(verbose_name="Creado el")
    description = models.CharField(max_length=100, verbose_name="Descripción")

    class Meta:
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imagenes'

    def __str__(self):
        return self.url

class Following(models.Model):
    following_name = models.CharField(max_length=100, verbose_name="¿Seguimiento?")
    state = models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'Seguimiento'
        verbose_name_plural = 'Seguimientos'

    def __str__(self):
        return self.following_name

class Precondition(models.Model):
    precondition_name = models.CharField(max_length=100, verbose_name="Prerequisito")
    state = models.CharField(max_length=1, verbose_name="Estado")
    
    class Meta:
        verbose_name = 'Prerrequisito'
        verbose_name_plural = 'Prerrequisitos'

    def __str__(self):
        return self.precondition_name

class Reference(models.Model):
    reference_name = models.CharField(max_length=100, verbose_name="Referencia")
    state = models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'Referencia'
        verbose_name_plural = 'Referencias'

    def __str__(self):
        return self.reference_name

class Specialty(models.Model):
    specialty_name = models.CharField(max_length=100, verbose_name="Especialidad")
    state = models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'Especialidad'
        verbose_name_plural = 'Especialidades'

    def __str__(self):
        return self.specialty_name

class Measure(models.Model):
    measure_name = models.CharField(max_length=100, verbose_name="Medida")

    class Meta:
        verbose_name = 'Medida'
        verbose_name_plural = 'Medidas'

    def __str__(self):
        return self.measure_name

class NonConformity(models.Model):
    nonconformity_name = models.CharField(max_length=100, verbose_name="¿Conformidad?")
    state = models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'No Conformidad'
        verbose_name_plural = 'No Conformidades'

    def __str__(self):
        return self.nonconformity_name

class API(models.Model):
    api_number = models.CharField(max_length=100, verbose_name="Número de API")
    project_name = models.CharField(max_length=100, verbose_name="Nombre de Proyecto")
    start_date = models.DateField(verbose_name="Comienza el")
    finish_date = models.DateField(verbose_name="Finaliza el")
    state = models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'API'
        verbose_name_plural = 'API'

    def __str__(self):
        return self.project_name

class Contract(models.Model):
    contract_number = models.IntegerField(verbose_name="Número de Contrato")
    enterprise = models.CharField(max_length=150, verbose_name="Empresa Contratista")
    rut = models.CharField(max_length=12, verbose_name="RUT")
    project_boss = models.CharField(max_length=12, verbose_name="Jefe de Proyecto")
    email = models.CharField(max_length=12, verbose_name="Correo")
    cellphone = models.CharField(max_length=12, verbose_name="Celular")
    start_date = models.DateField(verbose_name="Comienza el")
    finish_date = models.DateField(verbose_name="Finaliza el")
    state = models.CharField(max_length=1, verbose_name="Estado")

    #LLaves
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'

    def __str__(self):
        return str(self.contract_number)

class Activity(models.Model):
    activity_name = models.CharField(max_length=100, verbose_name="Nombre Actividad")
    start_date = models.DateField(verbose_name="Comienza el")
    finish_date = models.DateField(verbose_name="Finaliza el")
    state = models.CharField(max_length=1, verbose_name="Estado")

    #LLaves
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)

    #Darle nombres tanto en singular como plural al modelo para ser mostrado en la administración
    class Meta:
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'

    def __str__(self):
        return self.activity_name

class ActivityType(models.Model):
    activity_type_name = models.CharField(max_length=200, verbose_name="Nombre del Tipo de Actividad")

    class Meta:
        verbose_name = 'Tipo de Actividad'
        verbose_name_plural = 'Tipo de Actividades'

    def __str__(self):
        return self.activity_type_name

class SubActivity(models.Model):
    subactivity_name = models.CharField(max_length=100, verbose_name="Nombre de Proyecto")
    measure = models.CharField(max_length=10, verbose_name="Medida")
    average_amount = models.DecimalField(max_length=50, max_digits=10, decimal_places=3, verbose_name="Cantidad Promedio")
    average_hh = models.DecimalField(max_length=50, max_digits=10, decimal_places=3, verbose_name="Promedio HH")
    start_date = models.DateField(verbose_name="Comienza el")
    finish_date = models.DateField(verbose_name="Finaliza el")

    #LLaves
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, verbose_name="Actividad", on_delete=models.CASCADE)
    activity_type = models.ForeignKey(ActivityType, verbose_name="Tipo de Actividad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'SubActividad'
        verbose_name_plural = 'SubActividades'

    def __str__(self):
        return self.subactivity_name

class Historical(models.Model):
    real_amount = models.DecimalField(max_length=100, max_digits=10, decimal_places=3, verbose_name="Cantidad Real")
    inspection_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Inspección")
    images = models.ManyToManyField(Image, verbose_name="Imagenes", blank=True)

    #Llaves
    subactivity = models.ForeignKey(SubActivity, verbose_name="Sub Actividad", on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, verbose_name="Actividad", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    measure = models.ForeignKey(Measure, verbose_name="Medida", on_delete=models.CASCADE)
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)
    nonconformity = models.ForeignKey(NonConformity, verbose_name="No Conformidad", on_delete=models.CASCADE)
    specialty = models.ForeignKey(Specialty, verbose_name="Especialidad", on_delete=models.CASCADE)
    following = models.ForeignKey(Following, verbose_name="Seguimiento", on_delete=models.CASCADE)
    precondition = models.ForeignKey(Precondition, verbose_name="Pre requisito", on_delete=models.CASCADE)
    user = models.ForeignKey(User, editable=False, verbose_name="Inspector del Informe", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Historico'
        verbose_name_plural = 'Historicos'

    def __str__(self):
        return self.inspection_date

class HistoricalReference(models.Model):
    description = models.CharField(max_length=500, verbose_name="Prerequisito")

    #Llaves
    historical = models.ForeignKey(Historical, verbose_name="Historico", on_delete=models.CASCADE)
    reference = models.ForeignKey(Reference, verbose_name="Referencia", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Referencia Historica'
        verbose_name_plural = 'Referencias Historicas'

    def __str__(self):
        return self.precondition_name
