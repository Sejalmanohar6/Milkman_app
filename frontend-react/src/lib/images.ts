export function productImageUrl(name: string): string {
  const key = name.toLowerCase();
  if (key.includes('buffalo') && key.includes('milk')) {
    return 'https://images.pexels.com/photos/289368/pexels-photo-289368.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }
  if (key.includes('cow') && key.includes('milk')) {
    return 'https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }
  if (key.includes('paneer')) {
    return 'https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&w=1200';
  }
  if (key.includes('curd') || key.includes('yogurt') || key.includes('dahi') || key.includes('buttermilk')) {
    return 'https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }
  if (key.includes('lassi')) {
    return 'https://images.pexels.com/photos/10874048/pexels-photo-10874048.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }
  if (key.includes('ghee')) {
    return 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop';
  }
  if (key.includes('cheese')) {
    return 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=1200&auto=format&fit=crop';
  }
  if (key.includes('butter')) {
    return 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop';
  }
  if (key.includes('cream')) {
    return 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop';
  }
  const base = 'https://placehold.co/600x400';
  const txt = encodeURIComponent(name);
  return `${base}?text=${txt}`;
}
