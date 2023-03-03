from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that includes the user's name in the response"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['name'] = self.user.name
        return data

    def to_representation(self, data):
        rep = super().to_representation(data)
        rep['name'] = self.user.name
        return rep
