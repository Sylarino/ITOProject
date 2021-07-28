from django.urls import path
from . import views

urlpatterns = [
        path('registernonconformityreport/', views.registernonconformityreport, name='registernonconformityreport'),
]
