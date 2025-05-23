# Generated by Django 5.2.1 on 2025-05-15 18:52

import user.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_pic',
            field=models.ImageField(blank=True, default='', null=True, upload_to=user.models.custom_filename),
        ),
        migrations.AlterField(
            model_name='user',
            name='role_id',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('NORMAL', 'Normal')], default='NORMAL', max_length=20),
        ),
    ]
