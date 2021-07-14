from django.shortcuts import render
from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from walkreport.models import *
from django.views.generic import TemplateView
# Create your views here.

def registerwalkreport(request):
    
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'walkreport/registerwalkreport.html',
        {
            'title':'Registro de Observacion de Caminata',
            'year': datetime.now().year,
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
