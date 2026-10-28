from django.contrib import admin
from django.urls import path
from api.views import listar_productos

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/producto/', listar_productos, name='listar_productos'),
]