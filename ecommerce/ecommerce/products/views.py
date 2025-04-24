from rest_framework import status
from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser,FormParser
from django.db.models import Q


@api_view(['POST'])
# @permission_classes([IsAdminUser])
@parser_classes([MultiPartParser,FormParser])
def create_product(request,format=None):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            price = float(serializer.validated_data.get('price'))
            quantity_available = int(serializer.validated_data.get('quantity_available'))
            
            serializer.save(price=price, quantity_available=quantity_available)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Method not allowed'}, status=405)
 
@api_view(['POST'])
# @permission_classes([IsAdminUser])
@parser_classes([MultiPartParser,FormParser])
def create_category(request,format=None):
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Method not allowed'}, status=405)
  
  
@api_view(['GET'])
def list_all_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def list_searched_products(request,pk):
    objects = Product.objects.filter(Q(name__icontains=pk))
    serializer = ProductSerializer(objects, many=True)
    return Response(serializer.data)
    
  
@api_view(['GET'])
def get_product(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def list_all_categories(request):
    category = Category.objects.all()
    serializer = CategorySerializer(category,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_category_product(request,pk):
    product = Product.objects.filter(category=pk)
    serializer = ProductSerializer(product,many=True)
    return Response(serializer.data)

@api_view(['Get'])
def get_category(request,pk):
    category = Category.objects.get(id=pk)
    serializer = CategorySerializer(category)
    return Response(serializer.data)

