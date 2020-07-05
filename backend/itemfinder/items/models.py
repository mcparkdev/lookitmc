from django.db import models


class Input(models.Model):
    input = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.input

    @classmethod
    def create(cls, **kwargs):
        input = cls.objects.create(
            input=kwargs['input'],
        )
        return input

    @property
    def item(self):
        return self.item_set.all()


class Item (models.Model):
    input = models.ForeignKey(Input, on_delete=models.CASCADE)
    name = models.CharField(max_length=500)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=15, decimal_places=0)
    link = models.CharField(max_length=5000)
    store = models.CharField(max_length=500)
    imageURL = models.CharField(max_length=5000)
    logo = models.CharField(max_length=5000)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @classmethod
    def create(cls, **kwargs):
        item = cls.objects.create(
            input=kwargs['input'],
            brand=kwargs['brand'],
            name=kwargs['name'],
            price=kwargs['price'],
            link=kwargs['link'],
            store=kwargs['store'],
            imageURL=kwargs['imageURL'],
            logo=kwargs['logo'],
        )
        return item
