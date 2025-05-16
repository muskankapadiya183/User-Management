from django.db import models
import os
# Create your models here.
from django.db import models
import uuid


def custom_filename(instance, filename):
    return '/'.join(['Profile',filename])

    # return os.path.join('profile/', unique_filename)

class User(models.Model):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('NORMAL', 'Normal'),
    )
    uid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, verbose_name='Public identifier')
    # profile_pic = models.FileField(upload_to=custom_filename, null=True, blank=True)
    profile_pic = models.ImageField(upload_to=custom_filename, blank=True, null=True, default='')

    name = models.CharField(max_length=100)
    cell_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)  # Stores bcrypt-hashed password
    email = models.EmailField(unique=True)
    role_id = models.CharField(max_length=20, choices=ROLE_CHOICES, default='NORMAL')
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        
    def __str__(self):
        return self.name

class AccessToken(models.Model):
    uid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, verbose_name='Token identifier')
    token = models.CharField(max_length=255, unique=True)
    ttl = models.BigIntegerField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='access_tokens')
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'access token'
        verbose_name_plural = 'access tokens'
        
    def __str__(self):
        return f"Token for {self.user_id.name}"