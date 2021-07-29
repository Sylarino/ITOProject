from django.shortcuts import render
from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from walkreport.models import *
from report.models import *
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

# Create your views here.
def modifiedwalkreport(request, id):

    wo = WalkObservation.objects.get(pk=int(id))
    wr = WalkReport.objects.get(pk=int(wo.walk_report_id))
    wrr = FileWalkReport.objects.filter(walk_report_id = int(wo.walk_report_id))

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/observation.html',
        {
            'title':'Modificacion de Observacion de Caminata',
            'year': datetime.now().year,
            'reporte': wr,
            'archivos': wrr,
            'observacion': wo
        })

def registeruser(request):

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/userregister.html',
        {
            'title':'Registro de Usuario',
            'year': datetime.now().year
        })

@csrf_exempt
@login_required(login_url="login")
def registernewuser(request):

    if request.method == 'POST':

        action = request.POST.get('action')
        data = {}

        if action  == 'save_user':

            usuario = request.POST.get('user')
            nombres = request.POST.get('names')
            apellidos = request.POST.get('last_name')
            email = request.POST.get('email')
            id_user = 0

            new_user = User(
                    password = "Inicio2021",
                    is_superuser = 0,
                    username = usuario,
                    first_name = nombres,
                    last_name = apellidos,
                    email = email,
                    is_staff = 0,
                    is_active = 1
                )

            new_user.save()
            
            id_user = new_user.id

            group = Group.objects.get(name='Externo')
            new_user.groups.add(group)

            if int(id_user) > 0:
                    
                data = {
                    'submitted': 1,
                    'id_user': int(id_user)
                    }

            else:
                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

@csrf_exempt
@login_required(login_url="login")
def savemodifiedwalkreport(request):

    if request.method == 'POST':

        action = request.POST.get('action')
        data = {}

        if action  == 'save_walk_report':

            id_obs = 0
            id_obs = request.POST.get('id')
            fecha_compromiso_real = request.POST.get('fecha_compromiso_real')
            exist = request.POST.get('existe')

            wo = WalkObservation.objects.get(pk=int(id_obs))

            if wo.real_close_date  != datetime.strptime(fecha_compromiso_real, "%Y-%m-%d"):

                wo.real_close_date = datetime.strptime(fecha_compromiso_real, "%Y-%m-%d")

                wo.save()

            if int(id_obs) > 0:
                    
                data = {
                    'submitted': 1,
                    'id_observacion': int(id_obs)
                    }

                if exist[0] == 0:

                    createwalkpdf(int(wo.walk_report_id))

            else:
                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

        if len(request.FILES.getlist('files')) > 0:

            files_get = request.FILES.getlist('files')
            id_obs = request.POST.getlist('id_observation')

            wr = WalkObservation.objects.get(pk=int(id_obs[0]))
            wo = WalkReport.objects.get(pk=int(wr.walk_report_id))

            for file in files_get:

                wrr = NonConformityImage(
                        image = file
                    )
                wrr.save()

                wrrf = FileWalkReport(
                        walk_report = wo,
                        evidence_file =  wrr
                    )

                wrrf.save()

            if int(id_obs[0]) > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': int(wo.id)
                    }

                createwalkpdf(int(wo.id))

            else:
                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

#Vista para ir a la ventana de registro de reporte de caminata
def registerwalkreport(request):
    
    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    priorities = Priority.objects.all()
    users = User.objects.all()
    extern_users = User.objects.filter(groups__name='Externo')



    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/registerwalkreport.html',
        {
            'title':'Registro de Observacion de Caminata',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'disciplines': disciplines,
            'wbs': wbs,
            'priorities': priorities,
            'users': users,
            'extern_users': extern_users
        })

#Vista para ir a la ventana de consulta de reporte de caminata
def searchwalkreport(request):

    apis = API.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    priorities = Priority.objects.all()
    users = User.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/searchwalkreport.html',
        {
            'title':'Busqueda de Observacion de Caminata',
            'year': datetime.now().year,
            'apis': apis,
            'disciplines': disciplines,
            'wbs': wbs,
            'priorities': priorities,
            'users': users 
        })

#Vista para buscar el WBS
def searchwbs(request):

    try:
       if request.method == 'GET':
           Id = request.GET['id']
           action = request.GET['action']
           data = []

           if action == 'search_wbs':
                wbs = WBS.objects.filter(id=Id)
                for i in wbs:
                    data.append({'id': i.id, 
                                 'wbs': i.number})        
                    
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)

