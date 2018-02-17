from django.conf import settings
from django.db import models

class CinemaSale(models.Model):

    seat        = models.CharField(max_length = 10)
    name        = models.CharField(max_length = 120)
    email       = models.EmailField()

    def __str__(self):
        show = self.name + " " + self.email + " " + self.seat
        return show

# Create your models here.
