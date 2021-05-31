# Generated by Django 2.2.19 on 2021-05-24 16:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_name', models.CharField(max_length=100, verbose_name='Nombre Actividad')),
                ('start_date', models.DateField(verbose_name='Comienza el')),
                ('finish_date', models.DateField(verbose_name='Finaliza el')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Actividad',
                'verbose_name_plural': 'Actividades',
            },
        ),
        migrations.CreateModel(
            name='ActivityType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type_name', models.CharField(max_length=200, verbose_name='Nombre del Tipo de Actividad')),
            ],
            options={
                'verbose_name': 'Tipo de Actividad',
                'verbose_name_plural': 'Tipo de Actividades',
            },
        ),
        migrations.CreateModel(
            name='API',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_number', models.CharField(max_length=100, verbose_name='Número de API')),
                ('project_name', models.CharField(max_length=100, verbose_name='Nombre de Proyecto')),
                ('start_date', models.DateField(verbose_name='Comienza el')),
                ('finish_date', models.DateField(verbose_name='Finaliza el')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'API',
                'verbose_name_plural': 'API',
            },
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract_name', models.CharField(max_length=100, verbose_name='Nombre del Contrato')),
                ('contract_number', models.IntegerField(verbose_name='Número de Contrato')),
                ('enterprise', models.CharField(max_length=150, verbose_name='Empresa Contratista')),
                ('rut', models.CharField(max_length=12, verbose_name='RUT')),
                ('project_boss', models.CharField(max_length=12, verbose_name='Jefe de Proyecto')),
                ('email', models.CharField(max_length=12, verbose_name='Correo')),
                ('cellphone', models.CharField(max_length=12, verbose_name='Celular')),
                ('start_date', models.DateField(verbose_name='Comienza el')),
                ('finish_date', models.DateField(verbose_name='Finaliza el')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
                ('api', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.API', verbose_name='API')),
            ],
            options={
                'verbose_name': 'Contrato',
                'verbose_name_plural': 'Contratos',
            },
        ),
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('equipment_name', models.CharField(max_length=200, verbose_name='Nombre Equipo')),
            ],
            options={
                'verbose_name': 'Equipo',
                'verbose_name_plural': 'Equipos',
            },
        ),
        migrations.CreateModel(
            name='Following',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('following_name', models.CharField(max_length=100, verbose_name='¿Seguimiento?')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Seguimiento',
                'verbose_name_plural': 'Seguimientos',
            },
        ),
        migrations.CreateModel(
            name='HistoricalReference',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=500, verbose_name='Prerequisito')),
            ],
            options={
                'verbose_name': 'Referencia Historica',
                'verbose_name_plural': 'Referencias Historicas',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(max_length=100, verbose_name='URL de la imagén')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creado el')),
                ('description', models.CharField(max_length=100, verbose_name='Descripción')),
                ('image', models.ImageField(default='null', upload_to='evidences', verbose_name='Miniatura')),
            ],
            options={
                'verbose_name': 'Imagen',
                'verbose_name_plural': 'Imagenes',
            },
        ),
        migrations.CreateModel(
            name='Measure',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('measure_name', models.CharField(max_length=100, verbose_name='Medida')),
            ],
            options={
                'verbose_name': 'Medida',
                'verbose_name_plural': 'Medidas',
            },
        ),
        migrations.CreateModel(
            name='NonConformity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nonconformity_name', models.CharField(max_length=100, verbose_name='¿Conformidad?')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'No Conformidad',
                'verbose_name_plural': 'No Conformidades',
            },
        ),
        migrations.CreateModel(
            name='PDFFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upload', models.FileField(default='null', upload_to='pdf_reports', verbose_name='PDF')),
                ('pdf_register', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro de PDF')),
            ],
            options={
                'verbose_name': 'PDF',
                'verbose_name_plural': 'Archivos PDF',
            },
        ),
        migrations.CreateModel(
            name='Precondition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('precondition_name', models.CharField(max_length=100, verbose_name='Prerequisito')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Prerrequisito',
                'verbose_name_plural': 'Prerrequisitos',
            },
        ),
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reference_name', models.CharField(max_length=100, verbose_name='Referencia')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Referencia',
                'verbose_name_plural': 'Referencias',
            },
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deviation_detected', models.TextField(blank=True, default='', verbose_name='Desviación detectada')),
                ('action_plan', models.TextField(blank=True, default='', verbose_name='Plan de Acción')),
                ('evidence_obs', models.TextField(blank=True, default='', verbose_name='Observación de Fotografías')),
                ('inspection_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Inspección')),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Following', verbose_name='Seguimiento')),
            ],
            options={
                'verbose_name': 'Reporte',
                'verbose_name_plural': 'Reportes',
            },
        ),
        migrations.CreateModel(
            name='Specialty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('specialty_name', models.CharField(max_length=100, verbose_name='Especialidad')),
                ('state', models.CharField(max_length=1, verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Especialidad',
                'verbose_name_plural': 'Especialidades',
            },
        ),
        migrations.CreateModel(
            name='SubActivity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subactivity_name', models.CharField(max_length=100)),
                ('average_amount', models.DecimalField(decimal_places=3, max_digits=10, max_length=50, verbose_name='Cantidad Promedio')),
                ('average_hh', models.DecimalField(decimal_places=3, max_digits=10, max_length=50, verbose_name='Promedio HH')),
                ('start_date', models.DateField(verbose_name='Comienza el')),
                ('finish_date', models.DateField(verbose_name='Finaliza el')),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Activity', verbose_name='Actividad')),
                ('api', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.API', verbose_name='API')),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Contract', verbose_name='Contrato')),
                ('measureunit', models.ForeignKey(default='1', on_delete=django.db.models.deletion.CASCADE, to='report.Measure', verbose_name='Medida')),
            ],
            options={
                'verbose_name': 'SubActividad',
                'verbose_name_plural': 'SubActividades',
            },
        ),
        migrations.CreateModel(
            name='ReportImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Image', verbose_name='Image')),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Report', verbose_name='Reporte')),
                ('subactivity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.SubActivity', verbose_name='SubActividad')),
            ],
            options={
                'verbose_name': 'Reporte de Imagen',
                'verbose_name_plural': 'Reporte de Imagenes',
            },
        ),
        migrations.AddField(
            model_name='report',
            name='images',
            field=models.ManyToManyField(blank=True, through='report.ReportImage', to='report.Image', verbose_name='Imagenes'),
        ),
        migrations.AddField(
            model_name='report',
            name='reference',
            field=models.ManyToManyField(blank=True, through='report.HistoricalReference', to='report.Reference', verbose_name='Referencia'),
        ),
        migrations.CreateModel(
            name='PDFReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspection_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro de PDF')),
                ('pdffile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.PDFFile', verbose_name='Archivo PDF')),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Report', verbose_name='Reporte')),
            ],
            options={
                'verbose_name': 'Reporte de Archivo PDF',
                'verbose_name_plural': 'Reportes de Archivos PDF',
            },
        ),
        migrations.AddField(
            model_name='historicalreference',
            name='reference',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Reference', verbose_name='Referencia'),
        ),
        migrations.AddField(
            model_name='historicalreference',
            name='report',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Report', verbose_name='Reporte'),
        ),
        migrations.CreateModel(
            name='Historical',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspection_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Inspección')),
                ('subactivity_no_program', models.CharField(blank=True, default='', max_length=200, verbose_name='Nombre de SubActividad No Programada')),
                ('real_amount', models.DecimalField(decimal_places=3, max_digits=10, max_length=100, verbose_name='Cantidad Real')),
                ('no_program_total', models.DecimalField(blank=True, decimal_places=3, max_digits=10, max_length=100, null=True, verbose_name='Total No Programado')),
                ('no_program_refday', models.DecimalField(blank=True, decimal_places=3, max_digits=10, max_length=100, null=True, verbose_name='Referencia Diaria NO Programada')),
                ('no_program_total_acu', models.DecimalField(blank=True, decimal_places=3, max_digits=10, max_length=100, null=True, verbose_name='Total Programado No Acumulado')),
                ('activity', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='report.Activity', verbose_name='Actividad')),
                ('activitytype', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='report.ActivityType', verbose_name='Tipo de Actividad')),
                ('measure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Measure', verbose_name='Medida')),
                ('nonconformity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.NonConformity', verbose_name='No Conformidad')),
                ('precondition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Precondition', verbose_name='Pre requisito')),
                ('report', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='report.Report', verbose_name='Report')),
                ('specialty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Specialty', verbose_name='Especialidad')),
                ('subactivity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.SubActivity', verbose_name='Sub Actividad')),
                ('user', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Inspector del Informe')),
            ],
            options={
                'verbose_name': 'Historico',
                'verbose_name_plural': 'Historicos',
            },
        ),
        migrations.CreateModel(
            name='EquipmentAmount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('equipment_amount', models.IntegerField(verbose_name='Cantidad de Equipos')),
                ('direct_endowment', models.IntegerField(verbose_name='Dotación Directa')),
                ('direct_reference', models.IntegerField(verbose_name='Dotacion Referencial')),
                ('indirect_endowment', models.IntegerField(verbose_name='Dotacion Indirecta')),
                ('activity', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='report.Activity', verbose_name='Actividad')),
                ('equipment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Equipment', verbose_name='Equipo')),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Report', verbose_name='Reporte')),
            ],
            options={
                'verbose_name': 'Cantidad de Equipo',
                'verbose_name_plural': 'Cantidad de Equipos',
            },
        ),
        migrations.AddField(
            model_name='activity',
            name='api',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.API', verbose_name='API'),
        ),
        migrations.AddField(
            model_name='activity',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Contract', verbose_name='Contrato'),
        ),
        migrations.AddField(
            model_name='activity',
            name='equipment',
            field=models.ManyToManyField(through='report.EquipmentAmount', to='report.Equipment', verbose_name='Equipos'),
        ),
    ]
