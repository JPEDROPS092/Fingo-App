from django.contrib import admin
from .models import Account

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'type', 'balance', 'is_active', 'created_at')
    list_filter = ('type', 'is_active')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('created_at', 'updated_at', 'slug')
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'description', 'type', 'balance')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at', 'updated_at', 'slug')
        }),
    )
