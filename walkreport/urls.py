from django.urls import path
from . import views

urlpatterns = [
        path('registerwalkreport/', views.registerwalkreport, name='registerwalkreport'),
        path('searchwalkreport/', views.searchwalkreport, name='searchwalkreport'),
    ]
