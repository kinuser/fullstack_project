import base64
import datetime
import json
from random import randint

from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, UpdateAPIView, RetrieveDestroyAPIView, \
    GenericAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import exceptions
import time
from hashlib import sha256
from rest_framework.views import APIView
from simpleforum import settings
from users.models import User, Token
from users.serializers import CreateUserSerializer, PasswordSerializer, UserCredentialsSerializer, GetUserSerializer, \
    RefreshTokenSerializer, DestroyTokenSerializer, RegisterUserSerializer


# class RegisterUser(APIView):
#     def post(sef, request):
#         ser = CreateUserSerializer(data=request.data)
#         if ser.is_valid():
#             try:
#                 User.objects.create_user(**ser.validated_data)
#                 return Response({"Success": "User was created"})
#             except Exception as e:
#                 return Response(dict(Error=e), status=400)
#
#         return Response({"Error": {"Comment": "Invalid data", "Message": ser.errors}}, status=400)

class RegisterUser(CreateAPIView):
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({"OK"})


class LoginUser(CreateAPIView):
    serializer_class = UserCredentialsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(**serializer.validated_data)
        if user:
            access_exp = datetime.datetime.now() + datetime.timedelta(days=2)
            refresh_exp = datetime.datetime.now() + datetime.timedelta(days=10)
            access_dict = {
                "access": True,
                "exp": access_exp.strftime("%d/%m/%Y %H:%M:%S")
            }
            refresh_dict = {
                "refresh": True,
                "exp": refresh_exp.strftime("%d/%m/%Y %H:%M:%S")
            }
            refresh = json.dumps(refresh_dict)
            access = json.dumps(access_dict)

            token = Token.objects.create(
                refresh_token=base64.b64encode(refresh.encode('utf-8')).hex(),
                access_token=base64.b64encode(access.encode('utf-8')).hex(),
                owner=user,
                device_identity='1')
            return Response({"refresh": token.refresh_token, "access": token.access_token})
        raise exceptions.AuthenticationFailed('Wrong credentials')

class RefreshToken(UpdateAPIView):
    serializer_class = RefreshTokenSerializer
    queryset = Token.objects.all()

    def get_object(self, refresh):
        token = Token.objects.filter(refresh_token=refresh).first()
        if token:
            bs64code = bytes.fromhex(token.refresh_token)
            decoded_token = json.loads(base64.b64decode(bs64code).decode('utf-8'))
            # Проверка на актуальность токена
            if datetime.datetime.now() < datetime.datetime.strptime(decoded_token['exp'], "%d/%m/%Y %H:%M:%S"):
                return token
            token.delete()
            raise exceptions.AuthenticationFailed('Expired token')
        raise exceptions.AuthenticationFailed('Invalid or expired token')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = self.get_object(serializer.validated_data.get('refresh_token'))
        self.perform_update(instance=instance)

        return Response({"refresh": instance.refresh_token, "access": instance.access_token})


    def perform_update(self, instance):
        access_exp = datetime.datetime.now() + datetime.timedelta(days=2)
        refresh_exp = datetime.datetime.now() + datetime.timedelta(days=10)
        access_dict = {
            "access": True,
            "exp": access_exp.strftime("%d/%m/%Y %H:%M:%S")
        }
        refresh_dict = {
            "refresh": True,
            "exp": refresh_exp.strftime("%d/%m/%Y %H:%M:%S")
        }
        refresh = json.dumps(refresh_dict)
        access = json.dumps(access_dict)
        instance.refresh_token = base64.b64encode(refresh.encode('utf-8')).hex()
        instance.access_token = base64.b64encode(access.encode('utf-8')).hex()
        instance.save()

class GetPostUser(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = GetUserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if request.FILES:
            print('File logic works')
            instance.image = request.FILES['image']
            instance.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}




        return Response(serializer.data)

class UpdatePassword(UpdateAPIView):
    serializer_class = PasswordSerializer
    permission_classes = [IsAuthenticated]
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial, )
        serializer.is_valid(raise_exception=True)
        if instance.check_password(serializer.validated_data.get('email', instance.email)):
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response({"Wrong original password"}, status=400)

class Logout(DestroyAPIView):
    queryset = Token.objects.all()
    serializer_class = DestroyTokenSerializer

    def get_object(self, data):
        token = Token.objects.filter(**data).first()
        if token:
         return token
        raise exceptions.NotFound('Token was not found')

    def destroy(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.get_object(serializer.validated_data)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterNewUser(CreateAPIView):
    serializer_class = RegisterUserSerializer

    @extend_schema(
        responses=None
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED, headers=headers)

# class Image(APIView):
#     def post(self, request: Request):
#         # print(request.files)
#         print(request.FILES)
#         print(request)
#         return Response("test")
