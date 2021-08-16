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
            'title':'Registro de Lista ISC',
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


