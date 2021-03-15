from django.urls import path
from . import views

urlpatterns = [
    path('generatereport/', views.createreport, name='generatereport'),
    path('searchactivities/', views.searchactivities, name='searchactivities'),
]