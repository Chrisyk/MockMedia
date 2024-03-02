from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from .models import Chat, Profile, Post, Image, Notification, ChatNotification
from .serializers import ProfileSerializer, ChatSerializer, SimpleChatSerializer, NotificationSerializer, ChatNotificationSerializer
import boto3
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import JsonResponse
from dotenv import load_dotenv
import os
import requests

load_dotenv()
# Invoke send a message to SNS
def send_notification(request, username, post, token, type, topic_arn):
    receiveUser = User.objects.get(username=username)
    sendUser = User.objects.get(auth_token=token)
    receiveUser.profile.notifications += 1
    notification = Notification(receiver=receiveUser,sender=sendUser, type=type)
    notification.post = post
    notification.save()
    receiveUser.save()
    client = boto3.client('sns', region_name=os.getenv('REGION_NAME'))
    print ("sender: ", sendUser.username, "receiver: ", receiveUser.username, "type: ", type, "topic_arn: ", topic_arn)
    message = {
        'recipient': username,
        'username': sendUser.username,
        'profile_picture': request.build_absolute_uri(sendUser.profile.picture.url) if sendUser.profile.picture else None,
        'type': type,
        'message': None,
    }
    client.publish(
        TopicArn=topic_arn,
        Message=json.dumps(message)
    )

def get_notification(request, username):
    if request.method == 'POST':
        notification_data = json.loads(request.body)
        channel_layer = get_channel_layer()
        print(notification_data)
        async_to_sync(channel_layer.group_send)(
            f'notifications_{username}',
            {
                'type': 'notification.message',
                'message': notification_data
            }
        )
        return JsonResponse({'message': 'Notification sent to WebSocket client.'})

# Gets all notifications
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_notifications(request):
    profile = request.user.profile
    profile.notifications = 0
    profile.save()
    allNotifications = Notification.objects.filter(receiver=request.user).order_by('-date')
    serializer = NotificationSerializer(allNotifications, context={'request': request}, many=True)
    
    response = Response(serializer.data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# API Request to login a user
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        profile = Profile.objects.filter(user=user).first()
        if user is None:
            return Response({'error': 'Invalid login credentials'}, status=status.HTTP_400_BAD_REQUEST)
        if profile is None:
            profile = Profile(user=user)
            profile.save()

        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'id': user.id}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)
    
# API Request to register a new user
@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password)
        profile = Profile(user=user)
        profile.save()
        return Response({'username': user.username}, status=status.HTTP_201_CREATED)

