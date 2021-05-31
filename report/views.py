from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from report.models import *
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.http import HttpResponse
import numpy as np
import math as mt
from app.models import *
import json
from django.db.models import Sum
from openpyxl import Workbook, load_workbook
from openpyxl.writer.excel import save_virtual_workbook
from openpyxl.worksheet.table import Table, TableStyleInfo
import re
from reportlab.pdfgen import canvas
from django.conf import settings
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape, portrait, A4
from reportlab.lib import utils 
import io
from django.core.files.base import ContentFile
from report.models import Image as ImgReport
from report.forms import UploadFileForm
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER

# Create your views here.

###FORMULARIO DE GENERATE REPORT
@login_required(login_url="login")
def createreport(request):

    #Objetos a mostrar
    apis = API.objects.all()
    contracts = Contract.objects.all()
    specialties = Specialty.objects.all()
    references = Reference.objects.all()
    activities = Activity.objects.all()
    subactivities = SubActivity.objects.all()
    equipments = Equipment.objects.all()
    nonconformities = NonConformity.objects.all()
    followings = Following.objects.all()
    preconditions = Precondition.objects.all()
    measures = Measure.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'form-report/generatereport.html',
        {
            'title':'Registro de Informe Diario',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'specialties': specialties,
            'references': references,
            'activities': activities,
            'subactivities': subactivities,
            'equipments': equipments,
            'nonconformities': nonconformities,
            'followings': followings,
            'preconditions': preconditions,
            'measures': measures,
        })

@login_required(login_url="login")
def buscarcontratos(request, *args, **kwargs):
    data = {}

    try:
       if request.method == 'GET':
           Id = request.GET['id']
           action = request.GET['action']
           data = []

           if action == 'search_contract_id':
                contrato = Contract.objects.filter(api=Id)
                api = API.objects.filter(id=Id)
                for i in contrato:
                    data.append({'id': i.id, 
                                 'contract_number': i.contract_number,
                                 'project_name': api[0].project_name})

           if action == 'search_contract_info':
               contrato = Contract.objects.filter(id=Id)
               actividad = Activity.objects.filter(contract=Id)

               for i in actividad:
                   data.append({'id_contract': contrato[0].id,
                                'enterprise': contrato[0].enterprise,
                                'start_date_contract': contrato[0].start_date,
                                'finish_date_contract': contrato[0].finish_date,
                                'id': i.id,
                                'activity_name': i.activity_name,
                                'start_date_activity': i.start_date,
                                'finish_date_activity': i.finish_date})

           if ((action == 'search_subactivity') or (action == 'search_subactivity_nop')):
               subactividad = SubActivity.objects.filter(activity=Id)

               for i in subactividad:
                   data.append({'id':i.id,
                                'subactivity_name':i.subactivity_name})

           if ((action == 'search_sub_nop_info') or (action == 'search_sub_p_info')):

                subactividad = SubActivity.objects.filter(id=Id)
                medida = Measure.objects.filter(id=subactividad[0].measureunit.id)
                historical = Historical.objects.filter(subactivity=Id)

                if(len(historical)>0):
                    sum = 0
                
                    for i in historical:
                        sum += i.real_amount

                    dias = int(np.busday_count(subactividad[0].start_date,
                                        subactividad[0].finish_date)) 
                    if dias == 0:
                        dias = 1
                   
                    data.append({'id': subactividad[0].id,
                                 'measure_id': subactividad[0].measureunit.id,
                                 'measure': subactividad[0].measureunit.measure_name,
                                 'average_amount': subactividad[0].average_amount,
                                 'total': sum,
                                 'ref_day': round(subactividad[0].average_amount/dias
                                                , 2)
                                 })

                else:
                    data.append({'id': subactividad[0].id,
                                 'measure_id': subactividad[0].measureunit.id,
                                 'measure': medida[0].measure_name,
                                 'average_amount': subactividad[0].average_amount,
                                 'total': 0,
                                 'ref_day': 0})
                
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)

@login_required(login_url="login")
def buscarsubactividades(request, *args, **kwargs):
    data = {}
    try:
       if request.method == 'GET':
           action = request.GET['action']
           act = request.GET['act']
           subact = request.GET['subact']
           data = 0
           #data.append({'id': 1})
           if action == 'search_subactivities':
              subactividad = SubActivity.objects.filter(subactivity_name=str(subact))
              if subactividad != " ":
                  data = 1

    except Exception as e:
        data['error'] = e
    return JsonResponse(data, safe=False)

