from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import User
from report.models import Contract, API
from walkreport.models import WBS, Discipline
# Create your models here.

class NonConformityReport(models.Model):
    
    num_audit = models.IntegerField(verbose_name="N° de Auditoria")
    item = models.IntegerField(verbose_name="Item")
    correlative = models.IntegerField(verbose_name="Correlativo")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    criticality = models.IntegerField(verbose_name="Criticidad de No Conformidad")
    origin = models.CharField(max_length=200, verbose_name="Origen")
    sistem = models.CharField(max_length=200, verbose_name="Sistema", default="")
    subsistem = models.CharField(max_length=200, verbose_name="Subsistema", default="")
    origin = models.CharField(max_length=200, verbose_name="Origen")
    clasification = models.CharField(max_length=200, verbose_name="Clasificación")
    infringement_requirement = models.TextField(blank=True, verbose_name="Requisito Incumplido")
    details = models.TextField(blank=True, verbose_name="Detalles de la No Conformidad")
    observations = models.TextField(blank=True, verbose_name="Observaciones")
    reference_documents = models.TextField(blank=True, verbose_name="Criterio / Documento de Referencia")
    ncr_standar = models.CharField(max_length=200, verbose_name="Criterio Específico de NCR")
    num_transmital_ncr = models.IntegerField(verbose_name="N° Transmital Envio NCR")
    num_transmital_action = models.IntegerField(verbose_name="N° Transmital Envío Acción Correctiva")
    tag = models.CharField(max_length=200,verbose_name="Tag",default="")
    num_ncr = models.IntegerField(verbose_name="N° NCR Emitida")
    status = models.CharField(max_length=200, verbose_name="Estatus")
    stipulated_date = models.DateField(verbose_name="Fecha de Compromiso de Cierre")
    real_close_date = models.DateField(verbose_name="Fecha de Cierre Real")

    
    #Llaves
    wbs = models.ForeignKey(WBS, verbose_name="WBS", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)
    discipline = models.ForeignKey(Discipline, verbose_name="Disciplina", on_delete=models.CASCADE)
    register_by = models.ForeignKey(User, related_name="user_originated_by" ,verbose_name="Originado por", on_delete=models.CASCADE)


    class Meta:
        verbose_name = 'Reporte de No Conformidad'
        verbose_name_plural = 'Reportes de No Conformidad'

    def __str__(self):
        return str(self.num_audit)   

class NonConformityImage(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado el")
    image = models.ImageField(default='null', verbose_name="Miniatura", upload_to="nonconformity_evidences")

    class Meta:
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imagenes'

    def __str__(self):
        return str(self.image)    

class NonConformityReportImage(models.Model):

    #Llaves
    report = models.ForeignKey(NonConformityReport, verbose_name="Reporte de No Conformidad", on_delete=models.CASCADE)
    image = models.ForeignKey(NonConformityImage, verbose_name="Image", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Reporte de Imagen'
        verbose_name_plural = 'Reporte de Imagenes'

    def __str__(self):
        return "Reporte N°" + str(self.report)

class NonConformityPDF(models.Model):
    upload = models.FileField(default='null', verbose_name="PDF", upload_to='pdf_nonconformity_reports')
    pdf_register = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")

    class Meta:
        verbose_name = 'PDF Reporte de No Conformidad'
        verbose_name_plural = 'Archivos PDF Reporte de No Conformidad'

    def __str__(self):
        return str(self.pdf_register)

class NonConformityReportPDF(models.Model):
    inspection_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")
    #Llaves
    noncon_report = models.ForeignKey(NonConformityReport, verbose_name="Reporte de No Conformidad", on_delete=models.CASCADE)
    pdf = models.ForeignKey(NonConformityPDF, verbose_name="PDF de Reporte de No Conformidad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Repertorio de PDF de Reporte de No Conformidad'
        verbose_name_plural = 'Repertorios de Archivos PDF Reporte de No Conformidad'

    def __str__(self):
        return str(self.noncon_report)  