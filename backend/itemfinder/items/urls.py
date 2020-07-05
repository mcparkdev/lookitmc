from rest_framework import routers
from .api import ItemViewSet
from .api import InputViewSet

router = routers.DefaultRouter()
router.register('api/inputs', InputViewSet, 'inputs')
router.register('api/items', ItemViewSet, 'items')
urlpatterns = router.urls
