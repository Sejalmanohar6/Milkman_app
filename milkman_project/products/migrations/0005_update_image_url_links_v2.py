from django.db import migrations

MAPPING = [
    ("buffalo", "milk", "https://images.pexels.com/photos/289368/pexels-photo-289368.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("cow", "milk", "https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("paneer", None, "https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&w=1200"),
    ("curd", None, "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("yogurt", None, "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("dahi", None, "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("lassi", None, "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("buttermilk", None, "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    ("ghee", None, "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop"),
    ("butter", None, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop"),
    ("cheese", None, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=1200&auto=format&fit=crop"),
    ("cream", None, "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop"),
]

def resync_image_urls(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    for p in Product.objects.all():
        name = (p.name or '').lower()
        current = (p.image_url or '')
        # Only set if empty or clearly placeholder-ish (unsplash generic or placehold)
        if current and 'unsplash.com' not in current and 'placehold.co' not in current:
            continue
        url = ''
        for key1, key2, link in MAPPING:
            if key2:
                if key1 in name and key2 in name:
                    url = link
                    break
            else:
                if key1 in name:
                    url = link
                    break
        if url and url != current:
            p.image_url = url
            p.save(update_fields=['image_url'])

class Migration(migrations.Migration):
    dependencies = [
        ('products', '0004_update_image_url_links'),
    ]
    operations = [
        migrations.RunPython(resync_image_urls, migrations.RunPython.noop),
    ]
