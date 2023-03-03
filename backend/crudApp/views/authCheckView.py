from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AuthCheckView(views.APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'authenticated': True}, status=200)