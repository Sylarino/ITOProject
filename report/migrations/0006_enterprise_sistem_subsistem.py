# Generated by Django 2.2.24 on 2021-10-20 14:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0005_auto_20210719_1138'),
    ]

    operations = [
        migrations.CreateModel(
            name='Enterprise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enterprise_name', models.CharField(max_length=500, verbose_name='Empresa Contratista')),
                ('enterprise_rut', models.CharField(max_length=16, verbose_name='RUT de Empresa')),
            ],
            options={
                'verbose_name': 'Empresa contratista',
                'verbose_name_plural': 'Empresas contratistas',
            },
        ),
        migrations.CreateModel(
            name='Sistem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sistem_name', models.CharField(max_length=500, verbose_name='Sistema')),
            ],
            options={
                'verbose_name': 'Sistema',
                'verbose_name_plural': 'Sistemas',
            },
        ),
        migrations.CreateModel(
            name='Subsistem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subsistem_name', models.CharField(max_length=500, verbose_name='Sub Sistema')),
                ('sistem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='report.Sistem', verbose_name='Sistema')),
            ],
            options={
                'verbose_name': 'Subsistema',
                'verbose_name_plural': 'Subsistemas',
            },
        ),
    ]