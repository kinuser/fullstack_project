from rest_framework import serializers


class AjaxSearchSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, max_length=150, allow_blank=True)
