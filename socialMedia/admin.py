from django.contrib import admin
from .models import Profile, Post, Image, Chat
# Register your models here.

admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(Image)
admin.site.register(Chat)