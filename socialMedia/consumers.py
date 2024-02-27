from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from rest_framework.authtoken.models import Token
from socialMedia.models import Message
from socialMedia.models import Chat
from django.contrib.auth.models import User

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.token = self.scope['url_route']['kwargs']['token']
        
        self.sender_user = Token.objects.get(key=self.token).user
        self.receiver_user = User.objects.get(username=self.username)
        usernames = sorted([self.sender_user.username, self.username])
        self.room_group_name = f'chat_{usernames[0]}_{usernames[1]}'
        self.chat_archive, created = Chat.objects.get_or_create(chat=self.room_group_name)
        if created:
            print(f"Created chat: {self.room_group_name}")
            self.chat_archive.participants.add(self.sender_user.profile)
            self.chat_archive.participants.add(self.receiver_user.profile)
            self.chat_archive.save()
        else :
            print(f"Chat already exists: {self.room_group_name}")
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        for message in self.chat_archive.messages.all():
            self.send(text_data=json.dumps({
                'type': 'chat',
                'message': message.content,
                'username': message.sender.user.username,
            }))
        
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']
        newMessage = Message(chat=self.chat_archive, content=message, sender=self.sender_user.profile)
        newMessage.save()
        print(f"Received message: {message} in {self.room_group_name}")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
            }
        )
    
    def chat_message(self, event):
        message = event['message']
        username = event['username']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'username': username,
        }))