from django.contrib import admin
from .models import Transaction, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'icon', 'color', 'created_at')
    search_fields = ('name', 'user__username')
    list_filter = ('color',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'account', 'amount', 'type', 'category', 'status', 'timestamp')
    list_filter = ('type', 'status', 'account')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('timestamp',)
    fieldsets = (
        (None, {
            'fields': ('user', 'account', 'title', 'amount', 'type')
        }),
        ('Details', {
            'fields': ('category', 'description', 'status', 'timestamp')
        }),
    )