@csrf_exempt
@login_required(login_url="login")
def savereport(request, *args, **kwargs):

    if request.method == "POST":

        action = request.POST.get('action')
        hd = request.POST.getlist('historico[]')
        rd = request.POST.getlist('referencias[]')
        ed = request.POST.getlist('equipos[]')
        rpd = request.POST.getlist('reporte[]')


        if 'id_report' not in globals():

            global id_report

        if action == 'save_report':

            data = {}

            historicaldata = json.loads(hd[0])
            referencedata = json.loads(rd[0])
            reportdata = json.loads(rpd[0])
            equipmentdata = json.loads(ed[0])

            for i in reportdata:

                follow = Following.objects.get(pk = int(i['id_seguimiento']))

                reporte = Report(
                    deviation_detected = i['desviacion'],
                    action_plan = i['plandeaccion'],
                    evidence_obs = i['evidencia_obs'],
                    following = follow
                    )

                reporte.save()
                
                id_report = reporte.id
                  
            for i in historicaldata:

                subact = SubActivity.objects.get(pk = int(i['id_subactividad']))
                mea = Measure.objects.get(pk = int(i['id_medida']))
                noncon = NonConformity.objects.get(pk = int(i['id_conformidad']))
                spec = Specialty.objects.get(pk = int(i['id_especialidad']))
                precon = Precondition.objects.get(pk = int(i['id_precondicion']))
                actype = ActivityType.objects.get(pk = int(i['id_actividad_type']))
                activi = Activity.objects.get(pk = int(i['id_actividad']))

                historical = Historical(
                    real_amount = i['cantidad_real'],
                    subactivity_no_program = i['subactivity_no_program'],
                    subactivity = subact,
                    measure = mea,
                    nonconformity = noncon,
                    specialty= spec,
                    precondition= precon,
                    user= request.user,
                    activitytype= actype,
                    report = reporte,
                    no_program_total = i['total_estimado'],
                    no_program_refday = i['referencia_diaria'],
                    no_program_total_acu = i['total_acumulado'],
                    activity = activi
                    )

                historical.save()

            for i in referencedata:
                ref = Reference.objects.get(pk = int(i['referencia_id']))

                reference = HistoricalReference(
                    description = i['descripcion'],
                    report = reporte,
                    reference = ref
                    )

                reference.save()

            for i in equipmentdata:
                act = Activity.objects.get(pk = int(i['id_actividad']))
                equi = Equipment.objects.get(pk = int(i['id_equipo']))

                equipment = EquipmentAmount(
                        equipment_amount = i['cantidad'],
                        direct_endowment = i['dot_directa'],
                        direct_reference = i['dot_referen'],
                        indirect_endowment = i['dot_indirecta'],
                        activity = act,
                        equipment = equi,
                        report = reporte
                    )
                equipment.save()
        
        if len(request.FILES.getlist('image')) > 0:

            image = request.FILES.getlist('image')
            observation = request.POST.getlist('observation')
            subactivity_image = request.POST.getlist('image_subactivity')

            report_id = id_report
            repor = Report.objects.get(pk = id_report)
            obser = 0
            
            for i in image:

                subactividad_img = SubActivity.objects.get(id=int(subactivity_image[obser]))     
                
                imagen = ImgReport(
                    image = i,
                    description = observation[obser]
                    )

                imagen.save()

                imagereport = ReportImage(
                    report = repor,
                    image = imagen,
                    subactivity = subactividad_img
                    )

                imagereport.save()

                obser = obser + 1

            if id_report > 0:
                    
                data = {
                    'submitted': 1,
                    'id_report': id_report
                    }
            else:
                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

    else:
        return HttpResponse("<h2>No es posible agregar el reporte, verifique los datos correctamente</h2>")

### FORMULARIO DE BUSCAR REPORTES

@login_required(login_url="login")
def searchactivities(request):

    #Objetos a mostrar
    apis = API.objects.all()
    contracts = Contract.objects.all()
    specialties = Specialty.objects.all()
    references = Reference.objects.all()
    activities = Activity.objects.all()
    subactivities = SubActivity.objects.all()
    equipments = Equipment.objects.all()
    nonconformities = NonConformity.objects.all()
    followings = Following.objects.all()
    preconditions = Precondition.objects.all()
    measures = Measure.objects.all()
    activitytypes = ActivityType.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'form-report/searchactivities.html',
        {
            'title':'Búsqueda de Actividades y Subactividades',
            'year':datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'specialties': specialties,
            'references': references,
            'activities': activities,
            'subactivities': subactivities,
            'equipments': equipments,
            'nonconformities': nonconformities,
            'followings': followings,
            'preconditions': preconditions,
            'measures': measures,
            'activitytypes': activitytypes,
        }
    )

