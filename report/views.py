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

                global id_report
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
                        equipment = equi
                    )

                equipment.save()
        
        if len(request.FILES.getlist('image')) > 0:

            image = request.FILES.getlist('image')
            observation = request.POST.getlist('observation')

            report_id = id_report
            repor = Report.objects.get(pk = id_report)
            obser = 0
            for i in image:
                                
                imagen = Image(
                    image = i,
                    description = observation[obser]
                    )

                imagen.save()

                imagereport = ReportImage(
                    report = repor,
                    image = imagen
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

@login_required(login_url="login")
def busquedaactividades(request, *args, **kwargs):
    data = {}
    try:
       if request.method == 'GET':

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
            data = []

            for i in historicos:
                historic = Historical.objects.filter(subactivity = int(i['subactivity'])).latest('inspection_date')
                act = Activity.objects.get(id = int(i['activity']))
                sub = SubActivity.objects.get(id = int(i['subactivity']))
                acttype = ActivityType.objects.get(id = int(i['activitytype']))
                noconfor = NonConformity.objects.get(id = int(historic.nonconformity_id))
                report = Report.objects.get(id = int(historic.report_id))
                measure = Measure.objects.get(id = int(i['measure']))
                segui = Following.objects.get(id = int(report.following_id))

                data.append({
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
                        
                large = len(data)  
                inc = 0
                while inc < large:
                
                    if (data[inc]['id_subactividad'] != int(busqueda[0]['id_subactividad'])):

                        data.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_seguimiento']) != 0:
                        
                large = len(data)  
                inc = 0
                while inc < large:
                
                    if (data[inc]['id_seguimiento'] != int((busqueda[0]['id_seguimiento']))):

                        data.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_tipoactividad']) != 0:
                        
                large = len(data)  
                inc = 0
                while inc < large:
                
                    if (data[inc]['id_tipo_sub'] != int((busqueda[0]['id_tipoactividad']))):

                        data.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1

            if int(busqueda[0]['id_conformidad']) != 0:
                        
                large = len(data)  
                inc = 0
                while inc < large:
                
                    if (data[inc]['id_no_conformidad'] != int((busqueda[0]['id_conformidad']))):

                        data.pop(inc)

                        inc = inc
                        large -= 1
                    else:
                        inc += 1


    except Exception as e:
        data['error'] = e
    return JsonResponse(data, safe=False)
    
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


 

