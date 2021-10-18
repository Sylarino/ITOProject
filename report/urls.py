from django.urls import path
from . import views

urlpatterns = [
    path('generatereport/', views.createreport, name='generatereport'),
    path('loadfiles/', views.loadfiles, name='loadfiles'),
    path('searchactivities/', views.searchactivities, name='searchactivities'),
    path('buscarcontratos/', views.buscarcontratos, name='buscarcontratos'),
    path('buscarsubactividades/', views.buscarsubactividades, name='buscarsubactividades'),
    path('generatereport/savereport/', views.savereport, name='savereport'),
    path('generatereport/saveimage/', views.savereport, name='saveimage'),
    path('busquedaactividades/', views.busquedaactividades, name='busquedaactividades'),
    path('searchactivities/downloadexcelsearch/<str:id>', views.downloadexcelsearch, name='downloadexcelsearch'),
    path('createpdf/', views.create_pdf, name='createpdf'),
    path('loadfiles/readexcel/', views.readexcel, name='readexcel'),
    path('searchactivities/deletehistoric/', views.deletehistoric, name='deletehistoric'),
    path('loadfiles/submitdata/', views.submitdata, name='submitdata'),
    path('loadfiles/submitdata/', views.submitdata, name='submitdata'),
    path('downloadstructure/<str:id>', views.downloadstructure, name='downloadstructure'),
    path('generatereport/downloadpdf/', views.downloadpdf, name='downloadpdf'),
    path('searchactivities/modifiedreport/<str:id>', views.modifiedreport, name='modifiedreport'),
    path('modifiedreport/modifiedactualreport/', views.modifiedactualreport, name='modifiedactualreport'),
    path('modifiedreport/savemodifiedimage/', views.modifiedactualreport, name='savemodifiedimage'),
    ]