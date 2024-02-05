from django.urls import path

from social.views import StartThread, Messages, LastThreadsList, PostMessage

urlpatterns = [
    path('create/thread/', StartThread.as_view()),
    path('create/message/', PostMessage.as_view()),
    path('get/messages/<int:thread>/', Messages.as_view()),
    path('get/last_threads/', LastThreadsList.as_view()),
]