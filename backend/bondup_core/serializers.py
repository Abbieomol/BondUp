from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Like, Comment, Follow, Notification, Profile, UserSetting


class CommentSerializer(serializers.ModelSerializer): 
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']


class PostSerializer(serializers.ModelSerializer): 
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'image', 'created_at', 'likes', 'dislikes', 'comments', 'edited', 'user_username']

    def get_likes(self, obj):
        return obj.likes.filter(value='like').count()

    def get_dislikes(self, obj):
        return obj.likes.filter(value='dislike').count()
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None


class UserSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', allow_blank=True, required=False)
    contact = serializers.CharField(source='profile.contact', allow_blank=True, required=False)
    gender = serializers.CharField(source='profile.gender', allow_blank=True, required=False)
    name = serializers.CharField(source='profile.name', allow_blank=True, required=False)
    professional_info = serializers.CharField(source='profile.professional_info', allow_blank=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'contact', 'gender', 'name', 'professional_info']

    def update(self, instance, validated_data):
        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update Profile fields
        profile_data = validated_data.get('profile', {})
        profile = getattr(instance, 'profile', None)

        if profile:
            for attr in ['bio', 'contact', 'gender', 'name', 'professional_info']:
                if attr in profile_data:
                    setattr(profile, attr, profile_data[attr])
            profile.save()

        return instance

class PostCreateSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'image', 'created_at', 'edited']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return Post.objects.create(user=user, **validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'bio', 'contact', 'gender', 'professional_info']

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'followed_at']

class NotificationSerializer(serializers.ModelSerializer):
    actor = serializers.CharField(source='actor.username', read_only=True)
    post_id = serializers.SerializerMethodField()
    is_self = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'post_id', 'created_at', 'actor', 'is_self', 'is_read']

    def get_post_id(self, obj):
        return obj.post.id if obj.post else None

    def get_is_self(self, obj):
        request = self.context.get('request')
        return obj.actor == request.user if request else False

    def get_is_read(self, obj):
        request = self.context.get('request')
        # You may want to store read/unread state separately in your model.
        return obj.actor == request.user if request else False
    
class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = ['colorScheme', 'sidebarStyle', 'postDisplay']