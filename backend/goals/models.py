from django.db import models
from django.contrib.auth.models import User
from accounts.models import Account
from decimal import Decimal

class Goal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    GOAL_TYPES = (
        ('savings', 'Savings'),
        ('investment', 'Investment'),
        ('debt', 'Debt Repayment'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES, default='savings')
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    target_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    icon = models.CharField(max_length=50, default='piggy-bank')
    linked_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='goals')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True, null=True)
    
    @property
    def progress(self):
        if self.target_amount <= 0:
            return 0
        progress = (self.current_amount / self.target_amount) * 100
        return min(round(progress), 100)
    
    def update_status(self):
        if self.progress >= 100:
            self.status = 'completed'
        elif self.progress > 0:
            self.status = 'in-progress'
        else:
            self.status = 'pending'
    
    def save(self, *args, **kwargs):
        self.update_status()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - {self.progress}% complete"
