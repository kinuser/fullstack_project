from django.core.exceptions import ObjectDoesNotExist, BadRequest
from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from social.models import Thread, Message, MessageFiles
from social.serializers import CreateThreadSerializer, GetThreadSerializer, GetMessagesSerializer, \
    PostMessageSerializer, OwnerSerializer
from subscriptions.models import Subscription
from users.models import User


class StartThread(CreateAPIView):

    serializer_class = CreateThreadSerializer
    permission_classes = [IsAuthenticated,]

    @extend_schema(
        request=CreateThreadSerializer,
        responses=GetThreadSerializer,
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        thr = self.perform_create(serializer, request)
        headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(GetThreadSerializer(thr, many=False).data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, request: Request):
        # try:
            name = serializer.validated_data.get('name')
            text = serializer.validated_data.get('text')
            thr = Thread.objects.create(
                name=name,
                original_poster=request.user,
            )
            msg = Message.objects.create(
                owner= request.user,
                text=text,
                thread = thr
            )
            thr.last_message=msg
            thr.save()
            if request.FILES:
                for file in request.FILES.getlist('file'):
                    MessageFiles.objects.create(message=msg, file=file)
            return thr
        # except Exception as e:
        #     print(e)


class MyPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000


class LastThreadsList(ListAPIView):
    queryset = Thread.objects.all().order_by('-last_message__created_time')
    serializer_class = GetThreadSerializer
    pagination_class = MyPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if type(request.user) == User:
            subs_queryset = Subscription.objects.filter(user=request.user).select_related('thread')
            if subs_queryset is not None:
                for sub in subs_queryset:
                    for thr in queryset:
                        if sub.thread == thr:
                            thr.listened = True
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class Messages(ListAPIView):
    queryset = Message.objects.all()
    serializer_class = GetMessagesSerializer
    pagination_class = MyPagination

    # Разобраться с работой drf spectacular
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # Check and update watch counter
        thread = Thread.objects.filter(id=kwargs.get('thread')).first()
        if thread and request.user.is_authenticated:
            subscription = Subscription.objects.filter(user=request.user, thread=thread).first()
            if subscription:
                subscription.watched_counter = thread.counter
                subscription.save()
                print("Сработала логика обновления просмотров")
        queryset = Message.objects.filter(thread=kwargs.get('thread'))
        # print(args, kwargs)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response({
            'op': OwnerSerializer(thread.original_poster, many=False).data,
            'messages': serializer.data
        })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'op': OwnerSerializer(thread.original_poster, many=False).data,
            'messages': serializer.data
        })
    

class PostMessage(CreateAPIView):
    serializer_class = PostMessageSerializer
    permission_classes = [IsAuthenticated, ]

    @extend_schema(
        responses=GetMessagesSerializer
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(GetMessagesSerializer(message, many=False).data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        request: Request = self.request
        message = serializer.save(owner=self.request.user)
        thread = serializer.validated_data.get('thread')
        thread.counter = thread.counter + 1
        thread.last_message = message
        thread.save()
        if request.FILES:
            print('FILES exist')
            for file in self.request.FILES.getlist('file'):
                MessageFiles.objects.create(message=message, file=file)
        return message

# class PostMessage(CreateAPIView):
#     serializer_class = PostMessageSerializer
#     permission_classes = [IsAuthenticated, ]
#     @extend_schema(
#         responses=GetMessagesSerializer,
#     )
#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)
#     def create(self, request, *args, **kwargs):
#         thread = kwargs.get('thread')
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         message = self.perform_create(serializer, thread=thread)
#         headers = self.get_success_headers(serializer.data)
#         return Response(GetMessagesSerializer(message, many=False).data, status=status.HTTP_201_CREATED, headers=headers)
#
#     def perform_create(self, serializer, thread):
#         thr = Thread.objects.filter(id=thread).first()
#         if thr:
#             text = serializer.validated_data.get('text')
#             message = Message.objects.create(text=text, thread=thr, owner=self.request.user)
#             thr.last_message = message
#             thr.counter = thr.counter + 1
#             thr.save()
#             return message
#         elif not thr:
#             raise BadRequest(f'Thread with id = {thread} does not exist')
