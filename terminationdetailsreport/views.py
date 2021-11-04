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

# Create your views here.

def searchterminationdetails(request):

    apis = API.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    priorities = Priority.objects.all()
    users = User.objects.all()
    enterprise = Enterprise.objects.all()
    sistem = Sistem.objects.all()
    subsistem = Subsistem.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'terminationdetailsreport/searchterminationdetail.html',
        {
            'title':'Reporte de Detalles de Terminacion',
            'year': datetime.now().year,
            'apis': apis,
            'disciplines': disciplines,
            'wbs': wbs,
            'priorities': priorities,
            'users': users,
            'enterprise': enterprise,
            'sistem': sistem,
            'subsistem': subsistem
        })

