import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import OrdersPage from "./pages/account/OrdersPage";
import AddressesPage from "./pages/account/AddressesPage";
import PaymentsPage from "./pages/account/PaymentsPage";
import HelpPage from "./pages/account/HelpPage";

// Admin imports
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminVariants } from "./pages/admin/AdminVariants";
import { AdminImages } from "./pages/admin/AdminImages";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* New Arrivals */}
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/new-arrivals/:section" element={<NewArrivalsPage />} />
                
                {/* Auth */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
                <Route path="/admin/variants" element={<AdminProtectedRoute><AdminVariants /></AdminProtectedRoute>} />
                <Route path="/admin/images" element={<AdminProtectedRoute><AdminImages /></AdminProtectedRoute>} />
                <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
                
                {/* Section pages */}
                <Route path="/:section" element={<SectionPage />} />
                
                {/* Category pages */}
                <Route path="/:section/:category" element={<CategoryPage />} />
                
                {/* Product detail */}
                <Route path="/product/:id" element={<ProductPage />} />
                
                {/* Navigation pages */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/orders" element={<OrdersPage />} />
                <Route path="/account/addresses" element={<AddressesPage />} />
                <Route path="/account/payments" element={<PaymentsPage />} />
                <Route path="/account/help" element={<HelpPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
