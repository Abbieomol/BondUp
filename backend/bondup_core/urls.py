from django.urls import path
from .views import (
    LoginView,
    signup,
    PostListCreateView,
    CreatePostView,
    UpdateProfileView,
    LikeDislikeView,
    CommentView,
    
    NotificationListView,
    DeletePostView,
    PostDetailView
)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/create/', CreatePostView.as_view(), name='post_create'),
    path('posts/<int:post_id>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:post_id>/delete/', DeletePostView.as_view(), name='post_delete'),
    path('posts/<int:post_id>/like/', LikeDislikeView.as_view(), name='post_like'),

    path('posts/<int:post_id>/comment/', CommentView.as_view(), name='post_comment'),
    

    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),

]
