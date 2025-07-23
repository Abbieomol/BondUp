from django.apps import AppConfig


class BondupCoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bondup_core'

def ready(self):
        import bondup_core.signals

def ready(self):
    import bondup_core.signals
