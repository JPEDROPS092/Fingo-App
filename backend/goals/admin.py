from django.contrib import admin
from .models import Goal

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'goal_type', 'target_amount', 'current_amount', 'progress', 'status', 'target_date')
    list_filter = ('goal_type', 'status')
    search_fields = ('title', 'subtitle', 'description', 'user__username')
    readonly_fields = ('progress', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'title', 'subtitle', 'goal_type', 'icon')
        }),
        ('Financial', {
            'fields': ('target_amount', 'current_amount', 'progress', 'linked_account')
        }),
        ('Status', {
            'fields': ('status', 'target_date', 'created_at', 'updated_at')
        }),
        ('Additional Information', {
            'fields': ('description',),
            'classes': ('collapse',),
        }),
    )
