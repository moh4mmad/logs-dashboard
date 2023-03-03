from rest_framework import serializers
from crudApp.models.logs import Log

class LogWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'