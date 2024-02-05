from django.db import models
from users.models import User


class Message(models.Model):
    owner = models.ForeignKey(User, on_delete=models.PROTECT)
    text = models.CharField(max_length=6000)
    created_time = models.DateTimeField(auto_now_add=True)
    thread = models.ForeignKey("Thread", on_delete=models.PROTECT)


class Thread(models.Model):
    name = models.CharField(max_length=40)
    counter = models.IntegerField(default=1)
    original_poster = models.ForeignKey(User, on_delete=models.PROTECT, related_name='op')
    created_time = models.DateTimeField(auto_now_add=True)
    last_message = models.OneToOneField(Message, on_delete=models.PROTECT, blank=True, null=True, related_name="last_message")
    listened = models.BooleanField(default=False)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.message.owner.id, filename)


class MessageFiles(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='file')





# Create your models here.
