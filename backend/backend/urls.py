"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.urls import path
from backend import settings
from socialMedia.views import (
    LoginView, 
    RegisterView,
    ProfileView,
    SearchView,
    logout_view, 
    new_post, 
    get_all_posts,
    get_user_posts,
    get_post, 
    like_post, 
    new_reply, 
    delete_post, 
    change_profile,
    get_all_users,
    follow_user,
    get_notification,
    get_all_notifications,
    get_all_chats,
    get_all_messages,
    get_weather,
    delete_all_notifications
)

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/accounts/', get_all_users, name='get_all_users'),
    path('api/account/<str:username>/', ProfileView.as_view(), name='get_user'),
    path('api/search/', SearchView.as_view(), name='search'),
    path('api/account/<str:username>/change/', change_profile, name='change_profile'),
    path('api/account/<str:username>/follow/', follow_user, name='follow_user'),
    path('api/chats/', get_all_chats, name='get_all_chats'),
    path('api/chats/<str:username>/', get_all_messages, name='get_all_messages'),
    path('api/posts/', get_all_posts, name='get_all_posts'),
    path('api/posts/user/<str:username>/', get_user_posts, name='get_user_post'),
    path('api/posts/<int:post_id>/', get_post, name='get_post'),
    path('api/posts/<int:post_id>/like/', like_post, name='like_post'), 
    path('api/posts/<int:post_id>/delete/', delete_post, name='delete_post'),
    path('api/newpost/', new_post, name='new_post'),
    path('api/newpost/<int:post_id>/', new_reply, name='new_reply'),
    path('api/notifications/', get_all_notifications, name='get_all_notifications'),
    path('api/notifications/<str:username>/', get_notification, name='get_notification'),
    path('api/notifications/delete', delete_all_notifications, name='delete_all_notifications'),
    path('api/get_weather/', get_weather, name='get_weather'),
]