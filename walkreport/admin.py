from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(WBS)
admin.site.register(Discipline)
admin.site.register(Priority)
admin.site.register(EvidenceFile)
admin.site.register(WalkReport)
admin.site.register(WalkObservation)
admin.site.register(FileWalkReport)