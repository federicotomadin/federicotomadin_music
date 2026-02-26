import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { DataProvider } from "@/contexts/DataContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Home } from "@/pages/Home"
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminEvents,
  AdminMusic,
  AdminGallery,
  AdminSettings,
} from "@/pages/admin"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/panel/login" element={<AdminLogin />} />
            <Route
              path="/panel"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="eventos" element={<AdminEvents />} />
              <Route path="musica" element={<AdminMusic />} />
              <Route path="galeria" element={<AdminGallery />} />
              <Route path="configuracion" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
