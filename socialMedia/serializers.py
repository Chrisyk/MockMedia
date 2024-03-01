from rest_framework import serializers
from .models import Post, Profile, Chat, Notification

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__' 

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id','username', 'profile_picture', 'description', 'followers']

    def get_profile_picture(self, obj):
        request = self.context.get('request')
        profile_picture_url = obj.picture.url if obj.picture else None
        if request and profile_picture_url:
            return request.build_absolute_uri(profile_picture_url)
        else:
            return None
    
class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = ['id', 'type','post', 'date', 'read', 'sender', 'profile_picture']

    def get_sender(self, obj):
        # Use the ProfileSerializer to serialize the sender's profile
        profile = obj.sender.profile
        return ProfileSerializer(profile).data
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        profile_picture_url = obj.sender.profile.picture.url if obj.sender.profile.picture else None
        if request and profile_picture_url:
            return request.build_absolute_uri(profile_picture_url)
        else:
            return None
    def get_date(self, obj):
        return obj.date.strftime("%b %d, %y, %I:%M %p")

class ChatSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True)

    class Meta:
        model = Chat
        fields = ['chat', 'date', 'participants']
