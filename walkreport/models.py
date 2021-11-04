from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import User
from report.models import Contract, API, Sistem, Subsistem, SistemSubSistem
# Create your models here.
class WBS(models.Model):

    wbs_name = models.CharField(max_length=200, verbose_name="WBS")
    state = models.CharField(max_length=1, verbose_name="Estado")
    area = models.CharField(max_length=200, verbose_name="WBS")
    number = models.IntegerField(verbose_name="Código de WBS")

    class Meta:
        verbose_name = 'WBS'
        verbose_name_plural = 'WBS'

    def __str__(self):
        return self.wbs_name

class Discipline(models.Model):

    discipline_name = models.CharField(max_length=200, verbose_name="Disciplina")
    models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'Disciplina'
        verbose_name_plural = 'Disciplinas'

    def __str__(self):
        return self.discipline_name

class Priority(models.Model):

    priority_name = models.CharField(max_length=200, verbose_name="Disciplina")
    models.CharField(max_length=1, verbose_name="Estado")

    class Meta:
        verbose_name = 'Prioridad'
        verbose_name_plural = 'Prioridades'

    def __str__(self):
        return self.priority_name


class EvidenceFile(models.Model):

    upload = models.FileField(default='null', verbose_name="Acta Escaneado de Caminata", upload_to='files_walk_report')
    pdf_register = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    class Meta:
        verbose_name = 'PDF'
        verbose_name_plural = 'Archivos PDF'

    def __str__(self):
        return str(self.pdf_register)

class WalkReport(models.Model):

    #Agregar fecha 
    historic_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    top = models.CharField(max_length=200, verbose_name="TOP")
    sistem = models.CharField(max_length=200, verbose_name="Sistema")
    subsistem = models.CharField(max_length=200, verbose_name="Sub Sistema")
    walk_number = models.IntegerField(verbose_name="Número de Caminata")
    #Llaves
    sistem_subsistem = models.ForeignKey(SistemSubSistem, verbose_name="Sistema", on_delete=models.CASCADE, default=1)
    wbs = models.ForeignKey(WBS, verbose_name="WBS", on_delete=models.CASCADE)
    contract = models.ForeignKey(Contract, verbose_name="Contrato", on_delete=models.CASCADE)
    api = models.ForeignKey(API, verbose_name="API", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Reporte de Caminata'
        verbose_name_plural = 'Reportes de Caminata'

    def __str__(self):
        return str(self.id)    

class WalkObservation(models.Model):

    ubication = models.CharField(max_length=200, verbose_name="Ubicación")
    plane_number = models.IntegerField(verbose_name="Número de Plano")
    equipment_code = models.IntegerField(verbose_name="Codigo de Equipo")
    action_description = models.TextField(blank=True, verbose_name="Descripción Acción Pendiente", default="")
    historic_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    stipulated_date = models.DateField(verbose_name="Fecha de Compromiso de Cierre")
    real_close_date = models.DateField(verbose_name="Fecha de Cierre Real", blank=True, null=True)
    #Llaves
    discipline = models.ForeignKey(Discipline, verbose_name="Disciplina", on_delete=models.CASCADE)
    walk_report = models.ForeignKey(WalkReport, verbose_name="Reporte de Caminata", on_delete=models.CASCADE)
    register_by = models.ForeignKey(User, related_name="user_register_by" ,verbose_name="Originado por", on_delete=models.CASCADE)
    responsable = models.ForeignKey(User, related_name="user_responsable" ,verbose_name="Responsable Construccción", on_delete=models.CASCADE)
    leader = models.ForeignKey(User, related_name="user_leader", verbose_name="Lider de Caminata", on_delete=models.CASCADE)
    priority = models.ForeignKey(Priority, verbose_name="Prioridad", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Observación de Caminata'
        verbose_name_plural = 'Observaciones de Caminata'

    def __str__(self):
        return self.id    

class FileWalkReport(models.Model):

    inspection_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")
    #Llaves
    walk_report = models.ForeignKey(WalkReport, verbose_name="Reporte de Caminata", on_delete=models.CASCADE)
    evidence_file = models.ForeignKey(EvidenceFile, verbose_name="Evidencia de Archivo", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Reporte de Archivo de Caminata'
        verbose_name_plural = 'Reportes de Archivo de Caminata'

    def __str__(self):
        return self.inspection_date    

class PDFWalkReport(models.Model):

    upload = models.FileField(default='null', verbose_name="PDF", upload_to='pdf_walk_reports')
    pdf_register = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")

    class Meta:
        verbose_name = 'PDF Acta de Observaciones en Caminata'
        verbose_name_plural = 'Archivos PDF Acta de Observaciones en Caminata'

    def __str__(self):
        return str(self.pdf_register)

class WalkReportPDFFile(models.Model):

    inspection_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro de PDF")
    #Llaves
    walk_report = models.ForeignKey(WalkReport, verbose_name="Reporte de Caminata", on_delete=models.CASCADE)
    pdf = models.ForeignKey(PDFWalkReport, verbose_name="PDF de Acta de Caminata", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Repertorio de PDF de Acta'
        verbose_name_plural = 'Repertorios de Archivos PDF Actas de Caminata'

    def __str__(self):
        return str(self.walk_report)  