from rest_framework import serializers
from .models import Item
from .models import Input
from .crawling import searchItem


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        depth = 1


class InputSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Input
        fields = ['id', 'input', 'created_at', 'items']
        read_only_fields = ['created_at', 'items']
        # depth = 1

    # def get_items(self, obj):
    #     return obj.data

    def create(self, validated_data):
        # items_data = validated_data.pop('items')
        # itemObjects = Item.objects.filter(input=str(validated_data['input']))
        input, created = Input.objects.update_or_create(
            input=validated_data['input'])
        print(f'Created? {created}')
        items_data = searchItem(str(validated_data['input']))

        if items_data:
            for item in items_data:

                Item.objects.update_or_create(**item, input=input)
                print(f"{item['name']} created")
            print("finished")
        # print(items_data)
        return input

    # def get_items(self,obj):

    def update(self, instance, validated_data):
        instance.input = validated_data.get('input', instance.input)
        items = searchItem(self.request.data['input'])
        instance.items = searchItem(self.request.data['input'])
        instance.save()
        return instance