search = []
@login_required(login_url="login")
def busquedaactividades(request, *args, **kwargs):


    try:
       if request.method == 'GET':

            search.clear()

            listar = request.GET.getlist('listar[]')
            busqueda = json.loads(listar[0])

            contrato = Contract.objects.get(pk=int(busqueda[0]['id_contrato']))
            api = API.objects.get(pk=int(busqueda[0]['id_api']))

            for i in busqueda:
                historicos = Historical.objects.filter(activity=int(i['id_actividad'])).values('subactivity',
                                                                                                'activity', 
                                                                                                'measure', 
                                                                                                'activitytype',
                                                                                                'subactivity_no_program',
                                                                                                ).order_by('subactivity').annotate(totalacumulado=Sum('real_amount'))
            #search = []

            for i in historicos:
                historic = Historical.objects.filter(subactivity = int(i['subactivity'])).latest('inspection_date')
                act = Activity.objects.get(id = int(i['activity']))
                sub = SubActivity.objects.get(id = int(i['subactivity']))
                acttype = ActivityType.objects.get(id = int(i['activitytype']))
                noconfor = NonConformity.objects.get(id = int(historic.nonconformity_id))
                report = Report.objects.get(id = int(historic.report_id))
                measure = Measure.objects.get(id = int(i['measure']))
                segui = Following.objects.get(id = int(report.following_id))

                search.append({
                    'id_contrato': contrato.id,
                    'id_api': api.id,
                    'contrato': contrato.contract_name, 
                    'contrato_numero': contrato.contract_number, 
                    'api': api.api_number,
                    'id_actividad': i['activity'],
                    'actividad': act.activity_name,
                    'id_subactividad': i['subactivity'],
                    'subactividad': sub.subactivity_name,
                    'subactivdad_no_programada': i['subactivity_no_program'],
                    'total_estimado': sub.average_amount,
                    'id_medida': i['measure'],
                    'medida': measure.measure_name,
                    'total_acumulado': i['totalacumulado'],
                    'fecha_inicio': sub.start_date,
                    'fecha_termino': sub.finish_date,
                    'observaciones': report.evidence_obs,
                    'id_seguimiento': segui.id,
                    'seguimiento': segui.following_name,
                    'id_tipo_sub': acttype.id,
                    'tipo_subactividad': acttype.activity_type_name,
                    'id_no_conformidad': noconfor.id,
                    'no_conformidad': noconfor.nonconformity_name
                    })
            
            if int(busqueda[0]['id_subactividad']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['id_subactividad'] != int(busqueda[0]['id_subactividad'])):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_seguimiento']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['id_seguimiento'] != int((busqueda[0]['id_seguimiento']))):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_tipoactividad']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['id_tipo_sub'] != int((busqueda[0]['id_tipoactividad']))):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_conformidad']) != 0:
                        
                large = len(search)  
                inc = 0
                while inc < large:
                
                    if (search[inc]['id_no_conformidad'] != int((busqueda[0]['id_conformidad']))):

                        search.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

    except Exception as e:
        search['error'] = e
    return JsonResponse(search, safe=False)

#FUNCION PARA AJUSTAR EL ANCHO DE LAS COLUMNAS DE LOS EXCEL
def exceladjust(excel):
    for col in excel.columns:
        max_lenght = 0
        col_name = re.findall('\w\d', str(col[0]))
        col_name = col_name[0]
        col_name = re.findall('\w', str(col_name))[0]
        for cell in col:
            try:
                if len(str(cell.value)) > max_lenght:
                    max_lenght = len(cell.value)
            except:
                pass
        adjusted_width = (max_lenght+2)
        excel.column_dimensions[col_name].width = adjusted_width

def dicttolist(lista, excels):

    for l in lista:

        listkey = l.values()
        listkey = list(listkey)

        excels.append(listkey)    

    return excels

def transformtotable(headers, infoinserted, excel, name):

    alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT']

    ancho = len(headers) - 1
    largo = len(infoinserted) + 1

    tab = Table(displayName="Table"+ name, ref="A1:"+ alphabet[ancho] + str(largo))

    # Add a default style with striped rows and banded columns
    style = TableStyleInfo(name="TableStyleMedium9", showFirstColumn=False,
                           showLastColumn=False, showRowStripes=True, showColumnStripes=True)
    tab.tableStyleInfo = style

    excel.add_table(tab)

    return excel

