from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from user.response_handler import ResponseHandler
from .models import User
from .serializers import ProfileSerializer, ProfileListSerializer, LoginSerializer, UserSerializer
from rest_framework.response import Response
from .pagination import ProfileListPagination
from .permissions import IsAdminUser, IsNormalUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
class CheckAuthenticationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Authentication successful!"})
    
# Create your views here.
class ProfileView(APIView):
    permission_classes = (IsAdminUser,)
    parser_classes = (MultiPartParser, FormParser)
    response_handler = ResponseHandler()
    serializer_class = ProfileSerializer
    
    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
        
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data,context={'request': request})
            if serializer.is_valid():
                serializer.save()
                response_dict, status_code = self.response_handler.success(
                    data=serializer.data,
                    error=serializer.errors,
                    msg="User has been added successfully",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                response_dict, status_code = self.response_handler.error(
                    data=serializer.data,
                    error=serializer.errors,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        except Exception as e:
            print(f"Exception in ProfileView Add: \n {e}")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )
    
    def put(self, request):
        try:
            category_obj = self.get_object(id=request.data['id'])
            if category_obj:
                serializer = self.serializer_class(instance=category_obj, data=request.data, partial=True,context={'request': request})
            else:
                err_message = f"This record does not exist(id:{request.data['id']})."
                response_dict, status_code = self.response_handler.error(
                    data=None,
                    error= err_message,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
                
            if serializer.is_valid():
                serializer.validated_data['created_by'] = request.user
                serializer.save()
                response_dict, status_code = self.response_handler.success(
                    data=serializer.data,
                    error=serializer.errors,
                    msg="User has been updated successfully",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                response_dict, status_code = self.response_handler.error(
                    data=serializer.data,
                    error=serializer.errors,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        except Exception as e:
            print(f"Exception in ProfileView Update: \n {e}")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )
            
class DeleteProfileView(APIView):
    permission_classes = [IsAdminUser]
    response_handler = ResponseHandler() 
    
    def delete(self, request, pk):
        try:
            print("Uid :: ",pk)
            user_obj = User.objects.get(id=pk)
            print("user Obj :::>> ",user_obj)
            if user_obj:
                user_obj.delete()
                response_dict, status_code = self.response_handler.success(
                    data={},
                    error={},
                    msg="User has been deleted successfully",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                err_message = f"This record does not exist(id:{request.data['id']})."
                response_dict, status_code = self.response_handler.error(
                    data=None,
                    error= err_message,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        
        except Exception as e:
            print(f"Exception in DeleteProfileView as e:- {e} ")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )

class GetProfileView(APIView):
    permission_classes = [IsNormalUser]
    response_handler = ResponseHandler() 
    serializer_class = ProfileSerializer
    
    def get(self, request, pk):
        try:
            user_obj = User.objects.get(id=pk)
            user_serializer = self.serializer_class(user_obj)
            if user_obj:
                response_dict, status_code = self.response_handler.success(
                    data=user_serializer.data,
                    error={},
                    msg="User has been get successfully",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                err_message = f"This record does not exist(id:{request.data['id']})."
                response_dict, status_code = self.response_handler.error(
                    data=None,
                    error= err_message,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        
        except Exception as e:
            print(f"Exception in DeleteProfileView as e:- {e} ")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )

class ProfileListView(ListAPIView): 
    queryset = User.objects.filter(role_id='NORMAL').order_by('id')
    permission_classes = [IsAdminUser]
    authentication_classes = [TokenAuthentication]  
    response_handler = ResponseHandler()
    serializer_class = ProfileListSerializer
    
    # Pagination settings
    pagination_class = ProfileListPagination
    
    def list(self, request, *args, **kwargs):
        try:
            
            queryset = self.queryset
            # Getting page and page_size dynamically from request query params
            page = request.query_params.get('page', 1)  # Default to page 1 if not provided
            per_page = request.query_params.get('per_page', 10)  # Default to 10 if not provided

            # Use pagination to limit the queryset
            page_size = int(per_page) if per_page.isdigit() else 10
            paginator = self.pagination_class()
            paginator.page_size = page_size  # Override the default page size

            # Apply pagination
            page = paginator.paginate_queryset(queryset, request)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            else:
                # If no pagination is needed (when queryset is small)
                serializer = self.get_serializer(queryset, many=True)
                response_dict, status_code = self.response_handler.success(
                    data=serializer.data,
                    msg="No pagination applied (all data fetched).",
                )
                return Response(response_dict, status=status_code)
        
        except Exception as e:
            print(f"Exception in CategoryListView List: \n {e}")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=str(e), msg="Something went wrong."
            )
            return Response(response_dict, status=status_code)

class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    response_handler = ResponseHandler()
        
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data,context={'request': request})
            if serializer.is_valid():
                print("serializer.data ::: ",serializer.data)
                user_obj = User.objects.get(cell_number=serializer.validated_data['cell_number'])
                user_serializer = UserSerializer(instance=user_obj)
                response_dict, status_code = self.response_handler.success(
                    data={
                            "user": user_serializer.data,
                            "access": serializer.data['access'],
                        },
                    msg="User login successfully.",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                response_dict, status_code = self.response_handler.error(
                    data=serializer.errors,
                    msg="Your cell_number or password is wrong.",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        except Exception as e:
            print(f"Exception in AuthUserLoginView: \n {e}")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )
            
class RegisterView(APIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    response_handler = ResponseHandler()
        
    def post(self, request):
        try:
            print("request Data :: ",request.data)
            serializer = self.serializer_class(data=request.data,context={'request': request})
            if serializer.is_valid():
                serializer.save()
                response_dict, status_code = self.response_handler.success(
                    data=serializer.data,
                    error=serializer.errors,
                    msg="User has been added successfully",
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
            else:
                response_dict, status_code = self.response_handler.error(
                    data=serializer.data,
                    error=serializer.errors,
                )
                return Response(
                    response_dict,
                    status=status_code,
                )
        except Exception as e:
            print(f"Exception in ProfileView Add: \n {e}")
            response_dict, status_code = self.response_handler.failure(
                data=None, error=None, msg="Something went wrong."
            )
            return Response(
                response_dict,
                status=status_code,
            )
    
            
