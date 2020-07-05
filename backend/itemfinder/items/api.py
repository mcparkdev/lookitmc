from .models import Item, Input
from rest_framework import viewsets, permissions, status
from .serializers import ItemSerializer, InputSerializer
from rest_framework import filters
from .crawling import searchItem
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend


class InputViewSet(viewsets.ModelViewSet):

    serializer_class = InputSerializer
    queryset = Input.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    filter_backends = [filters.SearchFilter]
    search_fields = ['=id', 'input']


class ItemViewSet(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ItemSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['input__input', '^name', '^store']
    filterset_fields = {
        'price': ['gte', 'lte', 'exact', 'gt', 'lt'],
    }
    ordering_fields = '__all__'

    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['input__input', 'store', 'name']

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, many=isinstance(request.data,list))
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# class ItemListView(ListAPIView):
#     queryset = Item.objects.all()
#     permission_classes = [
#         permissions.AllowAny
#     ]
#     serializer_class = ItemSerializer


# class ItemDetailView(RetrieveAPIView):
#     queryset = Item.objects.all()
#     permission_classes = [
#         permissions.AllowAny
#     ]
#     serializer_class = ItemSerializer
