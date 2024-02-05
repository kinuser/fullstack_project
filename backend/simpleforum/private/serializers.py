from rest_framework import serializers
from private.models import PrivateThread, PrivateMessage, PrivateMessageFile
from social.serializers import OwnerSerializer


class PostPrivateThreadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(max_length=6000)

    class Meta:
        model = PrivateThread
        fields = ['user2', 'text']


class PostPrivateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = ['text',]


class PrivateMessageFileSerizalizer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=True)

    class Meta:
        model = PrivateMessageFile
        fields = '__all__'

class GetPrivateMessageSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(many=False)
    file = PrivateMessageFileSerizalizer(many=True)

    class Meta:
        model = PrivateMessage
        fields = ['text', 'owner', 'created_time', 'id', 'file']


class GetPrivateThreadSerializer(serializers.ModelSerializer):
    last_message = GetPrivateMessageSerializer(many=False)
    user1 = OwnerSerializer(many=False)
    user2 = OwnerSerializer(many=False)
    class Meta:
        model = PrivateThread
        exclude = ['created_time', ]
