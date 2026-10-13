# FarmAssist - React.js Web Application 🌾🚜

> **Modern, High-Performance Web Portal for Farmers & Agricultural Service Providers**  
> Built with React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, and Axios.

---

## 🌟 Modules & Features

1. **Farmer Experience**:
   - **Service Catalog**: Browse 8 categories (Tractors, Drones, Irrigation, Soil Testing, etc.) with standardized unit pricing.
   - **Interactive Booking Wizard**: Dynamic unit calculation, date & preferred time selection, address & emergency urgency flags.
   - **Live Tracking Timeline**: Visual milestone timeline from dispatch to field completion.
   - **Invoicing & Payments**: Settlement modal with simulated UPI QR code, Card, and Cash on Service.
   - **Verified Reviews**: 5-star ratings and feedback for service providers.

2. **Service Provider Operations Hub**:
   - **Regional Job Pool**: Claim available unassigned requests with 1 click.
   - **Active Dispatches**: Field execution tracker with progress updates (`IN_PROGRESS`, `COMPLETED`).
   - **Equipment & Availability**: Toggle real-time availability and manage rates.

3. **Central Admin Console**:
   - **Interactive Recharts Analytics**: Category distribution pie charts and monthly request volume trends.
   - **Dispatch Center**: Assign unassigned requests to certified local providers.
   - **Catalog Tariff Management**: Full CRUD operations for service catalog items and rates.
   - **User Registry**: Farmer & provider accounts management with provider credential verification.

4. **Public Order Tracking**:
   - Non-authenticated tracking lookup by reference code (e.g. `FA-2026-1042`).

5. **1-Click Demo Persona Bar**:
   - Top floating banner allows instant 1-click switching between Farmer, Provider, and Admin roles.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (`node -v`, `npm -v`)
- Running FarmAssist Backend (default: `http://localhost:8080`)

### Installation & Launch
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will launch on **`http://localhost:5173`**.

### Building for Production
```bash
npm run build
```
The production bundle will be generated in `/dist`.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| 🌾 **Farmer** | `ramesh.patel@kisan.in` | `farmer123` |
| 🚜 **Provider** | `kisan.agro@services.in` | `provider123` |
| 🛡️ **Admin** | `admin@farmassist.com` | `admin123` |

---

## 🔗 Backend Repository
- **Backend API**: [FarmAssist-Backend](https://github.com/bjsr17/FarmAssist-Backend)
