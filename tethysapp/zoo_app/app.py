from tethys_sdk.base import TethysAppBase, url_map_maker


class ZooApp(TethysAppBase):
    """
    Tethys app class for Zoo App.
    """

    name = 'Zoo Finder'
    index = 'zoo_app:home'
    icon = 'zoo_app/images/panda1.png'
    package = 'zoo_app'
    root_url = 'zoo-app'
    color = '#004d00'
    description = 'Place a brief description of your app here.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='zoo-app',
                           controller='zoo_app.controllers.home'),
        )

        return url_maps