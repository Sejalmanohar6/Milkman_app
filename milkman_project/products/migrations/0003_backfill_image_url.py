from django.db import migrations

def backfill_image_url(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    for p in Product.objects.all():
        if not getattr(p, 'image_url', '') and getattr(p, 'name', ''):
            name = p.name.lower()
            url = ''
            if 'buffalo' in name and 'milk' in name:
                url = 'https://images.pexels.com/photos/289368/pexels-photo-289368.jpeg?auto=compress&cs=tinysrgb&w=1200'
            elif 'cow' in name and 'milk' in name:
                url = 'https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=1200'
            elif 'paneer' in name:
                url = 'https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&w=1200'
            elif 'curd' in name or 'yogurt' in name or 'dahi' in name:
                url = 'https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200'
            elif 'ghee' in name:
                url = 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop'
            elif 'butter' in name:
                url = 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop'
            elif 'cheese' in name:
                url = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=1200&auto=format&fit=crop'
            if url:
                p.image_url = url
                p.save(update_fields=['image_url'])

class Migration(migrations.Migration):
    dependencies = [
        ('products', '0002_product_image_url'),
    ]
    operations = [
        migrations.RunPython(backfill_image_url, migrations.RunPython.noop),
    ]
