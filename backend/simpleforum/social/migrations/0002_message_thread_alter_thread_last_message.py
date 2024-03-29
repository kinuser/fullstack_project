# Generated by Django 4.2.7 on 2023-12-12 13:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='thread',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='social.thread'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='thread',
            name='last_message',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='last_message', to='social.message'),
        ),
    ]
