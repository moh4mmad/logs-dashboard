from django.db import models
from .user import User

class Log(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField('Message', max_length = 255, blank=False)    
    severity = models.CharField('Severity', max_length = 30, blank=False)
    source = models.CharField('Source', max_length = 40, blank=False)
    timestamp = models.DateTimeField('Timestamp', auto_now_add=True)


