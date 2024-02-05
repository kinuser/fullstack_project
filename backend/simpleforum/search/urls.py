from django.urls import path

from search.views import SearchAjax

urlpatterns = [
    path('ajax/', SearchAjax.as_view()),
]