from django.http import JsonResponse
from rest_framework import status
from crudApp.models.logs import Log
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.db.models import Count
from rest_framework.views import APIView

class LogAggregateView(APIView):
    """
    Class LogAggregateView in charge of retrieve all logs aggregated by date range, severity and source 
    """
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        user = self.request.user
        severity = self.request.query_params.get('severity', None)
        source = self.request.query_params.get('source', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = Log.objects.filter(user=user)

        if start_date and end_date:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            queryset = queryset.filter(timestamp__range=(start_datetime, end_datetime))

        if severity:
            queryset = queryset.filter(severity=severity)

        if source:
            queryset = queryset.filter(source=source)

        queryset = queryset.values('severity', 'source').annotate(count=Count('id'))
        queryset.order_by('severity', 'source')
        logs = list(queryset)
        return JsonResponse(logs, status=status.HTTP_200_OK, safe=False)

class LogAggregateChartView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_aggregate_queryset(self, label,severity, source, start_date, end_date):
        user = self.request.user
        queryset = Log.objects.filter(user=user)

        if start_date and end_date:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            queryset = queryset.filter(timestamp__range=(start_datetime, end_datetime))

        if label == 'severity':
            if severity:
                queryset = queryset.filter(severity=severity)
            queryset = queryset.values('severity').annotate(count=Count('severity'))
        elif label == 'source':
            if source:
                queryset = queryset.filter(source=source)
            queryset = queryset.values('source').annotate(count=Count('source'))
        else:
            return None
        
        labels = [entry['severity'] if 'severity' in entry else entry['source'] for entry in queryset]
        count = [entry['count'] for entry in queryset]

        return {'labels': labels, 'count': count}

    def get(self, request, *args, **kwargs):
        label = self.request.query_params.get('label')
        severity = self.request.query_params.get('severity', None)
        source = self.request.query_params.get('source', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        data = self.get_aggregate_queryset(label, severity, source, start_date, end_date)
        if data is None:
            return JsonResponse({"message": "Invalid label"},status=400)
        return JsonResponse(data, status=status.HTTP_200_OK, safe=False)

