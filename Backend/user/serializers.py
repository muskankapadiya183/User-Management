from rest_framework import serializers
from .models import User
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AccessToken
from datetime import datetime
import uuid
import time

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "uid",
            "profile_pic",
            "name",
            "cell_number",
            "password",
            "email",
            "role_id"
        )
    
    def create(self, validated_data):
        # Hash the password using bcrypt before saving the user
        password = validated_data.pop('password', None)
        if password:
            hashed_password = self.hash_password(password)
            validated_data['password'] = hashed_password
        user = super().create(validated_data)
        return user

    
    def hash_password(self, password):
        """
        Hash the password using bcrypt.
        :param password: The plain password to hash.
        :return: The hashed password.
        """
        # bcrypt needs a salt, so we generate one
        salt = bcrypt.gensalt(rounds=12)  # rounds=12 is the default cost factor
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')  # return the hashed password as a string
    
class ProfileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('id', 'created_on', 'updated_on', 'deleted_at')
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            "uid",
            "profile_pic",
            "name",
            "cell_number",
            "email",
            "role_id"
        )
    
class LoginSerializer(serializers.Serializer):
    cell_number = serializers.CharField(write_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    access = serializers.CharField(read_only=True)
    email = serializers.CharField(read_only=True)
    role_id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = (
            "cell_number",
            "password",
        )
        
    def validate(self, data):
        try:
            user = User.objects.get(cell_number=data['cell_number'], deleted_at__isnull=True)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid cell number or password")

        if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
            raise serializers.ValidationError("Invalid cell number or password")

        try:
            # Generate JWT access token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            token_str = str(access_token)
            ttl = int(time.time()) + 240
            # Store in AccessToken table
            AccessToken.objects.create(
                token=token_str,
                ttl=ttl,
                user_id=user,
                created_on=datetime.now()
            )

            validation = {
                'access': access_token,
                'email': user.email,
                'role_id': user.role_id,
                'name': user.name,
                'cell_number': user.cell_number,
                'id': user.id,
            }
            print("Validation Data:", validation)
            return validation
        except:
            raise serializers.ValidationError("Invalid ")

    # class Meta:
    #     model = User
    #     fields = ["cell_number", "password"]
   
    # def validate_email(self, value):
    #     try:
    #         User.objects.get(email__iexact=value)
    #     except User.DoesNotExist:
    #         raise serializers.ValidationError(
    #             _("This account doesn't exist. Please create a new account.")
    #         )
    #     return value

    # def validate(self, data):
    #     cell_number = data['cell_number']
    #     user = User.objects.get(cell_number=cell_number, deleted_at__isnull=True)
    #     if user is None:
    #         raise serializers.ValidationError("Invalid login credentials")
        
    #     if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
    #         raise serializers.ValidationError("Invalid cell number or password")
    #     try: 
    #         user_obj = User.objects.get(cell_number=cell_number)
    #         refresh = RefreshToken.for_user(user)
    #         refresh_token = str(refresh)
    #         access_token = str(refresh.access_token)
    #         ttl = 30000 
    #         # Store in AccessToken table
    #         AccessToken.objects.create(
    #             token=access_token,
    #             ttl=ttl,
    #             userId=user,
    #             created=datetime.now()
    #         )
    #         validation = {
    #             'access': access_token,
    #             'email': user.email,
    #             'role_id': user.role_id,
    #             'name': user.first_name,
    #             'cell_number': user.cell_number,
    #             'id': user.id,
    #         }
    #         return validation
    #     except:
    #         raise serializers.ValidationError("Invalid ")