# Gets the user's profile
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        profile = get_object_or_404(Profile, user__username=username)
        following = profile.following.all()
        followed = profile.followers.all()
        chatNotification = ChatNotification.objects.filter(user=request.user)
        # Serialize the following and followed users
        following_serializer = ProfileSerializer(following, context={'request': request}, many=True)
        followed_serializer = ProfileSerializer(followed, context={'request': request}, many=True)
        chat_notification_serializer = ChatNotificationSerializer(chatNotification, many=True, context={'request': request})

        # Include the serialized following and followed users in the response
        data = {
            'username': profile.user.username, 
            'profile_picture': request.build_absolute_uri(profile.picture.url) if profile.picture else None,
            'banner': request.build_absolute_uri(profile.banner.url) if profile.banner else '',
            'email': profile.user.email, 
            'chat_notifications': chat_notification_serializer.data,
            'is_following': profile.followers.filter(id=request.user.id).exists(),
            'description': profile.description if profile.description else '',
            'post_ids': [post.id for post in profile.user.post_set.all()],
            'following': following_serializer.data,
            'followed': followed_serializer.data,
        }
        response = Response(data, status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"  # Allow CORS
        return Response(data, status=status.HTTP_200_OK)

# Gets all chats
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_chats(request):
    profile = request.user.profile
    chat = profile.participant_chats.all()
    chat_serializer = SimpleChatSerializer(chat, many=True, context={'request': request})
    response = Response(chat_serializer.data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Get all messages from a channel
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_messages(request, username):
    usernames = sorted([request.user.username, username])
    room_group_name = f'chat_{usernames[0]}_{usernames[1]}'
    chat = get_object_or_404(Chat, chat=room_group_name)
    chat_serializer = ChatSerializer(chat)
    response = Response(chat_serializer.data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Gets all users
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    profiles = Profile.objects.all()
    profiles_serializer = ProfileSerializer(profiles, context={'request': request}, many=True)
    response = Response(profiles_serializer.data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Changes profile information
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_profile(request, username):
    user = request.user
    profile = Profile.objects.filter(user=user).first()
    if profile is None:
        profile = Profile(user=user)
        profile.save()
    if request.data.get('newProfile'):
        print('Changing profile picture')
        profile.picture = request.data.get('newProfile')
    if request.data.get('newBanner'):
        print('Changing banner')
        profile.banner = request.data.get('newBanner')
    if request.data.get('newUsername'):
        print('Changing username')
        user.username = request.data.get('newUsername')
    if request.data.get('description') == '':
        profile.description = ''
    else:
        profile.description = request.data.get('newDescription')
    print('description:', profile.description)
    profile.save()
    user.save()
    return Response(status=status.HTTP_200_OK)

# Gets all posts
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_posts(request):
    posts = Post.objects.all().order_by('-date_posted')  # Sort by most recent to least recent
    posts = posts.filter(parent=None)
    data = []
    for post in posts:
        post_data = {
            'id': post.id,
            'author': post.author.username, 
            'profile_picture': request.build_absolute_uri(post.author.profile.picture.url) if post.author.profile.picture else None,
            'liked': post.likes.filter(id=request.user.id).exists(),
            'likes': post.likes.values_list('username', flat=True),
            'content': post.content, 
            'date_posted': post.date_posted.strftime("%b %d, %y, %I:%M %p"),
            'comments': [reply.id for reply in post.replies.all()],
            'parent': post.parent.author.username if post.parent else '',
            'parent_id': post.parent.id if post.parent else '',
            'images': [request.build_absolute_uri(img.image.url) for img in post.images.all()]
        }
        data.append(post_data)
    response = Response(data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Gets all posts from a user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(author=user).order_by('-date_posted')
    data = []
    for post in posts:
        post_data = {
            'id': post.id,
            'author': post.author.username, 
            'profile_picture': request.build_absolute_uri(post.author.profile.picture.url) if post.author.profile.picture else None,
            'liked': post.likes.filter(id=request.user.id).exists(),
            'date_posted': post.date_posted.strftime("%b %d, %y, %I:%M %p"),
            'likes': post.likes.values_list('username', flat=True),
            'content': post.content, 
            'comments': [reply.id for reply in post.replies.all()],
            'parent': post.parent.author.username if post.parent else '',
            'parent_id': post.parent.id if post.parent else '',
            'images': [request.build_absolute_uri(img.image.url) for img in post.images.all()]
        }
        data.append(post_data)
    response = Response(data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Gets one post
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    post_data = {
        'id': post.id,
        'author': post.author.username, 
        'profile_picture': request.build_absolute_uri(post.author.profile.picture.url) if post.author.profile.picture else None,
        'liked': post.likes.filter(id=request.user.id).exists(),
        'likes': post.likes.values_list('username', flat=True),
        'content': post.content, 
        'date_posted': post.date_posted.strftime("%b %d, %y, %I:%M %p"),
        'comments': [reply.id for reply in post.replies.all()],
        'parent': post.parent.author.username if post.parent else '',
        'parent_id': post.parent.id if post.parent else '',
        'images': [request.build_absolute_uri(img.image.url) for img in post.images.all()]
    }
    response = Response(post_data, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Creates a new post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def new_post(request):
    user = request.user
    content = request.data.get('text')
    post = Post(author=user, content=content)
    post.save()
    files = request.FILES.getlist('files[]')
    print("Number of files received:", len(files))
    for image_file in files:
        img = Image(image=image_file)
        img.save()
        post.images.add(img)
    post.save()
    return Response(status=status.HTTP_201_CREATED)

# Creates a new reply
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def new_reply(request, post_id):
    user = request.user
    content = request.data.get('text')
    token = Token.objects.get_or_create(user=user)
    parent = get_object_or_404(Post, id=post_id)
    post = Post(author=user, content=content, parent=parent)
    post.save()
    send_notification(request, parent.author.username, post, token, "comment", os.getenv('COMMENT_TOPIC_ARN'))
    files = request.FILES.getlist('files[]')
    print("Number of files received:", len(files))
    for image_file in files:
        img = Image(image=image_file)
        img.save()
        post.images.add(img)
    post.save()
    return Response(status=status.HTTP_201_CREATED)

# Likes a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    added = False
    user = request.user
    token = Token.objects.get_or_create(user=user)
    post = get_object_or_404(Post, id=post_id)
    if post is None:
        raise ValueError("Post is None")
    if user is None:
        raise ValueError("User is None")
    if post.likes.filter(id=user.id).exists():
        post.likes.remove(user)
        print("Removed Like")
        added = False
    else:
        notificationAlreadyExists = Notification.objects.filter(sender=user, post_id=post, type="like").exists()
        if not notificationAlreadyExists:
            send_notification(request, post.author.username, post, token, "like", os.getenv('LIKE_TOPIC_ARN'))
        else: print("Notification already exists")
        post.likes.add(user)
        print("Added Like")
        added = True
    print("Number of likes:", post.likes.count())
    post.save()
    return Response({'added': added, 'total_likes': post.likes.count()}, status=status.HTTP_200_OK)

# Follows or Unfollows a user
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    follows = False
    request_user = request.user
    followed_user = User.objects.filter(username=username).first()
    request_profile = Profile.objects.filter(user=request_user).first()
    followed_profile = Profile.objects.filter(user=followed_user).first()
    token = Token.objects.get_or_create(user=request_user)

    if followed_profile.followers.filter(id=request_user.id).exists():
        followed_profile.followers.remove(request_profile)
        request_profile.following.remove(request_profile)
        follows = False
        print("Unfollowed")
    else:
        followed_profile.followers.add(request_profile)
        request_profile.following.add(followed_profile)
        notificationAlreadyExists = Notification.objects.filter(sender=request_user, post_id=None, type="follow").exists()
        if not notificationAlreadyExists:
            send_notification(request, followed_user.username, None, token, "follow", os.getenv('FOLLOW_TOPIC_ARN'))
        else: print("Notification already exists")
        follows = True
        print("Followed")
    request_profile.save()
    followed_profile.save()
    return Response({'follows': follows},status=status.HTTP_200_OK)

# Deletes a post
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if post.author != request.user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    post.delete()
    return Response(status=status.HTTP_200_OK)

class SearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        if query is not '':
            results = User.objects.filter(username__istartswith=query)
            profiles = [user.profile for user in results]
            data = ProfileSerializer(profiles, context={'request': request}, many=True).data
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse([], safe=False)

# Get weather data
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_weather(request):
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    print("Latitude: ",latitude,"Longitude: ", longitude)
    response = requests.get(f'https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={os.getenv("WEATHER_API_KEY")}')
    data = response.json()
    return JsonResponse(data, safe=False)