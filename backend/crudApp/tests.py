from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from crudApp.models.user import User
class TestAPI(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "name": "John Doe",
            "email": "john@test.com",
            "password": "Holaand5#]"
        }
        self.user = self.register_user(self.user_data)

    def register_user(self, data):
        response = self.client.post('/auth/register', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return User.objects.get(email=data['email'])

    def get_token(self):
        response = self.client.post('/auth/login', {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }, format='json')
        return response.data['access']

    def test_login(self):
        response = self.client.post('/auth/login', {
            "email": self.user_data['email'],
            "password": self.user_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('refresh' in response.data.keys(), True)
        self.assertEqual('access' in response.data.keys(), True)

    def test_create_log(self):
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}
        response = self.client.post('/log', {
            "message": "Test message",
            "severity": "INFO",
            "source": "backend",
        }, format='json', **auth_headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logs(self):
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}
        response = self.client.get('/log', **auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_log(self):
        url = '/log'
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}

        # First create a log to update
        response = self.client.post(
            url, 
            {
                "message": "test message",
                "severity": "INFO",
                "source": "test source",
            },
            format='json',
            **auth_headers,
        )
        log_id = 1

        # Update the log with new data
        update_data = {
            "message": "updated message",
            "severity": "WARNING",
            "source": "updated source",
        }
        update_url = f'/log/{log_id}'
        response = self.client.patch(update_url, update_data, format='json', **auth_headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], update_data['message'])
        self.assertEqual(response.data['severity'], update_data['severity'])
        self.assertEqual(response.data['source'], update_data['source'])

    def test_log_aggregate(self):
        url = '/log-aggregate'
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}
        response = self.client.get(url, **auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_log_aggregate_chart(self):
        url = '/log-aggregate-chart?label=severity'
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}
        response = self.client.get(url, **auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_log_export(self):
        url = '/log-export'
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + self.get_token()}
        response = self.client.get(url, **auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)