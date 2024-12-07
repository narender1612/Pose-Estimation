from django.urls import path
from .views import PoseListCreateView, pose_estimation_video, pose_estimation_image, LogoutView, signup, login


urlpatterns = [
    path('poses/', PoseListCreateView.as_view(), name='pose-list-create'),
    path('pose-estimation/', pose_estimation_image, name='pose-estimation'),
    path('pose-estimation-video/', pose_estimation_video, name='pose-estimation-video'),
    # path('home/', HomeView.as_view(), name ='home'),
    path('logout/', LogoutView.as_view(), name ='logout'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
]