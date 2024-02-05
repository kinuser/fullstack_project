from django.db.models import QuerySet
from django.shortcuts import render
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound, ParseError
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.views import MyPagination
from subscriptions.models import Subscription, PrivateThreadSubscription
from subscriptions.serializers import GetSubscriptionsSerializer, PostSubscriptionsSerializer, GetSubDialogues, \
    DeleteSubSerializer


class GetSubscriptions(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetSubscriptionsSerializer
    pagination_class = MyPagination

    def get_queryset(self):
        queryset = Subscription.objects.filter(user=self.request.user).select_related('thread')

        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if queryset:
            for el in queryset:
                el.thread.listened = True
                print(el.thread.listened)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PostSubscription(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSubscriptionsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if Subscription.objects.filter(thread=serializer.validated_data.get('thread'), user=self.request.user).first():
            raise ParseError('Subscription was already created') # TODO: create right exception
        sub = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(GetSubscriptionsSerializer(sub, many=False).data, status=status.HTTP_201_CREATED,
                        headers=headers)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class GetDialogues(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetSubDialogues

    def get_queryset(self):
        queryset = PrivateThreadSubscription.objects.filter(user=self.request.user)
        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()
        return queryset


class DeleteSubscription(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Subscription.objects.all()
    serializer_class = DeleteSubSerializer

    def get_object(self):
        ser = DeleteSubSerializer(data=self.request.data, many=False)
        ser.is_valid(raise_exception=True)

        obj = Subscription.objects.filter(thread__id=ser.validated_data.get('thread_id'), user=self.request.user).first()
        if obj:
            return obj
        raise NotFound('Subscription was not found')
