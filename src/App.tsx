import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "@/components/ScrollToTop";
import StoreLayout from "@/components/store/StoreLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import CookieBanner from "@/components/store/CookieBanner";
import StorefrontHome from "@/pages/StorefrontHome";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AccountPage from "@/pages/AccountPage";
import OrdersPage from "@/pages/OrdersPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "@/pages/WishlistPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import ShippingPage from "@/pages/ShippingPage";
import ReturnsPage from "@/pages/ReturnsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminOrderDetail from "@/pages/admin/AdminOrderDetail";
import AdminFrontpage from "@/pages/admin/AdminFrontpage";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminReviews from "@/pages/admin/AdminReviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Storefront */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<StorefrontHome />} />
                <Route path="/produkter" element={<ProductsPage />} />
                <Route path="/produkt/:slug" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/opret-konto" element={<SignupPage />} />
                <Route path="/konto" element={<AccountPage />} />
                <Route path="/konto/ordrer" element={<OrdersPage />} />
                <Route path="/ordrer" element={<OrdersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/oenskeliste" element={<WishlistPage />} />
                {/* Info pages */}
                <Route path="/om-os" element={<AboutPage />} />
                <Route path="/kontakt" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/levering" element={<ShippingPage />} />
                <Route path="/returret" element={<ReturnsPage />} />
                <Route path="/privatlivspolitik" element={<PrivacyPage />} />
                <Route path="/handelsbetingelser" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/ordre-bekraeftelse" element={<OrderConfirmationPage />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="produkter" element={<AdminProducts />} />
                <Route path="produkter/:id" element={<AdminProductForm />} />
                <Route path="ordrer" element={<AdminOrders />} />
                <Route path="ordrer/:orderId" element={<AdminOrderDetail />} />
                <Route path="forside" element={<AdminFrontpage />} />
                <Route path="anmeldelser" element={<AdminReviews />} />
                <Route path="indstillinger" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;