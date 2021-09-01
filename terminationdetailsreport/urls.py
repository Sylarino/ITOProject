from django.urls import path
from . import views

urlpatterns = [
    path('registerterminationdetail/', views.registerterminationdetail, name='registerterminationdetail'),
    ]