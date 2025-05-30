# Generated by Django 4.2.5 on 2025-04-07 20:47

from decimal import Decimal
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("accounts", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Goal",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=100)),
                ("subtitle", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "goal_type",
                    models.CharField(
                        choices=[
                            ("savings", "Savings"),
                            ("investment", "Investment"),
                            ("debt", "Debt Repayment"),
                        ],
                        default="savings",
                        max_length=20,
                    ),
                ),
                ("target_amount", models.DecimalField(decimal_places=2, max_digits=12)),
                (
                    "current_amount",
                    models.DecimalField(
                        decimal_places=2, default=Decimal("0.00"), max_digits=12
                    ),
                ),
                ("target_date", models.DateField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("in-progress", "In Progress"),
                            ("completed", "Completed"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("icon", models.CharField(default="piggy-bank", max_length=50)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "linked_account",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="goals",
                        to="accounts.account",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="goals",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
