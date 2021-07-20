from django.urls import path
from . import views

urlpatterns = [
        path('registerwalkreport/', views.registerwalkreport, name='registerwalkreport'),
        path('searchwalkreport/', views.searchwalkreport, name='searchwalkreport'),
        path('searchwbs/', views.searchwbs, name='searchwbs'),
        path('registerwalkreport/savewalkreport/', views.savewalkreport, name='savewalkreport'),
        path('registerwalkreport/savefiles/', views.savewalkreport, name='savefiles'),
    ]
