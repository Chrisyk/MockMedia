from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to="profpics", default='default.jpg')
    description = models.TextField(blank=True, null=True)
    banner = models.ImageField(upload_to="banners", blank=True, null=True)
    following = models.ManyToManyField('self', related_name='followers', symmetrical=False, blank=True)

    def __str__(self):
        return self.user.username
    
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

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.username + " - " + self.post.author.username