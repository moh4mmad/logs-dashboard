import csv
from django.http import HttpResponse
from django.views import View
from crudApp.models.logs import Log
import datetime

class LogsCSVExportView(View):
    def get(self, request):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="logs_' + timestamp + '.csv"'
        writer = csv.writer(response)
        
        # Write header row
        writer.writerow(['ID', 'Severity', 'Source', 'Message', 'Timestamp'])
        
        # Get logs data
        logs = Log.objects.all()
        
        # Write data rows
        for log in logs:
            writer.writerow([log.id, log.severity, log.source, log.message, log.timestamp])
        
        return response