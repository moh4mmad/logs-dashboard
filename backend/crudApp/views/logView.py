from rest_framework import status
from rest_framework.response import Response
from crudApp.models.logs import Log
from crudApp.serializers.logWriteSerializer import LogWriteSerializer
from crudApp.serializers.logReadSerializer import LogReadSerializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from crudApp.pagination.pagination import SetPagination
from datetime import datetime

import logging
import logging.handlers
import os
import gzip

class GZipRotator:
    def __call__(self, source, dest):
        os.rename(source, dest)
        f_in = open(dest, 'rb')
        f_out = gzip.open("%s.gz" % dest, 'wb')
        f_out.writelines(f_in)
        f_out.close()
        f_in.close()
        os.remove(dest)    

logformatter = logging.Formatter('%(asctime)s;%(levelname)s;%(message)s')
log = logging.handlers.TimedRotatingFileHandler('./logs/logs.log', 'W6')
log.setLevel(logging.INFO)
log.setFormatter(logformatter)
log.rotator = GZipRotator()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(log)

class LogListCreateView(generics.ListCreateAPIView):
    """
    Class LogListCreateView in charge of create a log and retrieve all logs    
    """
    permission_classes = (IsAuthenticated,)
    pagination_class = SetPagination

    def get_queryset(self):
        user = self.request.user
        severity = self.request.query_params.get('severity', None)
        source = self.request.query_params.get('source', None)
        queryset = Log.objects.filter(user=user)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        order_by = self.request.query_params.get('order_by', None)
        order_direction = self.request.query_params.get('order_direction', None)

        if start_date and end_date:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            queryset = queryset.filter(timestamp__range=(start_datetime, end_datetime))

        if severity:
            queryset = queryset.filter(severity=severity)

        if source:
            queryset = queryset.filter(source=source)
        
        order_by = order_by if order_by in ['id', 'severity', 'source', 'timestamp'] else None
        order_direction = order_direction if order_direction in ['asc', 'desc'] else None

        return queryset.order_by(order_by if order_direction == 'asc' else f'-{order_by}' if order_by else 'id')

    def get_serializer_class(self):
        if self.request.method in ["POST"]:
            return LogWriteSerializer
        return LogReadSerializer

    def post(self, request, *args, **kwargs):
        userAuthenticated = request.user.id
        data=request.data
        data.update({"user": userAuthenticated})
        serializerLog=LogWriteSerializer(data=data)
        if serializerLog.is_valid(raise_exception=True):
            log = serializerLog.save()
            logger.info(f' User: {request.user} added new log, id: {log.pk} ')                
            stringResponse = {'message':'Log created succesfully'}
        return Response(stringResponse, status=status.HTTP_201_CREATED)
     

class LogRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
    Class LogRetrieveUpdateView in charge of update and delete a single log    
    """ 
    lookup_field = "id"             
    lookup_url_kwarg = 'pk'         
    permission_classes = (IsAuthenticated,) 

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        stringResponse = {'message':'log deleted succesfully'}
        return Response(stringResponse, status=status.HTTP_202_ACCEPTED)

    def get_serializer_class(self):
        if self.request.method in ["PUT", "DELETE"]:
            return LogWriteSerializer
        return LogReadSerializer

    def get_queryset(self):
        user = self.request.user.id
        method = self.request.method
        if method == "GET":
            queryset = Log.objects.filter(user=user).order_by('id')
        else:
            queryset = Log.objects.filter(user=user)
        return queryset   

    def get(self, request, *args, **kwargs):
        try:
            pk = self.kwargs.get('pk')
            response = super().get(request, *args, **kwargs)
            logger.info(f' User: {request.user} request information about log id: {pk} ')
            return response
        except:
            stringResponse = {'message':'Unauthorized Request'}
            return Response(stringResponse, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        try:
            userAuthenticated = str(request.user.id)
            request.data.update({"user": userAuthenticated})
            response = super().put(request, *args, **kwargs)
            logger.info(f' User: {request.user} modifies log id: {pk} ')
            return response
        except:
            stringResponse = {'message':'Unauthorized Request'}
            return Response(stringResponse, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        try:
            response = super().delete(request, *args, **kwargs)
            logger.info(f' User: {request.user} deletes log id: {pk} ')
            return response
        except:
            stringResponse = {'message':'Unauthorized Request'}
            return Response(stringResponse, status=status.HTTP_401_UNAUTHORIZED)

