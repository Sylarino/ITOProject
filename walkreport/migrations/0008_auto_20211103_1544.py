# Generated by Django 2.2.24 on 2021-11-03 18:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('walkreport', '0007_auto_20211103_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='walkreport',
            name='sistem_subsistem',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='report.SistemSubSistem', verbose_name='Sistema'),
        ),
    ]