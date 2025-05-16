from rest_framework.permissions import BasePermission
from .models import AccessToken
import time

class IsAdminUser(BasePermission):
    """
    Custom permission to only allow access to users with the 'ADMIN' role.
    """

    def has_permission(self, request, view):
        # Get the token from the Authorization header
        token = request.headers.get('Authorization')
        if not token:
            return False  # No token provided

        try:
            # Extract the token value (bearer token)
            token_value = token.split(" ")[1]

            # Look up the access token
            access_token = AccessToken.objects.get(token=token_value)
            # Check if the token is expired
            if access_token.ttl < int(time.time()):  # Token is expired
                print(f"Valid Token: {access_token.token} (TTL: {access_token.ttl})")
                print(f"User Role: {access_token.user_id.role_id}")
                return False
            
            # Check if the user has the 'ADMIN' role
            user = access_token.user_id
            if user.role_id == 'ADMIN':  # Role check
                return True  # Permission granted

        except (AccessToken.DoesNotExist, IndexError):
            return False  # Invalid or non-existent token or improper token format

        return False  # Default deny if none of the above conditions were met


class IsNormalUser(BasePermission):
    """
    Custom permission to only allow access to users with the 'NORMAL' role.
    """

    def has_permission(self, request, view):
        # Get the token from the Authorization header
        token = request.headers.get('Authorization')
        if not token:
            return False  # No token provided

        try:
            # Extract the token value (bearer token)
            token_value = token.split(" ")[1]

            # Look up the access token
            access_token = AccessToken.objects.get(token=token_value)
            # Check if the token is expired
            if access_token.ttl < int(time.time()):  # Token is expired
                print(f"Valid Token: {access_token.token} (TTL: {access_token.ttl})")
                print(f"User Role: {access_token.user_id.role_id}")
                return False
            
            # Check if the user has the 'NORMAL' role
            user = access_token.user_id
            if user.role_id == 'NORMAL':  # Role check
                return True  # Permission granted

        except (AccessToken.DoesNotExist, IndexError):
            return False  # Invalid or non-existent token or improper token format

        return False  # Default deny if none of the above conditions were met    