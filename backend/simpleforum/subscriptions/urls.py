from django.urls import path

from subscriptions.views import GetSubscriptions, PostSubscription, GetDialogues, DeleteSubscription

urlpatterns = [
    path('get/subs/', GetSubscriptions.as_view()),
    path('post/subs/', PostSubscription.as_view()),
    path('get/dialogues/', GetDialogues.as_view()),
    path('delete/subs/', DeleteSubscription.as_view())
]