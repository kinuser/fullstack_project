from rest_framework import serializers
from private.serializers import GetPrivateThreadSerializer
from social.serializers import GetThreadSerializer
from subscriptions.models import Subscription, PrivateThreadSubscription


class GetSubscriptionsSerializer(serializers.ModelSerializer):
    thread = GetThreadSerializer(many=False)

    class Meta:
        model = Subscription
        exclude = ['user']


class PostSubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        exclude = ['user', 'watched_counter']


class GetSubDialogues(serializers.ModelSerializer):
    thread = GetPrivateThreadSerializer(many=False)

    class Meta:
        model = PrivateThreadSubscription
        exclude = ['user']


class DeleteSubSerializer(serializers.Serializer):
    thread_id = serializers.IntegerField(required=True)
