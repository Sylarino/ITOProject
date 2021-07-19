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
