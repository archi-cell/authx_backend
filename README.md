## 🔐 AuthX Backend API

Base URL:
https://authx-backend.onrender.com

### Authentication Flow
1. Register user
2. Login → receive JWT
3. Access protected routes
4. Admin-only role-based access
5. Refresh token support
6. Logout invalidates refresh token

### Sample Endpoints

POST /api/auth/register  
POST /api/auth/login  

GET /api/users/profile  
GET /api/admin/dashboard  

PUT /api/admin/promote/:userId  
PUT /api/admin/demote/:userId  

Security:
- JWT Authentication
- Role Based Access Control
- Rate Limiting
- Helmet protection
