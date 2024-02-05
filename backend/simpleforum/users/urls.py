from django.urls import path

from users.views import RegisterUser, GetPostUser, UpdatePassword, LoginUser, RefreshToken, Logout, RegisterNewUser

urlpatterns = [
    path('create/', RegisterUser.as_view()),
    path('myuser/', GetPostUser.as_view()),
    path('update_password/', UpdatePassword.as_view()),
    path('login/', LoginUser.as_view()),
    path('refresh/', RefreshToken.as_view()),
    path('logout/', Logout.as_view()),
    path('register/', RegisterNewUser.as_view())
    # path('image/', Image.as_view()),
]
