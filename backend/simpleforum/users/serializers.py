from rest_framework import serializers
from users.models import User, Token


class UserCredentialsSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=150)


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'image']


class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=255)


class DestroyTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=255, required=False)
    access_token = serializers.CharField(max_length=255, required=False)


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=50)

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('password', instance.password))

        return instance

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=50)
    class Meta:
        model = User
        fields = ['password', 'username']

    def create(self, validated_data):
        return User.objects.create_user(username=validated_data.get('username'), password=validated_data.get('password'))
