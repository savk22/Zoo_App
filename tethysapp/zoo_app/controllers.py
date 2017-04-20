from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import Button


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'zoo_app/home.html', context)

def donate(request):
    """
    Controller for the app home page.
    """
    single_button = Button(display_text='Click Me',
                       name='click_me_name',
                       attributes={"onclick": "window.location='http://wwf.panda.org/how_you_can_help/support_wwf/donate/';"},
                       submit=True)

    context = {"single_button":single_button}

    return render(request, 'zoo_app/donate.html', context)

def video(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'zoo_app/video.html', context)