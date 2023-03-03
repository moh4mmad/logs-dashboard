from rest_framework import serializers
from crudApp.models.logs import Log
# from crudApp.models.user import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email']

class LogReadSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    class Meta:
        model = Log
        fields = ['id', 'message', 'severity', 'source', 'timestamp']
        #depth = 1