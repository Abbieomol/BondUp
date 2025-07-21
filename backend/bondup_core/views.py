from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from .models import Post, Like, Comment, Notification  # ✅ Ensure Notification is imported
from .serializers import (
    UserSerializer,
    PostSerializer,
    PostCreateSerializer,
    CommentSerializer
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


@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'detail': 'User created successfully.'}, status=status.HTTP_201_CREATED)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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

        # ✅ Notification for like/dislike (and prevent self-notifications)
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

        # ✅ Always notify, even for self-comments
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
        print("Current user making request:", request.user)

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
        notifications = request.user.notifications.all().order_by('-created_at')
        data = [
            {
                "message": n.message,
                "post_id": n.post.id if n.post else None,
                "created_at": n.created_at,
                "actor": n.actor.username,
                "is_self": n.is_self,
                "is_read": n.actor == request.user  
            }
            for n in notifications
        ]
        return Response(data)

from django.shortcuts import get_object_or_404

class DeletePostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        if post.user != request.user:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)