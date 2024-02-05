from django.db.models import QuerySet
from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from search.serializers import AjaxSearchSerializer
from social.models import Thread
from social.serializers import GetThreadSerializer
from social.views import MyPagination
from subscriptions.models import Subscription
from users.models import User


class SearchAjax(ListAPIView):
    serializer_class = GetThreadSerializer
    pagination_class = MyPagination
    
    def list(self, request, *args, **kwargs):
        ser = AjaxSearchSerializer(data={'name': self.request.GET['name']})
        ser.is_valid(raise_exception=True)
        queryset = Thread.objects.filter(name__contains=ser.validated_data.get('name'))
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




# Create your views here.
