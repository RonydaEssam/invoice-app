import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ClientsPage from "./pages/ClientsPage";
import AddClientPage from "./pages/AddClientPage";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ServicesPage from "./pages/ServicePage";
import AddServicePage from "./pages/AddServicePage";
import OrdersPage from "./pages/OrdersPage";
import AddOrderPage from "./pages/AddOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<AddClientPage />} />
        <Route path="/client/:id" element={<ClientDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/new" element={<AddServicePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<AddOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;