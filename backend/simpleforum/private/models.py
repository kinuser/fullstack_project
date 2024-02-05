from django.db import models

from users.models import User


class PrivateThread(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user2")
    counter = models.IntegerField(default=1)
    created_time = models.DateTimeField(auto_now_add=True)
    last_message = models.OneToOneField("PrivateMessage", on_delete=models.CASCADE, blank=True, null=True,
                                        related_name="last_message")


class PrivateMessage(models.Model):
    text = models.TextField(max_length=6000)
    thread = models.ForeignKey(PrivateThread, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.message.owner.id, filename)


class PrivateMessageFile(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    message = models.ForeignKey(PrivateMessage, on_delete=models.CASCADE, related_name='file')


# Create your models here.
