from django.urls import path
from . import views

urlpatterns = [
        path('registeriscreport/', views.registeriscreport, name='registeriscreport'),
        path('addqualityrequirement/', views.addqualityrequirement, name='addqualityrequirement'),
        path('addqualityrequirement/searchrequirements/<str:id>', views.searchrequirements, name='searchrequirements'),
        path('addqualityrequirement/saverequirements/', views.saverequirements, name='saverequirements'),
        path('searchcontractsrequire/', views.searchcontractsrequire, name='searchcontractsrequire'),
        path('searchiscreport/', views.searchiscreport, name='searchiscreport'),
        path('searchiscreport/savemodifiediscreport/', views.savemodifiediscreport, name='savemodifiediscreport'),
        path('searchiscreportingrid/', views.searchiscreportingrid, name='searchiscreportingrid'),
        path('searchiscreport/modifiediscreport/<str:id>', views.modifiediscreport, name='modifiediscreport'),
        path('registeriscreport/saveregisteriscreport/', views.saveregisteriscreport, name='saveregisteriscreport'),
        path('createpdfiscreport/', views.createpdfiscreport, name='createpdfiscreport'),
]

