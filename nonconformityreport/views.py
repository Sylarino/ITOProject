from django.shortcuts import render
from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from walkreport.models import *
from report.models import *
from nonconformityreport.models import *
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from reportlab.pdfgen import canvas
from django.conf import settings
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape, portrait, A4
from reportlab.lib import utils 
import io
from django.core.files.base import ContentFile
from report.models import Image as ImgReport
from report.forms import UploadFileForm, HistoricalForm
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER
from reportlab.pdfbase.pdfmetrics import stringWidth
import os
from django.contrib.auth.models import User, Group

def registernonconformityreport(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    users = User.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'nonconformityreport/registernonconformities.html',
        {
            'title':'Registro de Reporte de No Conformidad',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'disciplines': disciplines,
            'wbs': wbs,
            'users': users
        })

def searchnonconformity(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    users = User.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'nonconformityreport/searchnonconformity.html',
        {
            'title':'Busqueda de Reportes de No Conformidad',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'disciplines': disciplines,
            'wbs': wbs,
            'users': users
        })

@csrf_exempt
@login_required(login_url="login")
def savenonconformityreport(request, *args, **kwargs):

    if request.method == "POST":

        action = request.POST.get('action')

        if action == 'save_data_report':

            rep = request.POST.getlist('reporte[]')
            data = {}

            reportdata = json.loads(rep[0])

            wbs_non = WBS.objects.get(pk=int(reportdata['area_non']))
            contract_non = Contract.objects.get(pk=int(reportdata['id_contrato']))
            api_non = API.objects.get(pk=int(reportdata['id_api']))
            discipline_non = Discipline.objects.get(pk=int(reportdata['discipline']))
            register_non = User.objects.get(pk=int(reportdata['register_by']))

            nonconformity_report = NonConformityReport(
                    num_audit = int(reportdata['audit']),
                    item = int(reportdata['item_non']),
                    correlative = int(reportdata['correlative']),
                    creation_date = reportdata['created_at'],
                    criticality = int(reportdata['critical']),
                    sistem = reportdata['sistem'],
                    subsistem = reportdata['subsistem'],
                    origin = reportdata['origin'],
                    clasification = reportdata['clasification'], 
                    infringement_requirement = reportdata['requirement'], 
                    details = reportdata['description'],
                    observations = reportdata['observation'],
                    reference_documents = reportdata['reference_standar'], 
                    ncr_standar = reportdata['specific_standar'],
                    num_transmital_ncr = int(reportdata['num_envio']),
                    num_transmital_action = int(reportdata['num_accion']),
                    num_ncr = int(reportdata['num_ncr']),
                    status = reportdata['status'],
                    stipulated_date = reportdata['stipulated_date'],
                    real_close_date = reportdata['close_date'],
                    wbs = wbs_non,
                    contract = contract_non, 
                    api = api_non,
                    discipline = discipline_non, 
                    register_by = register_non
                )

            nonconformity_report.save()

            id_rep_noncon = nonconformity_report.id

            if id_rep_noncon > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': id_rep_noncon
                    }

                #if reportdata['exist_file'] == 0:

                    #createwalkpdf(id_rep_walk)
            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

        if len(request.FILES.getlist('images')) > 0:

            imagenes = request.FILES.getlist('images')
            report_for_id = NonConformityReport.objects.last()
            id_rep_noncon = report_for_id.id

            for img in imagenes:

                wrr = NonConformityImage(
                        image = img
                    )
                wrr.save()

                wrrf = NonConformityReportImage(
                        report = report_for_id,
                        image = wrr 
                        )

                wrrf.save()

            if id_rep_noncon > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': id_rep_noncon
                    }

                #createwalkpdf(id_rep_walk)

            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)