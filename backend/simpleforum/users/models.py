"""Basic models"""
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Class representing a user"""
    image = models.ImageField(blank=True, null=True)

    def token(self):
        self.User.objects.filter(token_owner=self)


class Token(models.Model):
    refresh_token = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    device_identity = models.CharField(max_length=255, blank=True, null=True)
    last_usage = models.DateTimeField(auto_now=True)

# Create your models here.
