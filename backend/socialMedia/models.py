from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to="profpics", blank=True)
    description = models.TextField(blank=True, null=True)
    banner = models.ImageField(upload_to="banners", blank=True, null=True)
    following = models.ManyToManyField('self', related_name='followers', symmetrical=False, blank=True)
    notifications = models.IntegerField(default=0)
    messages = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

class Image(models.Model):
    image = models.ImageField(upload_to="imgs")
    def __str__(self):
        return str(self.image)

class Post(models.Model):
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    images = models.ManyToManyField(Image, blank=True)
    likes = models.ManyToManyField(User, through='Like', related_name='liked', blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    def __str__(self):
        return self.author.username + " - " + str(self.date_posted)

class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    type = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    def __str__(self):
        return self.type
    
class Message(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    images = models.ManyToManyField(Image, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.content

class Chat(models.Model):
    participants = models.ManyToManyField(Profile, related_name='participant_chats', blank=True)
    activeParticipants = models.ManyToManyField(Profile, related_name='active_participant_chats', blank=True)
    chat = models.CharField(max_length=255, unique=True)
    messages = models.ManyToManyField(Message, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.chat

class ChatNotification(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.username + " - " + self.post.author.username