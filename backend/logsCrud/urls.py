from django.urls import path
from rest_framework_simplejwt.views import (TokenRefreshView)
from crudApp import views

urlpatterns = [
    path('auth/register', views.UserCreateView.as_view()),
    path('auth/login', views.CustomTokenObtainPairView.as_view()),
    path('auth/refresh', TokenRefreshView.as_view()),
    path('auth/check', views.AuthCheckView.as_view()),
    path('auth/logout', views.UserLogoutView.as_view()),
    path('log', views.LogListCreateView.as_view()),
    path('log-aggregate', views.LogAggregateView.as_view()),
    path('log-aggregate-chart', views.LogAggregateChartView.as_view()),
    path('log-export', views.LogsCSVExportView.as_view()),
    path('log/<int:pk>', views.LogRetrieveUpdateView.as_view())
]

