"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required

def home(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'Inicio',
            'year':datetime.now().year,
        }
    )

def contact(request):
    """Renders the contact page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/contact.html',
        {
            'title':'Contacto',
            'message':'Contactanos en caso de cualquier consulta acerca de la plataforma o para notificar algúna observación.',
            'year':datetime.now().year,
        }
    )

def about(request):
    """Renders the about page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/about.html',
        {
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )

@login_required(login_url="login")
def createreport(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/generatereport.html',
        {
            'title':'Registro de Informe Diario',
            'year':datetime.now().year,
        }
    )

@login_required(login_url="login")
def searchactivities(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/searchactivities.html',
        {
            'title':'Búsqueda de Actividades y Subactividades',
            'year':datetime.now().year,
        }
    )

@login_required(login_url="login")
def loadfiles(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/loadfiles.html',
        {
            'title':'Cargar Datos',
            'year':datetime.now().year,
        }
    )
