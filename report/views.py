from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from report.models import *

# Create your views here.

@login_required(login_url="login")
def createreport(request):

    #Objetos a mostrar
    apis = API.objects.all()
    contracts = Contract.objects.all()
    specialties = Specialty.objects.all()
    references = Reference.objects.all()
    activities = Activity.objects.all()
    subactivities = SubActivity.objects.all()

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
            'subactivities': subactivities
        })

@login_required(login_url="login")
def searchactivities(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'form-report/searchactivities.html',
        {
            'title':'Búsqueda de Actividades y Subactividades',
            'year':datetime.now().year,
        }
    )