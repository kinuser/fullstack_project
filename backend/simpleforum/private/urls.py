from django.urls import path

from private.views import CreatePrivateThread, GetPrivateMessages, PostMessage, GetPrivateThreads

urlpatterns = [
    path('create/thread/', CreatePrivateThread.as_view()),
    path('get/messages/<int:thread>/', GetPrivateMessages.as_view()),
    path('create/message/<int:thread>/', PostMessage.as_view()),
    path('get/threads/', GetPrivateThreads.as_view())

]