#FUNCION PARA DESCARGAR EL EXCEL AL REALIZAR UNA BÚSQUEDA DE ACTIVIDAD Y SUBACTIVIDAD
@login_required(login_url="login")
def downloadexcelsearch(request, id):

    wb = Workbook()
    headers = ['ID CONTRATO', 'ID API', 'CONTRATO', 'CONTRATO NUMERO',
                'API', 'ID ACTIVIDAD', 'ACTIVIDAD', 'ID SUBACTIVIDAD', 
                'SUBACTIVIDAD', 'SUBACTIVIDAD NO PROGRAMADA', 'TOTAL ESTIMADO',
                'ID MEDIDA', 'MEDIDA', 'TOTAL ACUMULADO', 'FECHA INICIO', 'FECHA TERMINO',
                'OBSERVACIONES', 'ID SEGUIMIENTO', 'SEGUIMIENTO', 'ID TIPO SUBACTIVIDAD',
                'TIPO SUBACTIVIDAD', 'ID NO CONFORMIDAD', 'NO CONFORMIDAD']

    headersequipos = ['NOMBRE DEL EQUIPO', 'CANTIDAD', 'DOTACION DIRECTA', 'DOTACION INDIRECTA', 'DOTACION REFERENCIAL', 'NOMBRE ACTIVIDAD']

    headersreference = ['NOMBRE REFERENCIA', 'DESCRIPCION', 'NUMERO REPORTE', 'FECHA DE REPORTE']

    headersforall = ['ID CONTRATO', 'CONTRATO', 'NUMERO CONTRATO', 'EMPRESA CONTRATISTA', 'RUT EMPRESA', 'JEFE DE PROYECTO', 'CORREO EMPRESA', 'TELEFONO EMPRESA',
                     'FECHA INICIO CONTRATO', 'FECHA TERMINO CONTRATO', 
                    'API','NUMERO DE API','NUMERO DE REPORTE', 'FECHA DE REPORTE','ACTIVIDAD', 'INICIO ACTIVIDAD',
                    'TERMINO ACTIVIDAD', 'SUBACTIVIDAD','CANTIDAD A LOGRAR', 'PROMEDIO HH',
                    'INICIO SUBACTIVIDAD', 'TERMINO SUBACTIVIDAD', 'UNIDAD', 'CANTIDAD REAL', 'TIPO DE ACTIVIDAD',
                    'PRECONDICION','¿CONFORMIDAD?',
                    'USUARIO', 'ESPECIALIDAD', 'DESVIACION DETECTADA',
                    'PLAN DE ACCION', 'SEGUIMIENTO']    

    #EXTRACCIÓN DE INFORMACIÓN DE ACTIVIDADES Y SUBACTIVIDADES PROGRAMADAS DE UN CONTRATO

    contrato_id = search[0]['id_contrato']
    api_id = search[0]['id_api']
    print(id)

    contrato = Contract.objects.filter(id=int(contrato_id))
    api = API.objects.filter(id=int(api_id))
    actividades = Activity.objects.filter(contract=int(contrato_id))
    subs = []
    for a in actividades:
         
        subactividades = SubActivity.objects.filter(activity=int(a.id))

        for s in subactividades:

            subs.append({
                    'id_subactividad': s.id
                })

    histprogram = []
    historicalref = []

    for su in subs:

        historicos = Historical.objects.filter(subactivity=int(su['id_subactividad']))

        for h in historicos:

            follow = Following.objects.filter(id=int(h.report.following_id))
            histprogram.append({
                    'id_contrato': contrato[0].id,
                    'contrato': contrato[0].contract_name,
                    'numero_contrato': contrato[0].contract_number,
                    'empresa': contrato[0].enterprise,
                    'rut': contrato[0].rut,
                    'jefe': contrato[0].project_boss,
                    'correo': contrato[0].email,
                    'telefono': contrato[0].cellphone,
                    'inicio_contrato': contrato[0].start_date,
                    'termino_contrato': contrato[0].finish_date,
                    'api': api[0].project_name,
                    'numero_api': api[0].api_number,
                    'numero_reporte': h.report_id,
                    'fecha_reporte': str(h.report.inspection_date.day) + "/"
                                     + str(h.report.inspection_date.month) + "/"
                                     + str(h.report.inspection_date.year),
                    #'id_actividad': h.activity_id,
                    'actividad': h.activity.activity_name,
                    'inicio_actividad': h.activity.start_date,
                    'termino_actividad': h.activity.finish_date,
                    #'id_subactividad': h.subactivity_id,
                    'nombre_subactividad': h.subactivity.subactivity_name,
                    'cantidad_a_realizar': h.subactivity.average_amount,
                    'promedio_hh': h.subactivity.average_hh,
                    'inicio_subactivity': h.subactivity.start_date,
                    'termino_subactivity': h.subactivity.finish_date,
                    'unidad': h.measure.measure_name,
                    #'id_historico': h.id,
                    'cantidad_real': h.real_amount,
                    'tipo_actividad': h.activitytype.activity_type_name,
                    'precondicion': h.precondition.precondition_name,
                    'nonconformity': h.nonconformity.nonconformity_name,
                    'usuario': h.user.first_name + " " + h.user.last_name,
                    'especialidad': h.specialty.specialty_name,
                    'desviacion': h.report.deviation_detected,
                    'plan_de_accion': h.report.action_plan,
                    'seguimiento': follow[0].following_name

                })
            histrefe = HistoricalReference.objects.filter(report=int(h.report_id))

            for hf in histrefe:

                historicalref.append({
                    'nombre_referencia': hf.reference.reference_name,
                    'descripcion': hf.description,
                    'numero_reporte': hf.report_id,
                    'fecha_reporte': str(hf.report.inspection_date.day) + "/"
                                     + str(hf.report.inspection_date.month) + "/"
                                     + str(hf.report.inspection_date.year)
                    })
    
    equiposcantidad = []

    for act in actividades:
        equiamo = EquipmentAmount.objects.filter(activity=int(act.id))
        for equi in equiamo:
            equiposcantidad.append({
                'nombre_equipo':equi.equipment.equipment_name,
                'cantidad': equi.equipment_amount,
                'dotacion_directa': equi.direct_endowment,
                'dotacion_indirecta':equi.indirect_endowment,
                'dotacion_referencial':equi.direct_reference,
                'actividad':equi.activity.activity_name
                })



    wb.remove(wb.active)

    page = wb.create_sheet('BÚSQUEDA ESPECIFICA')
    page2 = wb.create_sheet('HISTORICO DE REPORTES')
    page3 = wb.create_sheet('REFERENCIAS')
    page4 = wb.create_sheet('EQUIPOS')

    page.append(headers)
    page2.append(headersforall)
    page3.append(headersreference)
    page4.append(headersequipos)

    page = dicttolist(search, page)
    page2 = dicttolist(histprogram, page2)
    page3 = dicttolist(historicalref, page3)
    page4 = dicttolist(equiposcantidad, page4)

    page = transformtotable(headers, search, page, "Búsqueda")
    page2 = transformtotable(headersforall, histprogram, page2,"Historico")
    page3 = transformtotable(headersreference, historicalref, page3, "Referencias")
    page4 = transformtotable(headersequipos, equiposcantidad, page4, "Equipos")

    page = exceladjust(page)
    page2 = exceladjust(page2)
    page3 = exceladjust(page3)
    page4 = exceladjust(page4)

    now = datetime.now()
    format = now.strftime('%d/%m/%Y')
    nombre_archivo = "Reporte-de-"+ request.user.first_name + "_" + request.user.last_name + "("+str(format)+").xlsx"
    response = HttpResponse(save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="'+ nombre_archivo +'"'
    return response

    wb.save(response)

    return response

# FORMULARIO PARA LA CARGA DE DATOS
@login_required(login_url="login")
def loadfiles(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'form-report/loadfiles.html',
        {
            'title':'Cargar Datos',
            'year':datetime.now().year,
        }
    )

#CARGA DE DATOS A TRAVES DE UN EXCEL
@csrf_exempt
@login_required(login_url="login")
def readexcel(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        rd = form.is_valid() 
        if form.is_valid():
            wb = load_workbook(filename=request.FILES['file'].file, data_only=True)

            sheet_obj = wb.active
            m_row = sheet_obj.max_row
            
            actividades = []
            subactividades = []

            act_index = 0

            for i in range(1, m_row + 1):

                if sheet_obj.cell(row = i, column = 4) != None:

                    if sheet_obj.cell(row = i, column = 6) != None:

                        actividad = sheet_obj.cell(row = i, column = 4)
                        fecha_inicio = sheet_obj.cell(row = i, column = 6)
                        fecha_termino = sheet_obj.cell(row = i, column = 7)
                        total_estimado = sheet_obj.cell(row = i, column = 11)
                        referencia_diaria = sheet_obj.cell(row = i, column = 13)
                        medida = sheet_obj.cell(row = i, column = 14)
                        contrato = sheet_obj.cell(row = i, column = 4)
                        api = sheet_obj.cell(row = i, column = 4)

                        subactividades.append({
                            'actividad': actividades[act_index-1]['actividad'],
                            'subactividad': actividad.value,
                            'fecha_inicio_programada': fecha_inicio.value,
                            'fecha_inicio_programada': fecha_termino.value,
                            'total_estimado': total_estimado.value,
                            'referencia_diaria': round(referencia_diaria.value, 2),
                            'medida': medida.value
                            #'contrato': contrato,
                            #'api': api 
                            })

                        print(actividades[i-1])

                    else:

                        actividad = sheet_obj.cell(row = i, column = 4)

                        actividades.append({
                                'actividad': actividad.value
                            })

                        act_index += 1


# DESCARGA DE PDF AL REGISTRAR UN INFORME DIARIO
@login_required(login_url="login")
def create_pdf(request):
    
    id_rep = 17
    reportehecho = Report.objects.filter(id=int(id_rep))
    historico = Historical.objects.filter(report=int(id_rep))
    subactividad = SubActivity.objects.filter(id=int(historico[0].subactivity_id))
    actividad = Activity.objects.filter(id=int(subactividad[0].activity_id))
    contrato = Contract.objects.filter(id=int(actividad[0].contract_id))
    api = API.objects.filter(id=int(contrato[0].api_id))
    hist_ref = HistoricalReference.objects.filter(report=id_rep)
    hist_equi = EquipmentAmount.objects.filter(report=id_rep)
    hist_img = ReportImage.objects.filter(report=id_rep)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment;filename=REPORTE N°'+ str(id_rep)+'.pdf'

    buffer = io.BytesIO()

    c = canvas.Canvas(
                      buffer,
                      pagesize=portrait(letter)
                      )
    width, height = portrait(letter) 
    stream = io.BytesIO()

    #Cabezera PDF
    archivo_imagen = settings.STATIC_ROOT +'/app/img/logo.jpg'

    height_pdf = height
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/InformeBanner.png" 
    im_banner = Image(url_img, width=600, height=115)
    im_banner.drawOn(c, 5, 680)

    height_pdf -= 115

    c.setFont('Helvetica', 18)
    c.drawString(240, 670,"REPORTE N°"+str(id_rep))

    c.setFont('Helvetica', 10)
    c.drawString(25, 645,"Autor:")
    c.drawString(130, 645, historico[0].user.first_name + " " + 
                                     historico[0].user.last_name)

    c.drawString(25, 655,"Fecha de Inspección: ")
    c.drawString(130, 655, str(historico[0].report.inspection_date.day) + "/"
                                     + str(historico[0].report.inspection_date.month) + "/"
                                     + str(historico[0].report.inspection_date.year))

    height_pdf -= 30
    #Primera Parte PDF: Antecedentes Generales.
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/AntecedentesBanner.png" 
    im_banner = Image(url_img, width=600, height=47)
    im_banner.drawOn(c, 5, 590)

    height_pdf -= 47

    c.setFont('Helvetica', 10)
    c.drawString(25, 585,"N° de API: " + api[0].api_number)
    c.drawString(160, 585,"N° de Contrato: " + str(contrato[0].contract_number))
    c.drawString(320, 585,"Nombre de Proyecto: " + api[0].project_name)
    c.drawString(25, 575,"Empresa Contratista: " + contrato[0].enterprise)
    c.drawString(25, 565,"Fecha de Inicio: "+ str(contrato[0].start_date.day) + "/"
                                     + str(contrato[0].start_date.month) + "/"
                                     + str(contrato[0].start_date.year))
    c.drawString(160, 565,"Fecha de Termino: "+ str(contrato[0].finish_date.day) + "/"
                                     + str(contrato[0].finish_date.month) + "/"
                                     + str(contrato[0].finish_date.year))
    c.drawString(320, 565,"Especialidad: " + historico[0].specialty.specialty_name)
    c.drawString(25, 555,"Referencias Utilizadas: ")

    height_pdf -= 60

    cabezera_referencia = ['Nombre Referencia', 'Descripción']
    data = [cabezera_referencia] 
    for hr in hist_ref:
        data += [[hr.reference.reference_name, hr.description]]

    t=Table(data)
    t.setStyle(TableStyle([ ('FONTSIZE', (0,0), (-1, -1), 10),
                            ('LINEABOVE', (0,1), (-1,1), 0.5, colors.black),
                            ('LINEBEFORE', (2,0), (2,-1), 0.5, colors.black),
                            ('ALIGN', (0,0), (1,-1), 'LEFT'),
                            ('ALIGN', (2,0), (-1,-1), 'RIGHT')]))

    t.wrapOn(c, width - 400, height)
    w, h = t.wrap(100, 100)
    t.drawOn(c, 190, height - (h + 230), 0)

    pagina = 1
    c.drawString(250, 20,"Página " + str(pagina))

    #Segunda Parte PDF: Resultados
    height_pdf -= h
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/ResultadoBanner.png" 
    im_banner = Image(url_img, width=600, height=47)
    im_banner.drawOn(c, 5, height_pdf)

    height_pdf -= 20 
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/finish.png" 
    im_banner = Image(url_img, width=15, height=15)
    im_banner.drawOn(c, 230, height_pdf)
    c.drawString(250, height_pdf + 2, reportehecho[0].following.following_name)
    height_pdf -= 47

    #Tercera Parte PDF: Control de Avance por Actividad según cronograma.
    url_img = settings.STATIC_ROOT + "/app/img/report_banners/AvanceBanner.png" 
    im_banner = Image(url_img, width=600, height=47)
    im_banner.drawOn(c, 5, height_pdf)

    height_pdf -= 47

    styles = getSampleStyleSheet()
    styleN = styles["BodyText"]
    styleN.alignment = TA_LEFT
    styleBH = styles["Normal"]
    styleBH.alignment = TA_CENTER

    n_activity = Paragraph('''<b>ACTIVIDAD</b>''', styleBH)
    n_subactivity = Paragraph('''<b>SUB ACTIVIDAD</b>''', styleBH)
    n_cantidad = Paragraph('''<b>CANTIDAD REAL</b>''', styleBH)
    n_unidad = Paragraph('''<b>UNIDAD</b>''', styleBH)
    n_programado = Paragraph('''<b>PROGRAMADO</b>''', styleBH)
    n_refdia = Paragraph('''<b>REF. DIA</b>''', styleBH)
    n_acumulado = Paragraph('''<b>ACUMULADO</b>''', styleBH)
    n_cumpli = Paragraph('''<b>CUMPLIMIENTO</b>''', styleBH)
    n_causa = Paragraph('''<b>CAUSA NO CUMPLIMIENTO</b>''', styleBH)
    n_tipo_act = Paragraph('''<b>TIPO ACTIVIDAD</b>''', styleBH)

    
    actividades = [[n_activity, n_subactivity, n_cantidad, n_unidad, n_programado, n_refdia, n_acumulado, n_cumpli, n_causa, n_tipo_act]]
    c.setFont('Helvetica', 10)

    for acts in historico:

        dias = int(np.busday_count(acts.subactivity.start_date,
                            acts.subactivity.finish_date)) 
        if dias == 0:
            dias = 1

        if acts.nonconformity_id == 5:
            cumplimiento = 'Si'
            causa = 'Cumplida'
        else:
            cumplimiento = 'No'
            causa = acts.nonconformity.nonconformity_name

        if acts.activitytype_id == 1:
            activ_total = Historical.objects.values('subactivity_id').filter(subactivity=int(acts.subactivity_id)).annotate(total=Sum('real_amount'))
            actividades += [[Paragraph(acts.activity.activity_name, styleN), 
                             Paragraph(acts.subactivity.subactivity_name, styleN),
                             Paragraph(str(acts.real_amount), styleN), 
                             Paragraph(acts.measure.measure_name, styleN) ,
                             Paragraph(str(acts.subactivity.average_amount), styleN), 
                             Paragraph(str(round(acts.subactivity.average_amount/dias, 2)), styleN),
                             Paragraph(str(activ_total[0]['total']), styleN),
                             Paragraph(cumplimiento, styleN),
                             Paragraph(causa, styleN),
                             Paragraph(acts.activitytype.activity_type_name, styleN)]]
        else:
            activ_total = 0
            actividades += [[acts.activity.activity_name, 
                             acts.subactivity.subactivity_name,
                             str(acts.real_amount), 
                             acts.measure.measure_name, 
                             str(acts.no_program_total), 
                             str(acts.no_program_refday),
                             str(acts.no_program_total_acu),
                             cumplimiento,
                             causa,
                             Paragraph(acts.activitytype.activity_type_name)]]

    t=Table(actividades, colWidths=2.05 * cm)
    t.setStyle(TableStyle([ ('FONTSIZE', (0,0), (-1, -1), 10),
                            ('LINEABOVE', (0,1), (-1,1), 0.5, colors.black),
                            ('LINEBEFORE', (2,0), (2,-1), 0.5, colors.black),
                            ('ALIGN', (0,0), (1,-1), 'LEFT'),
                            ('ALIGN', (2,0), (-1,-1), 'RIGHT')]),
                            )


    t.wrapOn(c, width, height)
    w, h = t.wrap(100, 100)
    t.drawOn(c, 25, height_pdf, 0)

    height_pdf -= h 
    #Tercera Parte: Recursos EECC En Terreno

    url_img = settings.STATIC_ROOT + "/app/img/report_banners/RecursosBanner.png" 
    im_banner = Image(url_img, width=600, height=47)
    im_banner.drawOn(c, 5, height_pdf)
    
    height_pdf -= 47

    n_actividad = Paragraph('''<b>ACTIVIDAD</b>''', styleBH)
    n_equipo = Paragraph('''<b>EQUIPO</b>''', styleBH)
    n_cantidad = Paragraph('''<b>CANTIDAD</b>''', styleBH)
    n_d_directa = Paragraph('''<b>DOT. DIRECTA</b>''', styleBH)
    n_d_referencial = Paragraph('''<b>DOT. REFERENCIAL</b>''', styleBH)
    n_d_indirecta = Paragraph('''<b>DOT. INDIRECTA</b>''', styleBH)

    equipos = []

    equipos = [[n_actividad, n_equipo, n_cantidad, n_d_directa, n_d_referencial, n_d_indirecta]]

    for equi in hist_equi:
        equipos += [[Paragraph(equi.activity.activity_name , styleN),
                     Paragraph(equi.equipment.equipment_name, styleN),
                     Paragraph(str(equi.equipment_amount), styleN),
                     Paragraph(str(equi.direct_endowment), styleN),
                     Paragraph(str(equi.direct_reference), styleN),
                     Paragraph(str(equi.indirect_endowment), styleN)]]
    
    t=Table(equipos, colWidths=2.05 * cm)
    t.setStyle(TableStyle([ ('FONTSIZE', (0,0), (-1, -1), 10),
                            ('LINEABOVE', (0,1), (-1,1), 0.5, colors.black),
                            ('LINEBEFORE', (2,0), (2,-1), 0.5, colors.black),
                            ('ALIGN', (0,0), (1,-1), 'LEFT'),
                            ('ALIGN', (2,0), (-1,-1), 'RIGHT')]))

    t.wrapOn(c, width, height)
    w, h = t.wrap(100, 100)
    t.drawOn(c, 25, height_pdf, 0)

    #Cuarta Parte: Imagenes
    c.showPage()
    c.drawImage(archivo_imagen, 25, 740, 124, 82)
    c.setFont('Helvetica', 20)
    c.drawString(150, 700,"REGISTRO FOTOGRÁFICO")
    y_img = 440
    y_title = 670

    c.setFont('Helvetica', 12)
    pagina += 1
    c.drawString(250, 20,"Página " + str(pagina))

    for img in hist_img:

        url_img = settings.MEDIA_ROOT + "/" + img.image.image.name
        imgsize = utils.ImageReader(url_img) 
        iw, ih = imgsize.getSize() 
        aspect = iw/float(ih) 

        altura = 200
        c.setFont('Helvetica', 12)

        c.drawString(40, y_title, "Sub Actividad: " + img.subactivity.subactivity_name)
        y_title -= 20
        c.drawString(40, y_title, "Observación: " + img.image.description)

        im = Image(url_img, width=(altura*aspect), height=altura, hAlign='CENTER')
        im.drawOn(c, 40, y_img)
        y_img -= 270
        y_title -= 250


    #Quinta Parte: Observaciones generales
    c.showPage()
    c.drawImage(archivo_imagen, 25, 740, 124, 82)
    c.setFont('Helvetica', 20)
    c.drawString(150, 700,"OBSERVACIONES")

    c.setFont('Helvetica', 12)
    pagina += 1
    c.drawString(250, 20,"Página " + str(pagina))

    c.setFont('Helvetica', 15)
    c.drawString(30, 670,"DESVIACIONES DETECTADAS")
    c.setFont('Helvetica', 12)
    c.drawString(30, 650, reportehecho[0].deviation_detected)

    c.setFont('Helvetica', 15)
    c.drawString(30, 520,"PLAN DE ACCION")
    c.setFont('Helvetica', 12)
    c.drawString(30, 500, reportehecho[0].action_plan)

    c.setFont('Helvetica', 15)
    c.drawString(30, 350,"OBSERVACIONES GENERALES DE FOTOGRAFIAS")
    c.setFont('Helvetica', 12)        
    c.drawString(30, 330, reportehecho[0].evidence_obs)

    # Guardar
    c.save()

    buffer.seek(0)
    pdf: bytes = buffer.getvalue()

    response.write(pdf)
    file_data = ContentFile(pdf)

    reportpdf = PDFFile()
    reportpdf.upload.save('REPORTE N°'+ str(id_rep)+'.pdf', file_data, save=False)
    reportpdf.save()

    pdfrelation = PDFReport(
        pdffile = reportpdf,
        report = reportehecho[0]
        )

    pdfrelation.save()

    return response

    
 

