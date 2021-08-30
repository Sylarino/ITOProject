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
from nonconformityreport.views import compareData, setParagraph, separator, principalBanner

#VISTA PARA VER LA VENTANA DE REGISTRO DE NO CONFORMIDAD
def modifiediscreport(request, id):

    report = ISCList.objects.get(pk=int(id)) 
    report_file = ISCReportFile.objects.filter(isc_report_id=int(id)) 
    qualities = QualityContract.objects.filter(contract_id=report.contract_id) 
    groups = QualityRequirementGroup.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'iscreport/iscreport.html',
        {
            'title':'Modificacion de Reporte de Implementacion Sistema de Calidad',
            'year': datetime.now().year,
            'report': report,
            'files': report_file,
            'qualities': qualities,
            'groups': groups
        })

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

#Vista para buscar reportes ISC
def searchiscreport(request):

    apis = API.objects.all()

    assert isinstance(request, HttpRequest)

    return render(
        request,
        'iscreport/searchiscreport.html',
        {
            'title':'Busqueda de Reportes de Implementacion Sistema de Calidad',
            'year': datetime.now().year,
            'apis': apis,
        })

#FUNCION PARA AGREGAR ARCHIVOS 

def addfilestoreport(files_new, isc_report, data):

    if len(files_new) > 0:
        
        for fil in files_new:

            iscfile = ISCFile(
                    upload = fil
                )

            iscfile.save()

            iscrepfil = ISCReportFile(
                    isc_report = isc_report,
                    file = iscfile 
                    )

            iscrepfil.save()

    data = {
        'submit': 'success'
        }

    return data

#VISTA PARA MODIFICAR EL REPORTE ISC
@csrf_exempt
@login_required(login_url="login")
def savemodifiediscreport(request):

    if request.method == 'POST':

        data = {}
        id_isc = request.POST.get('id_reporte')
        files_new = request.FILES.getlist('files')
        isc_report = ISCList.objects.get(id=int(id_isc))

        data = addfilestoreport(files_new, isc_report, data)

        return JsonResponse(data)

#FUNCIÓN DE BUSQUEDA DE REPORTES ISC
@csrf_exempt
@login_required(login_url="login")
def searchiscreportingrid(request):

    try:

        if request.method == 'GET':

            search = []

            listar = request.GET.getlist('listar[]')
            busqueda = json.loads(listar[0])

            isc_rep = ISCList.objects.filter(api_id=int(busqueda[0]['id_api']))

            for report in isc_rep:

                search.append({
                    'id_reporte': report.id,
                    'contrato': report.contract.contract_number,
                    'api': report.api.api_number,
                    'contrato_id': report.contract_id,
                    'api_id': report.api_id,
                    'historico_fecha':  str(report.creation_date.day) + "/"
                             + str(report.creation_date.month) + "/"
                             + str(report.creation_date.year),
                    'num_audit': report.num_audit,
                    'correlativo': report.correlative
                    })

        
            search = compareData('api_id', 'id_api', search, busqueda)
            search = compareData('contrato_id', 'id_contrato', search, busqueda)

            if busqueda[0]['fecha_inicio'] != "" and busqueda[0]['fecha_termino'] != "":
                        
                large = len(search)  
                inc = 0

                startdate = busqueda[inc]['fecha_inicio']
                fecha_st = datetime.strptime(startdate, '%d/%m/%Y')

                finishdate = busqueda[inc]['fecha_termino']
                fecha_ed = datetime.strptime(finishdate, '%d/%m/%Y')

                while inc < large:
                    
                    report_date = search[inc]['historico_fecha']
                    fecha_rp = datetime.strptime(report_date, '%d/%m/%Y')

                    if fecha_rp < fecha_st or fecha_rp > fecha_ed:

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

    except Exception as e:

        respuesta = e

    return JsonResponse(search, safe=False)       

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

            files_new = request.FILES.getlist('files')

            data = addfilestoreport(files_new, isc_lista, data)

        else:

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

#Función para crear el pdf del ISC
def createpdfiscreport(request):

    id_rep = 1
    isc_report = ISCList.objects.get(id=int(id_rep))
    isc_qual_contr = QualityContract.objects.filter(contract_id=int(isc_report.contract_id))
    groups = QualityRequirementGroup.objects.all()

    #Configuración de Response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment;filename=REPORTE_ISC_N°'+ str(id_rep)+'.pdf'

    buffer = io.BytesIO()

    c = canvas.Canvas(
                      buffer,
                      pagesize=portrait(letter)
                      )

    width, height = portrait(letter) 

    #Estilos para textos
    styles = getSampleStyleSheet()
    styleN = styles["BodyText"]
    styleN.alignment = TA_LEFT
    styleBH = styles["Normal"]
    styleBH.alignment = TA_CENTER

    #Cabezera PDF
    pagina = 0
    height_pdf = height
    archivo_imagen = settings.STATIC_ROOT +'/app/img/logo.jpg'
    height_pdf, pagina = principalBanner(height_pdf, c, id_rep,pagina,0, 'iscreport')

    #ANTECEDENTES GENERALES
    c.setFont('Helvetica', 14)
    title_report = stringWidth("ANTECEDENTES GENERALES", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), 670,"ANTECEDENTES GENERALES")

    c.setFont('Helvetica', 8)
    c.drawString(25, 650,"N° Contrato: " + str(isc_report.contract.contract_number))
    c.drawString(25, 635,"Proyecto: " + isc_report.contract.contract_name)
    c.drawString(25, 620,"Empresa Responsable: " + isc_report.contract.enterprise)

    c.drawString(396, 650,"N° Auditoría: " + str(isc_report.num_audit))
    c.drawString(396, 635,"Correlativo: " + str(isc_report.correlative))
    c.drawString(396, 620,"Fecha de Creación: " + str(isc_report.creation_date.day) + "/"
                             + str(isc_report.creation_date.month) + "/"
                             + str(isc_report.creation_date.year))
    ##Separador
    height_pdf -= 70
    height_pdf = separator(c, height_pdf)

    #LISTA DE VERIFICACION


    c.save()

    buffer.seek(0)
    pdf: bytes = buffer.getvalue()

    response.write(pdf)
    file_data = ContentFile(pdf)

    return response
