import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ClientsPage from "./pages/ClientsPage";
import AddClientPage from "./pages/AddClientPage";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ServicesPage from "./pages/ServicesPage";
import AddServicePage from "./pages/AddServicePage";
import OrdersPage from "./pages/OrdersPage";
import AddOrderPage from "./pages/AddOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/shared/Navbar";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Everything else requires a logged-in session */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<AddClientPage />} />
            <Route path="/clients/edit/:id" element={<AddClientPage />} />
            <Route path="/clients/:id" element={<ClientDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/new" element={<AddServicePage />} />
            <Route path="/services/edit/:id" element={<AddServicePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<AddOrderPage />} />
            <Route path="/orders/edit/:id" element={<AddOrderPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;