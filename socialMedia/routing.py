from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<username>\w+)/(?P<token>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/notifications/(?P<username>\w+)/$', consumers.NotificationConsumer.as_asgi()),
]