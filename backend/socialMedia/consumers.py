from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from rest_framework.authtoken.models import Token
from socialMedia.models import Message
from socialMedia.models import Chat, ChatNotification
from django.contrib.auth.models import User
from socialMedia.serializers import ChatNotificationSerializer, MessageSerializer
from django.core.cache import cache
import boto3
from dotenv import load_dotenv
import os
from channels.layers import get_channel_layer

load_dotenv()
class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.user = User.objects.get(username=self.username)
        self.room_group_name = f'notifications_{self.username}'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        # Send all notifications in the database
        chatNotification = ChatNotification.objects.filter(user=self.user)
        chat_notification_serializer = ChatNotificationSerializer(chatNotification, many=True)
        self.send(text_data=json.dumps({
            'totalNotifications': self.user.profile.notifications, # This is the total number of notifications a user has
            'totalMessages': self.user.profile.messages, # This is the total number of messages a user has
            'chatNotifications': chat_notification_serializer.data # This is for each chat a user has
        }))
    
    def notification_message(self, event):
        chatNotification = ChatNotification.objects.filter(user=self.user)
        chat_notification_serializer = ChatNotificationSerializer(chatNotification, many=True)
        if event['message']['type'] == 'message':
            self.user.profile.messages += 1
        else:
            self.user.profile.notifications += 1
        self.user.profile.save()
        self.send(text_data=json.dumps({
            'totalNotifications': self.user.profile.notifications,
            'totalMessages': self.user.profile.messages,
            'chatNotifications': chat_notification_serializer.data,
            'message': event['message']
        }))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.token = self.scope['url_route']['kwargs']['token']
        self.sender_user = Token.objects.get(key=self.token).user
        self.receiver_user = User.objects.get(username=self.username)
        usernames = sorted([self.sender_user.username, self.username])
        self.room_group_name = f'chat_{usernames[0]}_{usernames[1]}'
        self.chat_archive, createdChat = Chat.objects.get_or_create(chat=self.room_group_name)
        self.sender_notification, createdNotification = ChatNotification.objects.get_or_create(chat=self.chat_archive, user=self.sender_user)
        self.receiver_notification, createdNotification = ChatNotification.objects.get_or_create(chat=self.chat_archive, user=self.receiver_user)
        if createdChat:
            self.chat_archive.participants.add(self.sender_user.profile)
            self.chat_archive.participants.add(self.receiver_user.profile)
            self.chat_archive.save()
        # Adds the connected user to active participants
        self.chat_archive.activeParticipants.add(self.sender_user.profile)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.heartbeat()
        self.sender_user.profile.messages -= self.sender_notification.count # Removes the notification of this channel from total messages
        if self.sender_user.profile.messages < 0:
            self.sender_user.profile.messages = 0
        self.sender_notification.count = 0 # Resets the count of sender notifications of this chat only
        self.sender_user.profile.save()
        self.sender_notification.save()
        # Send all messages in the chat
    
    def heartbeat(self):
        cache.set(f'heartbeat_{self.room_group_name}_{self.sender_user.username}', True, 30)
        # Schedule the next heartbeat check
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.send)(self.room_group_name, {
            'type': 'heartbeat.check'
        })

    def heartbeat_check(self, event):
        # If the cache key has expired, the client has disconnected
        if not cache.get(f'heartbeat_{self.room_group_name}_{self.sender_user.username}'):
            self.disconnect()

        # Schedule the next heartbeat check
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.send)(self.room_group_name, {
            'type': 'heartbeat.check'
        }, delay=30)
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        newMessage = Message(content=message, sender=self.sender_user.profile) # Create a new message instance
        newMessage.save()
        self.chat_archive.messages.add(newMessage) # Add message to database archive
        self.chat_archive.save()
        message_serializer = MessageSerializer(newMessage) # Gets message ready to be sent to the client
        if not self.chat_archive.activeParticipants.filter(id=self.receiver_user.id).exists():
            self.receiver_notification.count += 1 # Adds to receiver's notifications of this channel
            self.receiver_notification.save()
            session = boto3.Session(
                region_name=os.getenv('REGION_NAME'),
            )
            sns = session.client('sns')
            messageContent = {
                'recipient': self.receiver_user.username,
                'username': self.sender_user.username,
                'profile_picture': self.sender_user.profile.picture.url if self.sender_user.profile.picture else '',
                'type' : 'message',
                'message': message
            }
            messageContent = json.dumps(messageContent)
            sns.publish(
            TopicArn=os.getenv('MESSAGE_TOPIC_ARN'),
            Message=messageContent,
            )
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_serializer.data
            }
        )
    
    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'message': message
        }))
    
    def disconnect(self, close_code):
        # Removes the connected user from active participants
        self.chat_archive.activeParticipants.remove(self.sender_user.profile)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    
    