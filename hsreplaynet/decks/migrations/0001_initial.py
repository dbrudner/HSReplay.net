# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-08 17:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_intenum
import hearthstone.enums


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cards', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Archetype',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=250)),
                ('player_class', django_intenum.IntEnumField(choices=[(0, 'INVALID'), (1, 'DEATHKNIGHT'), (2, 'DRUID'), (3, 'HUNTER'), (4, 'MAGE'), (5, 'PALADIN'), (6, 'PRIEST'), (7, 'ROGUE'), (8, 'SHAMAN'), (9, 'WARLOCK'), (10, 'WARRIOR'), (11, 'DREAM'), (12, 'NEUTRAL')], default=0, validators=[django_intenum.IntEnumValidator(hearthstone.enums.CardClass)])),
            ],
            options={
                'db_table': 'cards_archetype',
            },
        ),
        migrations.CreateModel(
            name='Deck',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('digest', models.CharField(max_length=32, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True, null=True)),
                ('size', models.IntegerField(null=True)),
                ('archetype', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='decks.Archetype')),
            ],
            options={
                'db_table': 'cards_deck',
            },
        ),
        migrations.CreateModel(
            name='Include',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('count', models.IntegerField(default=1)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='included_in', to='cards.Card')),
                ('deck', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='includes', to='decks.Deck')),
            ],
            options={
                'db_table': 'cards_include',
            },
        ),
        migrations.CreateModel(
            name='Signature',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('format', django_intenum.IntEnumField(choices=[(0, 'FT_UNKNOWN'), (1, 'FT_WILD'), (2, 'FT_STANDARD')], default=2, validators=[django_intenum.IntEnumValidator(hearthstone.enums.FormatType)])),
                ('as_of', models.DateTimeField()),
                ('archetype', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='decks.Archetype')),
            ],
        ),
        migrations.CreateModel(
            name='SignatureComponent',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('weight', models.FloatField(default=0.0)),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='signature_components', to='cards.Card')),
                ('signature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='components', to='decks.Signature')),
            ],
        ),
        migrations.AddField(
            model_name='deck',
            name='cards',
            field=models.ManyToManyField(through='decks.Include', to='cards.Card'),
        ),
        migrations.AlterUniqueTogether(
            name='include',
            unique_together=set([('deck', 'card')]),
        ),
    ]
