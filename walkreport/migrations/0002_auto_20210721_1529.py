# Generated by Django 2.2.24 on 2021-07-21 19:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('walkreport', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PDFWalkReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upload', models.FileField(default='null', upload_to='pdf_reports', verbose_name='PDF')),
                ('pdf_register', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro de PDF')),
            ],
            options={
                'verbose_name': 'PDF Acta de Observaciones en Caminata',
                'verbose_name_plural': 'Archivos PDF Acta de Observaciones en Caminata',
            },
        ),
        migrations.AlterField(
            model_name='evidencefile',
            name='upload',
            field=models.FileField(default='null', upload_to='files_walk_report', verbose_name='Acta Escaneado de Caminata'),
        ),
        migrations.CreateModel(
            name='WalkReportPDFFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspection_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro de PDF')),
                ('pdf', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='walkreport.PDFWalkReport', verbose_name='PDF de Acta de Caminata')),
                ('walk_report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='walkreport.WalkReport', verbose_name='Reporte de Caminata')),
            ],
            options={
                'verbose_name': 'Repertorio de PDF de Acta',
                'verbose_name_plural': 'Repertorios de Archivos PDF Actas de Caminata',
            },
        ),
    ]