#Vista para guardar el reporte y observaciones de caminatas
@csrf_exempt
@login_required(login_url="login")
def savewalkreport(request,*args, **kwargs):

    if request.method == "POST":

        action = request.POST.get('action')
        obs = request.POST.getlist('observacion[]')
        rep = request.POST.getlist('reporte[]')

        if action == 'save_data_report':

            data = {}

            observation_data = json.loads(obs[0])
            report_data = json.loads(rep[0])
            caminata_report = WalkReport()
            id_rep_walk = 0

            for rep in report_data:

                wbs_data = WBS.objects.get(pk = int(rep['area_id']))
                contract_data = Contract.objects.get(pk = int(rep['contrato_id']))
                api_data = API.objects.get(pk = int(rep['api_id']))

                caminata_report = WalkReport(
                        top = rep['top'],
                        sistem = rep['sistema'],
                        subsistem = rep['subsistema'],
                        walk_number = int(rep['caminata']),
                        wbs = wbs_data,
                        contract = contract_data,
                        api = api_data
                    )

                caminata_report.save()

                id_rep_Walk = caminata_report.id

            for ob in observation_data:

                disci_data = Discipline.objects.get(pk = int(ob['disciplina_id']))
                register_data = User.objects.get(pk = int(ob['originador']))
                responsable_data = User.objects.get(pk = int(ob['resp_construccion']))
                leader_data = User.objects.get(pk = int(ob['lider_caminata']))
                prioridad_data = Priority.objects.get(pk = int(ob['prioridad']))

                observacion = WalkObservation(
                        ubication = ob['ubicacion'],
                        plane_number = int(ob['num_plano']),
                        equipment_code = int(ob['codigo_equipo']),
                        action_description = ob['descripcion'],
                        stipulated_date = ob['fecha_cierre'],
                        real_close_date = ob['fecha_cierre_real'],
                        discipline = disci_data,
                        walk_report = caminata_report,
                        register_by = register_data,
                        responsable = responsable_data,
                        leader = leader_data,
                        priority = prioridad_data
                    )

                observacion.save()


            if id_rep_walk > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': id_rep_walk
                    }

                if reportdata[0]['exist_file'] == 0:

                    createwalkpdf(id_rep_walk)
            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

        if len(request.FILES.getlist('files')) > 0:

            files_report = request.FILES.getlist('files')
            report_for_id = WalkReport.objects.last()
            id_rep_walk = report_for_id.id

            for file in files_report:

                file_evi = EvidenceFile(
                        upload = file                           
                    )

                file_evi.save()

                file_rel = FileWalkReport(
                        walk_report = report_for_id,
                        evidence_file = file_evi
                    )

                file_rel.save()

            if id_rep_walk > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': id_rep_walk
                    }

                createwalkpdf(id_rep_walk)


            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

