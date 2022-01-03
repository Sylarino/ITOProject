from django.urls import path
from . import views

urlpatterns = [
    path('searchterminationdetails/', views.searchterminationdetails, name='searchterminationdetails'),
    path('searchterminationdetails/viewobservation/<str:id>', views.viewobservation, name='viewobservation'),
    ]