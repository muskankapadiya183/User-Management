from django.urls import path
from .views import ProfileView, DeleteProfileView,GetProfileView, ProfileListView, LoginView, CheckAuthenticationView, RegisterView
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    # User CRUD
    path('user', ProfileView.as_view(), name='user'),
    path('delete-user/<int:pk>/', DeleteProfileView.as_view(), name='delete_profile'),
    path('get-profile/<int:pk>/', GetProfileView.as_view(), name='get_profile'),
    path('get-all-user', ProfileListView.as_view(), name='get_all_user'),

    # User Authentication
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('check', CheckAuthenticationView.as_view(), name='check'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)