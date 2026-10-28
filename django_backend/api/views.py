import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Lista de productos en memoria
productos = [
    {
        "codigo": 1,
        "descripcion": "Coca cola",
        "precio": 2.33
    },
    {
        "codigo": 2,
        "descripcion": "Fanta",
        "precio": 1.7
    }
]

@csrf_exempt
def listar_productos(request):
    if request.method == 'GET':
        return JsonResponse(productos, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            nuevo_producto = {
                "codigo": int(data.get("codigo", len(productos) + 1)),
                "descripcion": str(data.get("descripcion", "")),
                "precio": float(data.get("precio", 0.0))
            }
            productos.append(nuevo_producto)
            return JsonResponse(nuevo_producto, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)