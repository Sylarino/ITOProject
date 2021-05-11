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
]