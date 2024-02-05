from django.db import models
from private.models import PrivateThread
from social.models import Thread
from users.models import User


class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    watched_counter = models.IntegerField(default=0)
    thread = models.ForeignKey(Thread, on_delete=models.PROTECT)


class PrivateThreadSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    watched_counter = models.IntegerField(default=0)
    thread = models.ForeignKey(PrivateThread, on_delete=models.PROTECT)