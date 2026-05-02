# SmartCampus Frontend

Akıllı Kampüs Yönetim Sistemi - Frontend uygulaması.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- [Node.js](https://nodejs.org/) v18 veya üzeri
- npm veya yarn

### Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/username/smartcampus-frontend.git
cd smartcampus-frontend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyasını oluşturun:**
```bash
# .env.example dosyasını kopyalayın
cp .env.example .env.local
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

---

## 📁 Environment Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend API URL'i | `/api/v1` (dev) veya `https://api.smartcampus.edu/api/v1` (prod) |
| `NEXT_PUBLIC_APP_NAME` | Uygulama adı | `SmartCampus` |
| `NEXT_PUBLIC_APP_URL` | Uygulama URL'i | `http://localhost:3000` |

### Development vs Production

| Ortam | Dosya | API URL |
|-------|-------|---------|
| Development | `.env.local` | `/api/v1` (Mock API) |
| Production | `.env.production` | `https://api.smartcampus.edu/api/v1` |

**Development modunda** uygulama Next.js API Routes ile çalışan Mock API'yi kullanır. Gerçek backend'e ihtiyaç duymadan tüm özellikleri test edebilirsiniz.

---

## 🧪 Test Hesapları (Mock API)

| Email | Şifre | Rol |
|-------|-------|-----|
| `student@smartcampus.edu` | `Test1234!` | Öğrenci |
| `faculty@smartcampus.edu` | `Test1234!` | Akademisyen |
| `admin@smartcampus.edu` | `Admin1234!` | Admin |

---

## 📂 Proje Yapısı

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── (auth)/            # Auth sayfaları (login, register, vs)
│   ├── (dashboard)/       # Protected sayfalar (dashboard, profile)
│   └── api/v1/            # Mock API endpoints
├── components/
│   ├── auth/              # Auth components (LoginForm, ProtectedRoute)
│   ├── layout/            # Layout components (Navbar, Sidebar)
│   ├── profile/           # Profile components
│   └── ui/                # Shadcn UI components
├── schemas/               # Zod validation şemaları
├── services/              # API service layer
├── stores/                # Zustand state management
└── mocks/                 # Mock data ve helpers
```

---

## 🛠️ Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlat |
| `npm run build` | Production build oluştur |
| `npm run start` | Production sunucusunu başlat |
| `npm run lint` | ESLint ile kod kontrolü |

---

## 📱 Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Login | `/login` | Giriş sayfası |
| Register | `/register` | Kayıt sayfası |
| Verify Email | `/verify-email?token=xxx` | Email doğrulama |
| Forgot Password | `/forgot-password` | Şifre sıfırlama linki |
| Reset Password | `/reset-password?token=xxx` | Yeni şifre belirleme |
| Dashboard | `/dashboard` | Ana sayfa (protected) |
| Profile | `/profile` | Profil düzenleme (protected) |

---

## 🔧 Teknolojiler

- **Framework:** Next.js 16
- **UI:** Tailwind CSS + Shadcn UI
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Toasts:** Sonner

---

## 📝 Lisans

MIT
