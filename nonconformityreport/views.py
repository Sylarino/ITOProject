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

#VISTA PARA VER LA VENTANA DE REGISTRO DE NO CONFORMIDAD
def registernonconformityreport(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    users = User.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'nonconformityreport/registernonconformities.html',
        {
            'title':'Modificar Reporte de No Conformidad',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'disciplines': disciplines,
            'wbs': wbs,
            'users': users
        })

#VISTA PARA VER LA VENTANA DE REGISTRO DE NO CONFORMIDAD
def modifiednonconformityreport(request, id):

    report = NonConformityReport.objects.get(pk=int(id)) 
    report_img = NonConformityReportImage.objects.filter(report_id=int(id)) 

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'nonconformityreport/nonconformity.html',
        {
            'title':'Modificacion de Reporte de No Conformidad',
            'year': datetime.now().year,
            'report': report,
            'imgs': report_img
        })

#VISTA PARA VER LA VENTANA DE BÚSQUEDA DE NO CONFORMIDAD
def searchnonconformity(request):

    apis = API.objects.all()
    contracts = Contract.objects.all()
    disciplines = Discipline.objects.all()
    wbs = WBS.objects.all()
    users = User.objects.all()

    assert isinstance(request, HttpRequest)
    return render(
        request,
        'nonconformityreport/searchnonconformity.html',
        {
            'title':'Busqueda de Reportes de No Conformidad',
            'year': datetime.now().year,
            'apis': apis,
            'contracts': contracts,
            'disciplines': disciplines,
            'wbs': wbs,
            'users': users
        })

#GUARDAR REPORTE DE NO CONFORMIDAD
@csrf_exempt
@login_required(login_url="login")
def savenonconformityreport(request, *args, **kwargs):

    if request.method == "POST":

        rep = request.POST.getlist('reporte[]')
        data = {}

        reportdata = json.loads(rep[0])

        wbs_non = WBS.objects.get(pk=int(reportdata['area_non']))
        contract_non = Contract.objects.get(pk=int(reportdata['id_contrato']))
        api_non = API.objects.get(pk=int(reportdata['id_api']))
        discipline_non = Discipline.objects.get(pk=int(reportdata['discipline']))
        register_non = User.objects.get(pk=int(reportdata['register_by']))

        nonconformity_report = NonConformityReport(
                num_audit = int(reportdata['audit']),
                item = int(reportdata['item_non']),
                correlative = int(reportdata['correlative']),
                creation_date = reportdata['created_at'],
                criticality = int(reportdata['critical']),
                sistem = reportdata['sistem'],
                subsistem = reportdata['subsistem'],
                origin = reportdata['origin'],
                clasification = reportdata['clasification'], 
                infringement_requirement = reportdata['requirement'], 
                details = reportdata['description'],
                observations = reportdata['observation'],
                reference_documents = reportdata['reference_standar'], 
                ncr_standar = reportdata['specific_standar'],
                num_transmital_ncr = int(reportdata['num_envio']),
                num_transmital_action = int(reportdata['num_accion']),
                num_ncr = int(reportdata['num_ncr']),
                status = reportdata['status'],
                stipulated_date = reportdata['stipulated_date'],
                real_close_date = reportdata['close_date'],
                wbs = wbs_non,
                contract = contract_non, 
                api = api_non,
                discipline = discipline_non, 
                register_by = register_non
            )

        nonconformity_report.save()

        id_rep_noncon = nonconformity_report.id

        if len(request.FILES.getlist('images')) > 0:

            imagenes = request.FILES.getlist('images')
            id_rep_noncon = nonconformity_report.id

            for img in imagenes:

                wrr = NonConformityImage(
                        image = img
                    )

                wrr.save()

                wrrf = NonConformityReportImage(
                        report = nonconformity_report,
                        image = wrr 
                        )

                wrrf.save()


        if id_rep_noncon > 0:
                    
            data = {
                'submit': 'success',
                'id': id_rep_noncon
                }

            createpdfnonconformity(id_rep_noncon)

        else:

            data = {
                'submit': 'failed'
                }

        return JsonResponse(data)

#FUNCIÓN PARA AGREGAR UN PARRAFO O TEXTO CENTRADO EN EL PDF
def setParagraph(height_pdf, text, style, c):
    width, height = portrait(letter) 

    height_pdf -= 25
    info = Paragraph(text, style)  
    info.wrapOn(c, width, height)
    w, h = info.wrap(600, 50)
    height_pdf -= h
    info.drawOn(c, 15, height_pdf, 0)

    return height_pdf

#SEPARADOR DEL PDF
def separator(c, height_pdf):

    url_img = settings.STATIC_ROOT + "/app/img/report_banners/bannercaminata/separador.png" 
    im_banner = Image(url_img, width=600, height=16)
    im_banner.drawOn(c, 4, height_pdf)
    height_pdf -= 20
    
    return height_pdf

