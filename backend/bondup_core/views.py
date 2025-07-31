from datetime import date
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from rest_framework.parsers import JSONParser

from .models import Post, Like, Comment, Notification, Follow, Profile, UserSetting
from .serializers import (
    NotificationSerializer,
    UserSerializer,
    UserProfileSerializer,
    PostSerializer,
    PostCreateSerializer,
    CommentSerializer,
    RegisterSerializer,
    UserSettingSerializer,
    
)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            serialized_user = UserSerializer(user).data
            return Response({'user': serialized_user})
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = PostCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'detail': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)  # partial=True allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeDislikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        value = request.data.get("value")
        if value not in ['like', 'dislike']:
            return Response({'detail': 'Invalid value'}, status=status.HTTP_400_BAD_REQUEST)

        post = get_object_or_404(Post, id=post_id)

        like, created = Like.objects.get_or_create(user=request.user, post=post)
        like.value = value
        like.save()

        if post.user != request.user:
            Notification.objects.create(
                recipient=post.user,
                actor=request.user,
                post=post,
                message=f"{request.user.username} {value}d your post."
            )

        return Response({'detail': f'Post {value}d successfully.'})


class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        text = request.data.get('text')
        post = get_object_or_404(Post, id=post_id)

        comment = Comment.objects.create(user=request.user, post=post, text=text)
        serializer = CommentSerializer(comment)

        Notification.objects.create(
            recipient=post.user,
            actor=request.user,
            post=post,
            message=f"{request.user.username} commented on your post."
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, post_id):
        comment_id = request.data.get('comment_id')
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)

        if comment.user != request.user:
            return Response({'error': 'You can only delete your own comment.'}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({'message': 'Comment deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if post.user != request.user:
            return Response({"error": "You can only edit your own posts."}, status=status.HTTP_403_FORBIDDEN)

        if hasattr(post, 'edited') and post.edited:
            return Response({'error': 'You can only edit once.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostCreateSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save(edited=True)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if post.user != request.user:
            return Response({"error": "You can only delete your own posts."}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted."}, status=status.HTTP_204_NO_CONTENT)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True, context={'request': request})
        return Response(serializer.data)


class DeletePostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if post.user != request.user:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class FollowStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username=None):
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        else:
            user = request.user

        following_count = user.following.count()
        followers_count = user.followers.count()
        return Response({
            "followers": followers_count,
            "following": following_count,
        })


class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(user=user).order_by("-created_at")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if target_user == request.user:
        return Response({"error": "You cannot follow yourself."}, status=400)

    follow = Follow.objects.filter(follower=request.user, following=target_user).first()
    if follow:
        follow.delete()
        return Response({"status": "unfollowed"}, status=200)
    else:
        Follow.objects.create(follower=request.user, following=target_user)
        return Response({"status": "followed"}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_follow_status(request, username):
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    is_following = Follow.objects.filter(follower=request.user, following=target_user).exists()
    return Response({"is_following": is_following})
  
class MyPostsView(APIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(user=user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
class UserSettingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_settings, _ = UserSetting.objects.get_or_create(user=request.user)
        serializer = UserSettingSerializer(user_settings)
        return Response(serializer.data)

    def put(self, request):
        user_settings, _ = UserSetting.objects.get_or_create(user=request.user)
        serializer = UserSettingSerializer(user_settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class DeleteCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            # Allow deletion only if the current user is the comment owner or post owner
            if comment.user == request.user or comment.post.user == request.user:
                comment.delete()
                return Response({'message': 'Comment deleted'}, status=204)
            else:
                return Response({'error': 'Unauthorized'}, status=403)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=404)   
        