#Función para crear el pdf del Acta de Observaciones de Caminatas
def createwalkpdf(id_report):

    #Llamar datos relacionados al reporte a crear
    reportecaminata = WalkReport.objects.filter(id=int(id_report))
    observaciones = WalkObservation.objects.filter(walk_report_id=int(id_report))
    evidencia_reporte = FileWalkReport.objects.filter(walk_report_id=int(id_report)) 

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment;filename=OBS-CAMINATA N°'+ str(id_report)+'.pdf'
    stream = io.BytesIO()

    #Creación de hoja en blanco
    c = canvas.Canvas(
                      stream,
                      pagesize=landscape(letter)
                      )
    width, height = landscape(letter) 

    styles = getSampleStyleSheet()
    styleN = styles["BodyText"]
    styleN.alignment = TA_LEFT
    styleBH = styles["Normal"]
    styleBH.alignment = TA_CENTER
    styleN.fontSize = 8
    styleBH.fontSize = 8

    #Cabezera PDF
    archivo_imagen = settings.STATIC_ROOT +'/app/img/logo.jpg'
    height_pdf = height
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/bannercaminata/banner_cabezera.png" 
    im_banner = Image(url_img, width=792, height=76)
    im_banner.drawOn(c, 0, 530)

    c.setFont('Helvetica', 18)
    title_report = stringWidth("ACTA N°"+str(id_report), 'Helvetica', 18)

    c.drawString((width/2)-(title_report/2), 570,"ACTA N°"+str(id_report))

    #Antecedentes Generales

    c.setFont('Helvetica', 14)
    title_report = stringWidth("ANTECEDENTES GENERALES", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), 518,"ANTECEDENTES GENERALES")

    c.setFont('Helvetica', 8)
    c.drawString(25, 500,"Proyecto: " + reportecaminata[0].api.project_name)
    c.drawString(25, 485,"WBS: " + str(reportecaminata[0].wbs.number))
    c.drawString(25, 470,"Área: " + reportecaminata[0].wbs.wbs_name)
    c.drawString(25, 455,"TOP: " + reportecaminata[0].top)
    c.drawString(25, 440,"Sistema: " + reportecaminata[0].sistem)

    c.drawString(396, 500,"Empresa: " + reportecaminata[0].contract.enterprise)
    c.drawString(396, 485,"Contrato: " + str(reportecaminata[0].contract.contract_name))
    c.drawString(396, 470,"Fecha Inicio Contrato: " + str(reportecaminata[0].contract.start_date.day) + "/"
                               + str(reportecaminata[0].contract.start_date.month) + "/"
                               + str(reportecaminata[0].contract.start_date.year))
    c.drawString(396, 455,"Caminata N°: " + str(reportecaminata[0].walk_number))
    c.drawString(396, 440,"Fecha y Hora: " + str(reportecaminata[0].historic_date.day) + "/"
                                     + str(reportecaminata[0].historic_date.month) + "/"
                                     + str(reportecaminata[0].historic_date.year))

    ##Separador
    height_pdf -= 200
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/bannercaminata/separador.png" 
    im_banner = Image(url_img, width=792, height=16)
    im_banner.drawOn(c, 0, height_pdf)
    height_pdf -= 20

    #Observaciones

    c.setFont('Helvetica', 14)
    title_report = stringWidth("ANTECEDENTES GENERALES", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), 399,"OBSERVACIONES EN CAMINATA")

    ###Primer trozo del parrafo
    info = Paragraph("1.- PRIORIDAD  01: Son detalle de terminación críticos que deben ser cerrados antes de la pruebas. (Construcción o preparación o Comisionamiento), PRIORIDAD  02: Son detalle de terminación criticidad moderada que pueden ser cerrados durante las pruebas por etapa, pero no las traspasarán al proceso sgte. PRIORIDAD 03: Son ítems adicionales que no están incluidos en el alcance del trabajo (presente contrato), pero son alcance de proyecto. PRIORIDAD 04: Son ítems adicionales que no están incluidos en el alcance del proyecto."
                    , styleN)  
    info.wrapOn(c, width, height)
    w, h = info.wrap(772, 100)
    height_pdf -= h
    info.drawOn(c, 15, height_pdf, 0)

    ###Segundo trozo del parrafo
    info = Paragraph("2.- El contratista es responsable de que este documento y el acta de asistencia sea firmado por asistentes a la caminata. Debe entregar una copia del listado de punch firmado en terreno y acta al líder de caminata."
                    , styleN)
    info.wrapOn(c, width, height)
    w, h = info.wrap(772, 100)
    height_pdf -= h
    info.drawOn(c, 15, height_pdf, 0)



    height_pdf -= 10
    
    n_ubicacion = Paragraph('''<b>UBICACIÓN</b>''', styleBH)
    n_plano = Paragraph('''<b>N° PLANO</b>''', styleBH)
    n_equipo = Paragraph('''<b>CÓDIGO EQUIPO</b>''', styleBH)
    n_disciplina = Paragraph('''<b>DISCIPLINA</b>''', styleBH)
    n_descripcion = Paragraph('''<b>DESCRIPCIÓN ACCIÓN PENDIENTE</b>''', styleBH)
    n_originador = Paragraph('''<b>ORIGINADOR POR</b>''', styleBH)
    n_responsable = Paragraph('''<b>RESP. CONSTRUCCIÓN</b>''', styleBH)
    n_lider = Paragraph('''<b>LIDER CAMINATA</b>''', styleBH)
    n_prioridad = Paragraph('''<b>PRIORIDAD</b>''', styleBH)
    n_fecha_compromiso = Paragraph('''<b>FECHA DE COMPROMISO DE CIERRE</b>''', styleBH)
    n_fecha_real = Paragraph('''<b>FECHA REAL DE CIERRE</b>''', styleBH)

    obs = []

    obs = [[n_ubicacion, 
            n_plano, 
            n_equipo, 
            n_disciplina, 
            n_descripcion, 
            n_originador, 
            n_responsable, 
            n_lider, 
            n_prioridad,
            n_fecha_compromiso,
            n_fecha_real]]

    for ob in observaciones:
        obs += [[Paragraph(ob.ubication , styleN),
                     Paragraph(str(ob.plane_number), styleN),
                     Paragraph(str(ob.equipment_code), styleN),
                     Paragraph(str(ob.discipline.discipline_name), styleN),
                     Paragraph(ob.action_description, styleN),
                     Paragraph(ob.register_by.first_name + " " + ob.register_by.last_name, styleN),
                     Paragraph(ob.responsable.first_name + " " + ob.responsable.last_name, styleN),
                     Paragraph(ob.leader.first_name + " " + ob.leader.last_name, styleN),
                     Paragraph(ob.priority.priority_name, styleN),
                     Paragraph(str(ob.stipulated_date.day) + "/"
                                     + str(ob.stipulated_date.month) + "/"
                                     + str(ob.stipulated_date.year), styleN),
                     Paragraph(str(ob.real_close_date.day) + "/"
                                     + str(ob.real_close_date.month) + "/"
                                     + str(ob.real_close_date.year), styleN),
                     ]]
    
    t=Table(obs, colWidths= 2.45 * cm)
    t.setStyle(TableStyle([ ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                            ('FONTSIZE', (0,0), (-1, -1), 8),
                            ('LINEABOVE', (0,1), (-1,1), 0.5, colors.black),
                            ('LINEBEFORE', (2,0), (2,-1), 0.5, colors.black),
                            ('ALIGN', (0,0), (1,-1), 'LEFT'),
                            ('ALIGN', (2,0), (-1,-1), 'RIGHT')]))

    t.wrapOn(c, width, height)
    w, h = t.wrap(100, 100)
    height_pdf -= h
    t.drawOn(c, 15, height_pdf, 0)

    #Procesar y Guardar Reporte
    c.save()

    stream.seek(0)
    pdf: bytes = stream.getvalue()

    response.write(pdf)
    file_data = ContentFile(pdf)

    reportpdf = PDFWalkReport()
    reportpdf.upload.save('REPORTE N°'+ str(id_report)+'.pdf', file_data, save=False)
    reportpdf.save()

    pdfrelation = WalkReportPDFFile(
        pdf = reportpdf,
        walk_report = reportecaminata[0]
        )

    pdfrelation.save()