#FUNCIÓN PARA AGREGAR LA CABEZERA DE CADA PÁGINA DEL PDF
def principalBanner(height_pdf, c, id_rep, pagina, next_page, type_report):

    width, height = portrait(letter) 
    archivo_imagen = settings.STATIC_ROOT +'/app/img/logo.jpg'
    im_banner = Image(archivo_imagen, width=76, height=50)
    im_banner.drawOn(c, 15, 735)

    pagina += 1
    c.setFont('Helvetica', 8)
    c.drawString(300, 20,"Página " + str(pagina))

    height_pdf = height

    if type_report == 'nonconformity':
        type_banner = 'bannernoconformidad/bannernoconformidad.png'

    if type_report == 'iscreport':
        type_banner = 'banneriscreport/banneriscreport.png'

    url_img = settings.STATIC_ROOT + "/app/img/report_banners/" + type_banner 
    im_banner = Image(url_img, width=600, height=47)
    im_banner.drawOn(c, 5, 680)
    height_pdf -= 115
    c.setFont('Helvetica', 18)
    title_report = stringWidth("REPORTE N°"+str(id_rep), 'Helvetica', 18)

    c.drawString((width/2)-(title_report/2), 740,"REPORTE N°"+str(id_rep))
    print(next_page)

    if next_page == 0:
        return height_pdf, pagina
    else:
        return height_pdf, next_page, pagina


