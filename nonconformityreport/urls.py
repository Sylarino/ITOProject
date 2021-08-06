from django.urls import path
from . import views

urlpatterns = [
        path('registernonconformityreport/', views.registernonconformityreport, name='registernonconformityreport'),
        path('searchnonconformity/', views.searchnonconformity, name='searchnonconformity'),
        path('registernonconformityreport/savenonconformityreport/', views.savenonconformityreport, name='savenonconformityreport'),
        path('registernonconformityreport/saveimages/', views.savenonconformityreport, name='savenonconformityreport'),
        path('createpdfnonconformity/', views.createpdfnonconformity, name='createpdfnonconformity'),
        path('registernonconformityreport/downloadpdfnoncon/', views.downloadpdfnoncon, name='downloadpdfnoncon'),
        path('searchnonconformity/downloadpdfnoncon/<str:rep_id>', views.downloadpdfnoncon, name='downloadpdfnoncon'),
        path('searchnonconformity/modifiednonconformityreport/<str:id>', views.modifiednonconformityreport, name='modifiednonconformityreport'),
        path('searchnonconformity/savemodifiednonconformity/', views.savemodifiednonconformity, name='savemodifiednonconformity'),
        path('searchnonconformityingrid/', views.searchnonconformityingrid, name='searchnonconformityingrid'),
]

