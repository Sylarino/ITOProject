from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import User
from report.models import Contract, API

#Create your models here.
class ISCList(models.Model):

    correlative = models.IntegerField(verbose_name="Correlativo")
    num_audit = models.IntegerField(verbose_name="N° de Auditoria")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    user = models.ForeignKey(User, verbose_name="Usuario registrador", on_delete=models.CASCADE,default=1)
    
    class Meta:
        verbose_name = 'Lista de Verificacion ISC'
        verbose_name_plural = 'Listas de Verificacion ISC'

    def __str__(self):
        return str(self.id)   

class ISCFile(models.Model):

    upload = models.FileField(default='null', verbose_name="File", upload_to='evidence_isc_list')
    file_register = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de Archivo")

    class Meta:
        verbose_name = 'Archivo de lista ISC'
        verbose_name_plural = 'Archivos de lista ISC'

    def __str__(self):
        return str(self.id)

class ISCReportFile(models.Model):

    isc_report = models.ForeignKey(ISCList, verbose_name="Lista ISC", on_delete=models.CASCADE)
    file = models.ForeignKey(ISCFile, verbose_name="Archivo de Lista ISC", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Repertorio de Archivos en Lista ISC'
        verbose_name_plural = 'Repertorios de Archivos en Lista ISC'

    def __str__(self):
        return str(self.isc_report)  

class QualityRequirementGroup(models.Model):

    requirement_group_name = models.CharField(max_length=250, verbose_name="Nombre del grupo de Calidad")

    class Meta:
        verbose_name = 'Grupo de requisitos de Calidad'
        verbose_name_plural = 'Grupos de requisitos de Calidad'

    def __str__(self):
        return self.requirement_group_name

class QualityRequirement(models.Model):

    requirement_name = models.CharField(max_length=250, verbose_name="Requisito de Calidad")
    reference = models.CharField(max_length=250, verbose_name="Referencia ISO")

    group = models.ForeignKey(QualityRequirementGroup, verbose_name="Grupo de Calidad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Grupo de requisitos de Calidad'
        verbose_name_plural = 'Grupos de requisitos de Calidad'

    def __str__(self):
        return self.requirement_name


class QualityContract(models.Model):

    accomplishment = models.BooleanField()
    verification_method = models.CharField(blank=True, null=True, max_length=250, verbose_name="Metodo de Verificación")
    audit_result = models.CharField(blank=True, null=True, max_length=250, verbose_name="Resultado de Auditoría")

    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    quality = models.ForeignKey(QualityRequirement, verbose_name="Requisito de Calidad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Requisito de Calidad en Contrato'
        verbose_name_plural = 'Requisitos de Calidad en Contrato'

    def __str__(self):
        return str(self.id)

class GroupContract(models.Model):

    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    group = models.ForeignKey(QualityRequirementGroup, verbose_name="Grupo de Calidad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Grupo de Calidad en Contrato'
        verbose_name_plural = 'Grupo de Calidad en Contrato'

    def __str__(self):
        return str(self.id)

class ISCPDFFIle(models.Model):

    pdf = models.FileField(default='null', verbose_name="PDF", upload_to='pdf_isc_list')
    file_register = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")

    class Meta:
        verbose_name = 'Reporte PDF'
        verbose_name_plural = 'Reportes PDF'

    def __str__(self):
        return str(self.id)

class ISCReportPDF(models.Model):

    isc_report = models.ForeignKey(ISCList, verbose_name="Lista ISC", on_delete=models.CASCADE)
    pdf = models.ForeignKey(ISCPDFFIle, verbose_name="Reporte PDF", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Repertorio de PDF en Lista ISC'
        verbose_name_plural = 'Repertorios de PDF en Lista ISC'

    def __str__(self):
        return str(self.isc_report)  