#FUNCIÓN PARA CREAR EL PDF DE REPORTE DE NO CONFORMIDAD
def createpdfnonconformity(id_rep):

    reporte_noncon =  NonConformityReport.objects.get(pk=id_rep)
    reporte_imagen = NonConformityReportImage.objects.filter(report_id=id_rep)
    
    #Configuración de Response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment;filename=REPORTE N°'+ str(id_rep)+'.pdf'

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
    height_pdf, pagina = principalBanner(height_pdf, c, id_rep,pagina,0, 'nonconformity')

    #ANTECEDENTES GENERALES
    c.setFont('Helvetica', 14)
    title_report = stringWidth("ANTECEDENTES GENERALES", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), 670,"ANTECEDENTES GENERALES")

    c.setFont('Helvetica', 8)
    c.drawString(25, 650,"N° Contrato: " + str(reporte_noncon.contract.contract_number))
    c.drawString(25, 635,"Proyecto: " + reporte_noncon.contract.contract_name)
    c.drawString(25, 620,"Empresa Responsable: " + reporte_noncon.contract.enterprise)
    c.drawString(25, 605,"Área: " + reporte_noncon.wbs.wbs_name)
    c.drawString(25, 590,"Sistema: " + reporte_noncon.sistem)
    c.drawString(25, 575,"Subsistema: " + reporte_noncon.subsistem)

    c.drawString(396, 650,"N° Auditoría: " + str(reporte_noncon.num_audit))
    c.drawString(396, 635,"Correlativo: " + str(reporte_noncon.correlative))
    c.drawString(396, 620,"Disciplina: " + reporte_noncon.discipline.discipline_name)
    c.drawString(396, 605,"Item: " + str(reporte_noncon.item))
    c.drawString(396, 590,"Fecha de Creación: " + str(reporte_noncon.creation_date.day) + "/"
                             + str(reporte_noncon.creation_date.month) + "/"
                             + str(reporte_noncon.creation_date.year))
    c.drawString(396, 575,"Tag: " + str(reporte_noncon.tag))

    ##Separador
    height_pdf -= 140
    height_pdf = separator(c, height_pdf)

    #DETALLE NO CONFORMIDAD
    c.setFont('Helvetica', 14)
    title_report = stringWidth("DETALLE NO CONFORMIDAD", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), height_pdf,"DETALLE NO CONFORMIDAD")
    
    height_pdf -= 25
    c.setFont('Helvetica', 8)
    c.drawString(25, height_pdf,"Criticidad de No Conformidad: " + str(reporte_noncon.criticality))
    c.drawString(280, height_pdf,"Origen: " + reporte_noncon.origin)
    c.drawString(475, height_pdf,"Clasificación: " + reporte_noncon.clasification)

    height_pdf -= 10

    height_pdf = setParagraph(height_pdf,
                              "<b>Criterio / Documentos de Referencia (E.T, Planos, Normas, etc.)</b>",
                              styleN,
                              c)
    height_pdf = setParagraph(
        height_pdf, reporte_noncon.reference_documents, styleN, c
        )

    height_pdf = setParagraph(height_pdf,
                              "<b>Requisito Incumplido (Punto Especifico de la norma, EE.TT, o documento aplicable.)</b>",
                              styleN,
                              c)

    height_pdf = setParagraph(
        height_pdf, reporte_noncon.infringement_requirement, styleN, c
        )

    height_pdf = setParagraph(height_pdf,
                              "<b>Descripción detallada de la No Conformidad.</b>", 
                              styleN,
                              c)
    height_pdf = setParagraph(
        height_pdf, reporte_noncon.details, styleN, c
        )

    height_pdf = setParagraph(height_pdf,
                              "<b>Observaciones</b>",
                              styleN,
                              c)

    height_pdf = setParagraph(
        height_pdf, reporte_noncon.observations, styleN, c
        )

    next_page = 0

    if height_pdf < 100:

        next_page = 1

    if next_page == 1:

        c.showPage()
        height_pdf, next_page, pagina = principalBanner(height_pdf, c,id_rep,pagina,next_page, 'nonconformity')

    #DETALLE ORIGEN Y SEGUIMIENTO
    height_pdf -= 30
    height_pdf = separator(c, height_pdf)

    c.setFont('Helvetica', 14)
    title_report = stringWidth("DETALLE ORIGEN Y SEGUIMIENTO", 'Helvetica', 14)
    c.drawString((width/2)-(title_report/2), height_pdf,"DETALLE ORIGEN Y SEGUIMIENTO")
    height_pdf -= 20

    c.setFont('Helvetica', 8)
    c.drawString(25, height_pdf,"Originador: " + reporte_noncon.register_by.first_name + " " + reporte_noncon.register_by.last_name)
    c.drawString(396, height_pdf,"Criterio Especifico de NCR: " + reporte_noncon.ncr_standar)    
    height_pdf -= 15
    c.drawString(25, height_pdf,"N° Trnsmital Envío NCR: " + str(reporte_noncon.num_transmital_ncr))
    c.drawString(396, height_pdf,"N° Transmital Envío Acción Correctiva: " + str(reporte_noncon.num_transmital_action))    
    height_pdf -= 15
    c.drawString(25, height_pdf,"N° NCR Emitida: " + str(reporte_noncon.num_ncr))
    c.drawString(396, height_pdf,"Estatus: " + reporte_noncon.status)    
    height_pdf -= 15    
    c.drawString(25, height_pdf,"Fecha de Compromiso de Cierre: " + str(reporte_noncon.stipulated_date.day) + "/"
                             + str(reporte_noncon.stipulated_date.month) + "/"
                             + str(reporte_noncon.stipulated_date.year))     
    c.drawString(396, height_pdf,"Fecha de Cierre: " + str(reporte_noncon.real_close_date.day) + "/"
                             + str(reporte_noncon.real_close_date.month) + "/"
                             + str(reporte_noncon.real_close_date.year))

    #RESPALDO FOTOGRAFICO

    if next_page == 0:

        c.showPage()
        height_pdf, pagina = principalBanner(height_pdf, c, id_rep,pagina, next_page, 'nonconformity')

        c.setFont('Helvetica', 14)
        title_report = stringWidth("REGISTROS FOTOGRÁFICOS", 'Helvetica', 14)
        c.drawString((width/2)-(title_report/2), 670,"REGISTROS FOTOGRÁFICOS")
        height_pdf -= 200

    img_len = len(reporte_imagen)
    inc_img = 0
    img_space = 40
    inc_page = 0
        
    if img_len == 0:

        url_img = settings.STATIC_ROOT + "/app/img/report_banners/noimage.png" 
        im_banner = Image(url_img, width=100, height=100)
        im_banner.drawOn(c, (width/2)-50, height_pdf + 60)

        c.setFont('Helvetica', 15)
        width_text = stringWidth("No se registro imágenes", 'Helvetica', 15)
        c.drawString((width/2)-(width_text/2), height_pdf + 40, "No se registro imágenes")

    for img in reporte_imagen:

        if inc_img > 2:

            inc_img = 0
            height_pdf -= 310
            img_space = 40
            
            if inc_page > 5:

                height_pdf = height
                height_pdf -= 115

                c.showPage()
                height_pdf, pagina = principalBanner(height_pdf, c, id_rep,pagina,next_page, 'nonconformity')

                title_report = stringWidth("REGISTROS FOTOGRÁFICOS", 'Helvetica', 14)
                c.drawString((width/2)-(title_report/2), 670,"REGISTROS FOTOGRÁFICOS")
                height_pdf -= 200

                inc_page = 0

        url_img = settings.MEDIA_ROOT + "/" + img.image.image.name

        im = Image(url_img, width=150, height=150, hAlign='CENTER')
        im.drawOn(c, img_space, height_pdf)

        inc_img += 1
        img_space += 170
        inc_page += 1

    c.save()

    buffer.seek(0)
    pdf: bytes = buffer.getvalue()

    response.write(pdf)
    file_data = ContentFile(pdf)

    reportpdf = NonConformityPDF()
    reportpdf.upload.save('REPORTE NO CON-N°'+ str(id_rep)+'.pdf', file_data, save=False)
    reportpdf.save()

    pdfrelation = NonConformityReportPDF(
        pdf = reportpdf,
        noncon_report = reporte_noncon
        )

    pdfrelation.save()

