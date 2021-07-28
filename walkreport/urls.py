from django.urls import path
from . import views

urlpatterns = [
        path('registerwalkreport/', views.registerwalkreport, name='registerwalkreport'),
        path('searchwalkreport/', views.searchwalkreport, name='searchwalkreport'),
        path('searchwbs/', views.searchwbs, name='searchwbs'),
        path('registerwalkreport/savewalkreport/', views.savewalkreport, name='savewalkreport'),
        path('registerwalkreport/savefiles/', views.savewalkreport, name='savefiles'),
        path('registerwalkreport/createwalkpdf/', views.createwalkpdf, name='createwalkpdf'),
        path('searchwalks/', views.searchwalks, name='searchwalks'),
        path('searchwalkreport/modifiedwalkreport/<str:id>', views.modifiedwalkreport, name='modifiedwalkreport'),
        path('registerwalkreport/registeruser/', views.registeruser, name='registeruser'),
        path('registerwalkreport/registernewuser/', views.registernewuser, name='registernewuser'),
        path('registerwalkreport/downloadwalkpdf/', views.downloadwalkpdf, name='downloadwalkpdf'),
        path('searchwalkreport/savemodifiedwalkreport/', views.savemodifiedwalkreport, name='savemodifiedwalkreport'),
    ]
