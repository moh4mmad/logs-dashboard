from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UserLogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response(status=400)
        
        return Response(status=200)