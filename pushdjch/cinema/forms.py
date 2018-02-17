from django import forms
from .models import CinemaSale

class TicketForm(forms.ModelForm):
    ticket_quan = forms.IntegerField(20,1,label="ilość")

    class Meta:
        model = CinemaSale
        fields = ('name','email')

        labels = {
            'name': ('Imię i Nazwisko'),
        }