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
from django.http import HttpResponse, Http404
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
from iscreport.models import *

#Vista para buscar datos del modal de Requerimientos
def searchrequirements(request, id):

    requirements = QualityRequirement.objects.filter(group_id=int(id))
    group = QualityRequirementGroup.objects.get(pk=int(id))

    assert isinstance(request, HttpRequest)

    return render(
        request,
        'iscreport/viewrequirements.html',
        {
            'title':'Lista de Requisitos',
            'year': datetime.now().year,
            'requirements': requirements,
            'group': group
        })

#Vista para generar la ventana o formulario de registro de lista ISC de cada proyecto
def registeriscreport(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    users = User.objects.all()
    requirement = QualityRequirement.objects.all()
    grouprequirement = QualityRequirementGroup.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'iscreport/registeriscreport.html',
        {
            'title':'Registro de Lista de Verificacion: Implementacion Sistema de Calidad',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'users': users,
            'requirement':requirement,
            'grouprequirement':grouprequirement

        })

def addqualityrequirement(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    users = User.objects.all()
    requirement = QualityRequirement.objects.all()
    grouprequirement = QualityRequirementGroup.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'iscreport/addqualityrequirement.html',
        {
            'title':'Agregar Requisitos de Calidad a Contrato',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'users': users,
            'requirement':requirement,
            'grouprequirement':grouprequirement

        })

@csrf_exempt
@login_required(login_url="login")
def saverequirements(request):

    if request.method == 'POST':

        action = request.POST.get('action')
        data = {}
        id_requi = request.POST.get('id')
        rpd = request.POST.getlist('qualities[]')
        requirements = json.loads(rpd[0])

        contrato = Contract.objects.get(pk=int(id_requi))

        for requirement in requirements:
            print(requirement)
            find_group = QualityRequirementGroup.objects.get(pk=int(requirement))
            grupo = GroupContract(
                    contract = contrato,
                    group = find_group
                )

            grupo.save()

        data = {
            'submit': 'success'
            }

        return JsonResponse(data)

@csrf_exempt
@login_required(login_url="login")
def saveregisteriscreport(request):

    if request.method == 'POST':


        data = {}
        id_contrato = request.POST.get('id')
        rpd = request.POST.getlist('requirements[]')
        requirements = json.loads(rpd[0])

        contrato = Contract.objects.get(pk=int(id_contrato))
        api_contr = API.objects.get(pk=contrato.api_id)
        id_group = 0

        for requirement in requirements:

            if requirement['cumplimiento'] == "option1":

                acc_var = True

            else:

                acc_var = False

            if int(id_group) != int(requirement['id_grupo']):

                find_group = QualityRequirementGroup.objects.get(pk=int(requirement['id_grupo']))

                id_group = find_group.id

            qual = QualityRequirement.objects.get(pk=int(requirement['id_requisito']))

            qual_cont = QualityContract(
                    accomplishment = acc_var,
                    verification_method = requirement['metodo_verificacion'],
                    audit_result = requirement['auditoria'], 
                    contract = contrato,
                    quality = qual,
                )

            qual_cont.save()

        isc_lista = ISCList(
                correlative = int(request.POST.get('corr')),
                num_audit = int(request.POST.get('audit')),
                creation_date = request.POST.get('date_isc'),
                api = api_contr,
                contract = contrato
            )

        isc_lista.save()                          

        if len(request.FILES.getlist('files')) > 0:

            files = request.FILES.getlist('files')

            for fil in files:

                iscfile = ISCFile(
                        upload = fil
                    )

                iscfile.save()

                iscrepfil = ISCReportFile(
                        isc_report = isc_lista,
                        file = iscfile 
                        )

                iscrepfil.save()

        data = {
            'submit': 'success'
            }

        return JsonResponse(data)

@csrf_exempt
@login_required(login_url="login")
def searchcontractsrequire(request):

    if request.method == 'GET':

        action = request.GET['action']
        group_data = []
        id_contract = request.GET['id']

        contract_group = GroupContract.objects.filter(contract_id=int(id_contract))

        for con in contract_group:
                
            if action == 'search_contract_add':

                    group_data.append({
                            'id_grupo': con.group_id,
                            'grupo_nombre': con.group.requirement_group_name,
                        })

            if action == 'search_contract_require':

                find_group = QualityRequirement.objects.filter(group_id=con.group_id)

                for finded in find_group:

                    group_data.append({
                            'id_grupo': con.group_id,
                            'grupo_nombre': con.group.requirement_group_name,
                            'id_requisito': finded.id,
                            'nombre_requisito': finded.requirement_name,
                            'referencia': finded.reference
                        })

        return JsonResponse(group_data, safe=False)
