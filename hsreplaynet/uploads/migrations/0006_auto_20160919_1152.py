# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-19 11:52
from __future__ import unicode_literals

from django.db import migrations, models
import hsreplaynet.uploads.models
import hsreplaynet.utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('uploads', '0005_auto_20160904_1047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadevent',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='uploadevent',
            name='descriptor',
            field=models.FileField(blank=True, null=True, upload_to=hsreplaynet.uploads.models._generate_descriptor_path),
        ),
        migrations.AlterField(
            model_name='uploadevent',
            name='status',
            field=hsreplaynet.utils.fields.IntEnumField(choices=[(0, 'UNKNOWN'), (1, 'PROCESSING'), (2, 'SERVER_ERROR'), (3, 'PARSING_ERROR'), (4, 'SUCCESS'), (5, 'UNSUPPORTED'), (6, 'VALIDATION_ERROR'), (7, 'VALIDATING'), (8, 'UNSUPPORTED_CLIENT'), (9, 'PENDING')], default=0, validators=[hsreplaynet.utils.fields.IntEnumValidator(hsreplaynet.uploads.models.UploadEventStatus)]),
        ),
    ]
