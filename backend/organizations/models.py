from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Organization(models.Model):
    ORG_TYPES = (
        ('business', 'Business'),
        ('nonprofit', 'Non-Profit'),
        ('personal', 'Personal'),
    )
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    org_type = models.CharField(max_length=20, choices=ORG_TYPES, default='business')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_organizations')
    members = models.ManyToManyField(User, through='OrganizationMember', related_name='organizations')
    logo = models.ImageField(upload_to='organization_logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    fiscal_year_start = models.DateField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class OrganizationMember(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('manager', 'Financial Manager'),
        ('accountant', 'Accountant'),
        ('viewer', 'Viewer'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('organization', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.organization.name} ({self.get_role_display()})"

class Project(models.Model):
    STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    team_members = models.ManyToManyField(User, related_name='projects', blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            self.slug = f"{base_slug}-{self.organization.id}"
        super().save(*args, **kwargs)
    
    @property
    def budget_spent(self):
        from transactions.models import Transaction
        spent = Transaction.objects.filter(
            project=self, 
            type='outgoing', 
            status='completed'
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return spent
    
    @property
    def budget_remaining(self):
        return self.budget - self.budget_spent
    
    @property
    def budget_percentage(self):
        if self.budget <= 0:
            return 0
        percentage = (self.budget_spent / self.budget) * 100
        return min(round(percentage), 100)
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"
