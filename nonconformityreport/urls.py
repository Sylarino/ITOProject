from django.urls import path
from . import views

urlpatterns = [
        path('registernonconformityreport/', views.registernonconformityreport, name='registernonconformityreport'),
        path('searchnonconformity/', views.searchnonconformity, name='searchnonconformity'),
        path('registernonconformityreport/savenonconformityreport/', views.savenonconformityreport, name='savenonconformityreport'),
        path('registernonconformityreport/saveimages/', views.savenonconformityreport, name='savenonconformityreport'),
]

