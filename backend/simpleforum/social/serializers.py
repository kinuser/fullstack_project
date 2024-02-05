from rest_framework import serializers
from social.models import Thread, Message, MessageFiles
from users.models import User


class CreateThreadSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=40)
    text = serializers.CharField(max_length=6000)


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'image', 'id']

class ThreadSerializerForMessages(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ['name', 'id']


class MessageFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageFiles
        fields = '__all__'


class GetMessagesSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(many=False)
    thread = ThreadSerializerForMessages(many=False)
    file = MessageFilesSerializer(many=True)
    class Meta:
        model = Message
        fields = '__all__'


class GetThreadSerializer(serializers.ModelSerializer):
    last_message = GetMessagesSerializer(many=False, read_only=True)
    original_poster = OwnerSerializer(many=False)
    class Meta:
        model = Thread
        fields = '__all__'





# class PostMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Message
#         fields = ['text', ]

class PostMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        exclude = ['owner', ]
