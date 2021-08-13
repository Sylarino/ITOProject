from django.urls import path
from . import views

urlpatterns = [
        path('registeriscreport/', views.registeriscreport, name='registeriscreport'),
        path('addqualityrequirement/', views.addqualityrequirement, name='addqualityrequirement'),
]

