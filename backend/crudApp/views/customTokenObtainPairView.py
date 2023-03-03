from rest_framework_simplejwt.views import TokenObtainPairView
from crudApp.serializers.customTokenObtainPairSerializer import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view that uses our custom token serializer"""
    serializer_class = CustomTokenObtainPairSerializer