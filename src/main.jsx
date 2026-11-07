import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { LangProvider } from './i18n'
import { AuthProvider } from './account/AuthContext'
import { CatalogProvider } from './shopify/catalog'
import { CartProvider } from './shopify/cart'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <CatalogProvider>
          <CartProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </CartProvider>
        </CatalogProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
)