search = []
#Vista para buscar los datos requeridos en la consulta de caminatas
@csrf_exempt
@login_required(login_url="login")
def searchwalks(request):
    
    try:

        if request.method == 'GET':

            search.clear()

            listar = request.GET.getlist('listar[]')
            busqueda = json.loads(listar[0])

            walk_rep = WalkReport.objects.filter(api_id=int(busqueda[0]['id_api']))

            for report in walk_rep:

                observaciones = WalkObservation.objects.filter(walk_report_id=int(report.id))

                for obs in observaciones:

                    search.append({
                        'id_reporte': report.id,
                        'id_observacion': obs.id,
                        'top':report.top,
                        'sistema': report.sistem,
                        'subsistema': report.subsistem,
                        'caminata': report.walk_number,
                        'area': report.wbs.wbs_name,
                        'contrato_id': report.contract_id,
                        'api_id': report.api_id,
                        'ubicacion': obs.ubication,
                        'plano': obs.plane_number,
                        'equipo': obs.equipment_code,
                        'accion': obs.action_description,
                        'historico_fecha': obs.historic_date,
                        'fecha_compromiso': obs.stipulated_date,
                        'fecha_compromiso_real': obs.real_close_date,
                        'disciplina': obs.discipline.discipline_name,
                        'disciplina_id': obs.discipline_id,
                        'responsable': obs.responsable.first_name + " " + obs.responsable.last_name,
                        'responsable_id': obs.responsable_id,
                        'originador': obs.register_by.first_name + " " + obs.register_by.last_name,
                        'originador_id': obs.register_by_id,
                        'lider': obs.leader.first_name + " " + obs.leader.last_name,
                        'lider_id': obs.leader_id,
                        'prioridad': obs.priority.priority_name,
                        'prioridad_id': obs.priority_id,
                        })

            if int(busqueda[0]['id_contrato']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['contrato_id'] != int(busqueda[0]['id_contrato'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_autor']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['originador_id'] != int(busqueda[0]['id_autor'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1     

            if int(busqueda[0]['id_lider']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['lider_id'] != int(busqueda[0]['id_lider'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1      
                  
            if int(busqueda[0]['id_disciplina']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['disciplina_id'] != int(busqueda[0]['id_disciplina'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1     

            if int(busqueda[0]['id_prioridad']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['prioridad_id'] != int(busqueda[0]['id_prioridad'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if busqueda[0]['fecha_inicio'] != "" and busqueda[0]['fecha_termino'] != "":
                        
                large = len(search)  
                inc = 0

                startdate = busqueda[inc]['fecha_inicio']
                fecha_st = datetime.strptime(startdate, '%d/%m/%Y')

                finishdate = busqueda[inc]['fecha_termino']
                fecha_ed = datetime.strptime(finishdate, '%d/%m/%Y')

                while inc < large:
                    
                    report_date = search[inc]['fecha_compromiso']
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

# DESCARGA DE PDF AL REGISTRAR UN INFORME DIARIO
@csrf_exempt
@login_required(login_url="login")
def downloadwalkpdf(request):

    if request.method == 'POST':
        rep_id = request.POST['id']
        file_path = settings.MEDIA_ROOT + "/pdf_walk_reports/REPORTE_N" +  rep_id + ".pdf"

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/pdf")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                buffer = io.BytesIO()

                buffer.seek(0)
                pdf: bytes = buffer.getvalue()

                response.write(pdf)
                file_data = ContentFile(pdf)

                return response

        raise Http404