from django.urls import path
from . import views
from nonconformityreport import views as nonconformityviews

urlpatterns = [
        path('registerwalkreport/', views.registerwalkreport, name='registerwalkreport'),
        path('searchwalkreport/', views.searchwalkreport, name='searchwalkreport'),
        path('searchwbs/', views.searchwbs, name='searchwbs'),
        path('registerwalkreport/savewalkreport/', views.savewalkreport, name='savewalkreport'),
        path('registerwalkreport/savefiles/', views.savewalkreport, name='savefiles'),
        path('registerwalkreport/createwalkpdf/', views.createwalkpdf, name='createwalkpdf'),
        path('searchwalks/', views.searchwalks, name='searchwalks'),
        path('searchsubsistem/', views.searchsubsistem, name='searchsubsistem'),
        path('searchwalkreport/modifiedwalkreport/<str:id>', views.modifiedwalkreport, name='modifiedwalkreport'),
        path('registerwalkreport/registeruser/', views.registeruser, name='registeruser'),
        path('registerwalkreport/registersistem/', views.registersistem, name='registersistem'),
        path('registerwalkreport/registersubsistem/', views.registersubsistem, name="registersubsistem"),
        path('registerwalkreport/registernewsistem/', views.registernewsistem, name='registernewsistem'),
        path('registerwalkreport/registernewuser/', views.registernewuser, name='registernewuser'),
        path('registerwalkreport/downloadwalkpdf/', views.downloadwalkpdf, name='downloadwalkpdf'),
        path('searchsistems/', views.searchsistems, name='searchsistems'),
        path('searchwalkreport/downloadwalkpdf/<str:typereport>/<str:rep_id>/', nonconformityviews.downloadpdfnoncon, name='downloadwalkpdf'),
    ]
