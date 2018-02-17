import json


from django.shortcuts import render, reverse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, ListView, CreateView, FormView


from pusher import Pusher


from .models import CinemaSale
from .forms import TicketForm


pusher = Pusher(app_id=u'295876', key=u'4b34c484eeb9fe4f4142', secret=u'6b17e2a894fc39296783')


class CinemaSeatsView(TemplateView):

    template_name = "cinemaseats.html"
    success_url = '/welcome_cinema/'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(CinemaSeatsView, self).dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        pusher.trigger(u'a_channel', u'an_event', {u'message': request.POST.getlist('message[]')})
        queryset_seats = [obj.seat for obj in CinemaSale.objects.all()]

        try:
            request.session['buyer_name'] = self.request.POST['name']
            request.session['buyer_email'] = self.request.POST['email']
            request.session['seats_quan'] = self.request.POST['ticket_quan']
        except:
            print('next1')


        request.session['seats_taken'] = self.request.POST.getlist('message[]')
        if request.session['seats_taken']:
            print(request.session['seats_taken'])
            print(request.session['buyer_name'])
            print('next 2')
            for taken_seat in request.session['seats_taken']:
                spectator = CinemaSale(name = request.session['buyer_name'],
                                       email = request.session['buyer_email'],
                                       seat = taken_seat)
                print(spectator)
                spectator.save()

            return render(request, 'register.html')
            #     print('trying to save')

        else:

            context = {
                'queryset_seats': json.dumps(queryset_seats),
                'tickets_quan':request.session['seats_quan'],
            }

            return render(request, self.template_name, context)

    def get_queryset(self):
        queryset = CinemaSale.objects.all()
        # print(self.kwargs)
        return queryset
    #
    def get_context_data(self, **kwargs):
        queryset_seats = [obj.seat for obj in CinemaSale.objects.all()]

        form = TicketForm

        context = {
            'queryset_seats':json.dumps(queryset_seats),
            'form' : form,
        }

        return context


class RegisterView(FormView):
    form_class = TicketForm
    template_name = 'register.html'
    success_url = '/cinema/'

