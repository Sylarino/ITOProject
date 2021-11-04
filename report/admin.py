from django.contrib import admin
from .models import *


class HistoricalAdmin(admin.ModelAdmin):
    readonly_fields = ('user' , 'inspection_date')

    def save_model(self, request, obj, form, change):
        if not obj.user_id:
            obj.user_id = request.user.id

        obj.save()

class ImageAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)   
    
# Register your models here.
admin.site.register(Image, ImageAdmin)
admin.site.register(Following)
admin.site.register(Precondition)
admin.site.register(Reference)
admin.site.register(Specialty)
admin.site.register(Measure)
admin.site.register(NonConformity)
admin.site.register(API)
admin.site.register(Contract)
admin.site.register(Activity)
admin.site.register(SubActivity)
admin.site.register(Historical, HistoricalAdmin)
admin.site.register(HistoricalReference)
admin.site.register(ActivityType)
admin.site.register(Equipment)
admin.site.register(EquipmentAmount)
admin.site.register(Report)
admin.site.register(ReportImage)
admin.site.register(Sistem)
admin.site.register(Enterprise)
admin.site.register(Subsistem)
admin.site.register(SistemSubSistem)