from django.urls import path
from . import views

urlpatterns = [
        path('registeriscreport/', views.registeriscreport, name='registeriscreport'),
        path('addqualityrequirement/', views.addqualityrequirement, name='addqualityrequirement'),
        path('addqualityrequirement/searchrequirements/<str:id>', views.searchrequirements, name='searchrequirements'),
        path('addqualityrequirement/saverequirements/', views.saverequirements, name='saverequirements'),
        path('searchcontractsrequire/', views.searchcontractsrequire, name='searchcontractsrequire'),
        path('registeriscreport/saveregisteriscreport/', views.saveregisteriscreport, name='saveregisteriscreport'),
]

