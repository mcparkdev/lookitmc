# Generated by Django 3.0.7 on 2020-06-29 01:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0013_auto_20200628_1846'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='input',
            name='items',
        ),
    ]
