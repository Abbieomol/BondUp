from django.urls import path
from .views import (
    LoginView,
    UserProfileView,
    PostListCreateView,
    CreatePostView,
    UpdateProfileView,
    LikeDislikeView,
    CommentView,
    RegisterView,
    FollowStatsView,
    NotificationListView,
    DeletePostView,
    PostDetailView
)

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('follow-stats/', FollowStatsView.as_view(), name='follow_stats'),
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/create/', CreatePostView.as_view(), name='post_create'),
    path('posts/<int:post_id>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:post_id>/delete/', DeletePostView.as_view(), name='post_delete'),
    path('posts/<int:post_id>/like/', LikeDislikeView.as_view(), name='post_like'),

    path('posts/<int:post_id>/comment/', CommentView.as_view(), name='post_comment'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),

    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),

]
