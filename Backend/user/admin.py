from django.contrib import admin
from .models import User, AccessToken
import bcrypt
# Register your models here.
@admin.register(User)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "uid","profile_pic",
        "name",
        "cell_number",
        "password",
        "email",
        "role_id"
    )

    class Meta:
        model = User

    def save_model(self, request, obj, form, change):
        if form.cleaned_data['password'] and not change or (
            change and form.initial.get('password') != form.cleaned_data['password']
        ):
            obj.password = bcrypt.hashpw(
                form.cleaned_data['password'].encode('utf-8'), bcrypt.gensalt()
            ).decode('utf-8')
        obj.save()

@admin.register(AccessToken)
class AccessTokenAdmin(admin.ModelAdmin):
    list_display = (
        "uid","token",
        "ttl",
        "user_id",
        "created_on",
    )

    class Meta:
        model = AccessToken