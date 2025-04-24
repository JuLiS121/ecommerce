import stripe
from .models import Cart
from django.conf import settings
from rest_framework import status
from .serializers import CartSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_cart_products(request,pk):
  cart = Cart.objects.filter(customer=pk)
  serializer = CartSerializer(cart,many=True)
  return Response(serializer.data)

@api_view(['POST'])
def add_cart_product(request):
  serializer = CartSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_quantity(request,id,product):
  try:
    cart_item = Cart.objects.get(id=id, product=product)
  except Cart.DoesNotExist:
    return Response({"message": "Cart item not found"}, status=404)
  new_quantity = request.data.get('quantity')
  if new_quantity is None:
      return Response({"message": "Quantity field is required"}, status=400)
  try:
    new_quantity = int(new_quantity)
    if new_quantity <= 0:
        raise ValueError()
  except ValueError:
    return Response({"message": "Invalid quantity"}, status=400)
  cart_item.quantity = new_quantity
  cart_item.save()
  serializer = CartSerializer(cart_item)
  return Response(serializer.data)


@api_view(['DELETE'])
def delete_cart_product(request,pk,product):
  try:
    cart_item = Cart.objects.get(id=pk, product=product,)
  except Cart.DoesNotExist:
    return Response({"message": "Cart item not found"}, status=404)
  cart_item.delete()
  return Response({"message": "Cart item deleted successfully"}, status=204)

@api_view(['DELETE'])
def clear_cart(request,pk):
  cart = Cart.objects.filter(customer=pk)
  cart.delete()
  return Response({"message": "Cart deleted successfully"}, status=204)
  
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    def post(self, request, *args, **kwargs):
        DOMAIN = settings.DOMAIN
        data = request.data
        price = data.get('price') * 100
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': 'Total',
                            },
                            'unit_amount': int(price),
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=DOMAIN + '/success',
                cancel_url=DOMAIN + '/cart',
            )
            return Response({'id': checkout_session.id})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
