# Generated by Django 4.2.7 on 2023-12-09 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_token_token_token_id_token_last_usage_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='token',
            name='access_token',
            field=models.CharField(default=1, max_length=255, unique=True),
            preserve_default=False,
        ),
    ]
