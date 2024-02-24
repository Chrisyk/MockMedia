from rest_framework import serializers
from .models import Post, Profile

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
        return request.build_absolute_uri(profile_picture_url) if profile_picture_url else None