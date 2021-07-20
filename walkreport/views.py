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


# Create your views here.

def registerwalkreport(request):
    
    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    priorities = Priority.objects.all()
    users = User.objects.all()

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
            'users': users 
        })

def searchwalkreport(request):
    
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/searchwalkreport.html',
        {
            'title':'Busqueda de Observacion de Caminata',
            'year': datetime.now().year,
        })

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

                #Revisar fechas
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

                    print("holas")
                    #create_pdf(rp_id)

            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)}

        if len(request.FILES.getlist('files')) > 0:

            files_report = request.FILES.getlist('files')
            report_for_id = WalkReport.objects.last()
            id_rep_walk = 0

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

            else:

                data = {
                    'submitted': 0
                    }

            return JsonResponse(data)

