from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class AccountAdmin(UserAdmin):
  list_display = ('email','username','register_date','last_login','is_admin','is_staff')
  search_fields = ('email','username')
  readonly_fields = ('id','register_date','last_login')
  filter_horizontal = ()
  list_filter = ()
  fieldsets = ()
  actions = ['delete_selected_users']
  
  def delete_selected_users(self, request, queryset):
        queryset.delete()
  delete_selected_users.short_description = "Delete selected users"
  
  
admin.site.register(Account,AccountAdmin)