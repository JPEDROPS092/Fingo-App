from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from decimal import Decimal

class Account(models.Model):
    ACCOUNT_TYPES = (
        ('savings', 'Savings'),
        ('checking', 'Checking'),
        ('investment', 'Investment'),
        ('debt', 'Debt'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            self.slug = f"{base_slug}-{self.user.id}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} ({self.get_type_display()}) - {self.balance}"
