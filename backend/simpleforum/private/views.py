from django.core.exceptions import BadRequest
from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ParseError
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from private.models import PrivateThread, PrivateMessage, PrivateMessageFile
from private.serializers import PostPrivateThreadSerializer, GetPrivateThreadSerializer, PostPrivateMessageSerializer, \
    GetPrivateMessageSerializer
from social.views import MyPagination
from subscriptions.models import PrivateThreadSubscription
from users.models import User


class CreatePrivateThread(CreateAPIView):
    serializer_class = PostPrivateThreadSerializer
    permission_classes = [IsAuthenticated, ]

    @extend_schema(
        responses=GetPrivateThreadSerializer,
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        thread = self.perform_create(serializer)
        if thread[0]:
            headers = self.get_success_headers(serializer.data)
            return Response(GetPrivateThreadSerializer(thread[1], many=False).data, status=status.HTTP_201_CREATED,
                            headers=headers)
        if not thread[0]:
            return Response({'code': 'already_exist', 'id': thread[1]}, status=400)

    def perform_create(self, serializer):
        text = serializer.validated_data.get('text')
        user2 = serializer.validated_data.get('user2')
        # user2 = User.objects.get(id=user2_id)

        # Chek if the dialogue between these users unique
        test = PrivateThread.objects.filter(user1=self.request.user, user2=user2).first()
        cross_test = PrivateThread.objects.filter(user1=user2, user2=self.request.user).first()
        if test:
            return [False, test.id]
        if cross_test:
            return [False, cross_test.id]
            # raise ParseError("Dialogue already exist")

        thread = PrivateThread.objects.create(
            user1=self.request.user,
            user2=user2,
        )

        message = PrivateMessage.objects.create(
            owner=self.request.user,
            text=text,
            thread=thread
        )
        thread.last_message = message
        thread.save()
        if self.request.FILES:
            for file in self.request.FILES.getlist('file'):
                PrivateMessageFile.objects.create(message=message, file=file)
        # Create subscriptions for both users
        PrivateThreadSubscription.objects.create(
            user=self.request.user,
            thread=thread,
        )
        PrivateThreadSubscription.objects.create(
            user=user2,
            thread=thread,
        )
        return [True, thread]


class GetPrivateThreads(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    pagination_class = MyPagination
    serializer_class = GetPrivateThreadSerializer

    def list(self, request, *args, **kwargs):
        qs1 = PrivateThread.objects.filter(user1=request.user)
        qs2 = PrivateThread.objects.filter(user2=request.user)
        queryset = qs1.union(qs2)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PostMessage(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = PostPrivateMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        thread_id = kwargs.get('thread')
        message = self.perform_create(serializer, thread_id=thread_id)
        headers = self.get_success_headers(serializer.data)
        return Response(GetPrivateMessageSerializer(message, many=False).data, status=status.HTTP_201_CREATED,
                        headers=headers)

    def perform_create(self, serializer, thread_id):
        text = serializer.validated_data.get('text')
        thread = PrivateThread.objects.filter(id=thread_id).first()
        # Update total message counter in dialogue
        if thread:
            if not (thread.user1 == self.request.user or thread.user2 == self.request.user):
                raise AuthenticationFailed("Forbidden")
            message = PrivateMessage.objects.create(text=text, owner=self.request.user, thread=thread)
            thread.last_message = message
            thread.counter = thread.counter + 1
            thread.save()
            if self.request.FILES:
                for file in self.request.FILES.getlist('file'):
                    PrivateMessageFile.objects.create(message=message, file=file)
            return message
        raise BadRequest(f'No thread with id {thread_id} was found')


class GetPrivateMessages(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    pagination_class = MyPagination
    serializer_class = GetPrivateMessageSerializer

    def list(self, request, *args, **kwargs):
        thread = PrivateThread.objects.filter(id=kwargs.get('thread')).first()
        if not (thread.user1 == request.user or thread.user2 == request.user):
            raise AuthenticationFailed("Forbidden")
        # Check and update watch counter
        if thread:
            sub = PrivateThreadSubscription.objects.filter(user=request.user, thread=thread).first()
            if sub:
                sub.watched_counter = thread.counter
                sub.save()
        queryset = thread.privatemessage_set.all().order_by('-created_time')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# Create your views here.
