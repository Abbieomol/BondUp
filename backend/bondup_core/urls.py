from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    PostListCreateView,
    CreatePostView,
    UserProfileView,
    UpdateProfileView,
    PostDetailView,
    DeletePostView,
    DeleteCommentView,
    CommentView,
    LikeDislikeView,
    NotificationListView,
    UserPostsView,
    FollowStatsView,
    toggle_follow,
    check_follow_status,
    MyPostsView,
    UserSettingView,
 
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', RegisterView.as_view(), name='signup'),

    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('posts/create/', CreatePostView.as_view(), name='create_post'),
    path('posts/user/', UserPostsView.as_view(), name='user_posts'),
    path('posts/<int:post_id>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:post_id>/delete/', DeletePostView.as_view(), name='delete_post'),

    path('posts/<int:post_id>/like/', LikeDislikeView.as_view(), name='like_dislike'),
    path('posts/<int:post_id>/comment/', CommentView.as_view(), name='comment'),
    path('comments/<int:comment_id>/delete/', DeleteCommentView.as_view(), name='comment_delete'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('update-profile/', UpdateProfileView.as_view(), name='update_profile'),
    path('my-posts/', MyPostsView.as_view(), name='my-posts'),
    path('follow-stats/', FollowStatsView.as_view(), name='my_follow_stats'),
    path('follow-stats/<str:username>/', FollowStatsView.as_view(), name='user_follow_stats'),
    path('follow/<str:username>/', toggle_follow, name='toggle_follow'),
    path('follow-status/<str:username>/', check_follow_status, name='check_follow_status'),
    path('settings/', UserSettingView.as_view(), name='user_settings'),
]
