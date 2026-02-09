import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAdminProducts } from '@/hooks/useAdminProducts';

export default function AdminProducts() {
  const { products, isLoading, deleteProduct, updateProduct } = useAdminProducts();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleToggleStatus = (product: typeof products[0]) => {
    updateProduct.mutate({
      id: product.id,
      status: product.status === 'active' ? 'draft' : 'active',
    });
  };

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
    setDeleteConfirm(null);
  };

  const totalInventory = (product: typeof products[0]) =>
    product.variants.reduce((sum, v) => sum + v.inventory, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Produkter</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} produkter</p>
        </div>
        <Link
          to="/admin/produkter/ny"
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Nyt produkt
        </Link>
      </div>

      <div className="admin-card overflow-hidden p-0">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Ingen produkter endnu</p>
            <Link
              to="/admin/produkter/ny"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Plus size={16} /> Opret dit første produkt
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Produkt</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Kategori</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Lager</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Varianter</th>
                  <th className="text-right p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pris</th>
                  <th className="text-right p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          {product.images[0]?.url ? (
                            <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                        product.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {product.status === 'active' ? 'Aktiv' : product.status === 'draft' ? 'Kladde' : 'Arkiveret'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category || '-'}</td>
                    <td className="p-4">
                      <span className={totalInventory(product) <= 5 ? 'text-destructive font-medium' : ''}>
                        {totalInventory(product)}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.variants.length}</td>
                    <td className="p-4 text-right font-medium">
                      {product.variants[0]?.price ? `${Number(product.variants[0].price).toLocaleString('da-DK')} kr` : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title={product.status === 'active' ? 'Deaktiver' : 'Aktiver'}
                        >
                          {product.status === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/produkter/${product.id}`)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title="Rediger"
                        >
                          <Pencil size={16} />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded"
                            >
                              Slet
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-2 py-1"
                            >
                              Annuller
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            title="Slet"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