#DESCARGA DE PDF AL REGISTRAR UN REPORTE DE NO CONFORMIDAD
@csrf_exempt
@login_required(login_url="login")
def downloadpdfnoncon(request, typereport = 'None', rep_id = 'None'):

    if request.method == 'GET':
        rep_id = int(rep_id)
        
    if request.method == 'POST':
        rep_id = request.POST['id']
        typereport = request.POST['typereport']

    if typereport == 'nonconformity':
        file_path = settings.MEDIA_ROOT + "/pdf_nonconformity_reports/REPORTE_NO_CON-N" +  str(rep_id) + ".pdf"
        
    if typereport == 'iscreport':
        file_path = settings.MEDIA_ROOT + "/pdf_isc_list/REPORTE_ISC_N"+ str(rep_id)+".pdf"

    if typereport == 'walkreport':
        file_path = settings.MEDIA_ROOT + "/pdf_walk_reports/REPORTE_N"+ str(rep_id)+".pdf"

    if os.path.exists(file_path):

        with open(file_path, 'rb') as fh:

            response = HttpResponse(fh.read(), content_type="application/pdf")
            response['Content-Disposition'] = 'attachment;filename=' + os.path.basename(file_path)
            buffer = io.BytesIO()

            buffer.seek(0)
            pdf: bytes = buffer.getvalue()

            response.write(pdf)
            file_data = ContentFile(pdf)

            return response

    raise Http404

#Función para comparar datos y eliminar en las búsquedas de reportes
def compareData(name_py, name_js, search, busqueda):

    if int(busqueda[0][name_js]) != 0:
                        
        large = len(search)  
        inc = 0
        while inc < large:
                
            if (search[inc][name_py] != int(busqueda[0][name_js])):

                search.pop(inc)
                inc = inc
                large -= 1

            else:
                inc += 1   

    return search

#FUNCIÓN DE BUSQUEDA DE NO CONFORMIDAD
@csrf_exempt
@login_required(login_url="login")
def searchnonconformityingrid(request):

    try:

        if request.method == 'GET':

            search = []

            listar = request.GET.getlist('listar[]')
            busqueda = json.loads(listar[0])

            noncon_rep = NonConformityReport.objects.filter(api_id=int(busqueda[0]['id_api']))

            for report in noncon_rep:

                search.append({
                    'id_reporte': report.id,
                    'sistema': report.sistem,
                    'subsistema': report.subsistem,
                    'area_id': report.wbs_id,
                    'area': report.wbs.wbs_name,
                    'contrato_id': report.contract_id,
                    'api_id': report.api_id,
                    'historico_fecha': report.creation_date,
                    'fecha_compromiso': report.stipulated_date,
                    'fecha_compromiso_real': report.real_close_date,
                    'disciplina': report.discipline.discipline_name,
                    'disciplina_id': report.discipline_id,
                    'originador': report.register_by.first_name + " " + report.register_by.last_name,
                    'originador_id': report.register_by_id,
                    'num_audit': report.num_audit                       
                    })

            search = compareData('api_id', 'id_api', search, busqueda)
            search = compareData('contrato_id', 'id_contrato', search, busqueda)
            search = compareData('originador_id', 'id_autor', search, busqueda)
            search = compareData('disciplina_id', 'id_disciplina', search, busqueda)
            search = compareData('area_id', 'id_area', search, busqueda)

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

# GUARDAR MODIFICACIÓN DE REPORTE
@csrf_exempt
@login_required(login_url="login")
def savemodifiednonconformity(request):

    if request.method == "POST":

        id_rep = request.POST.get('id_reporte')
        close_date = request.POST.get('real_close_date')
        new_imgs = request.FILES.getlist('files')

        rep_noncon = NonConformityReport.objects.get(pk=int(id_rep))

        if rep_noncon.real_close_date  != datetime.strptime(close_date, "%Y-%m-%d"):

            rep_noncon.real_close_date = datetime.strptime(close_date, "%Y-%m-%d")
            rep_noncon.save()

        for img in new_imgs:

            new_image = NonConformityImage(
                    image = img
                )
            new_image.save()

            new_rep_img = NonConformityReportImage(
                    image = new_image,
                    report = rep_noncon
                )
            new_rep_img.save()

        if int(id_rep) > 0:
                    
            data = {
                'submitted': 1,
                'id_reporte': int(id_rep)
                }

            #createwalkpdf(int(rep_noncon.id))

        else:

            data = {
                'submitted': 0
                }

        return JsonResponse(data)