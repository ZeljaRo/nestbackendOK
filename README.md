# 📦 NestJS Backend – Redis Cache & Token Logika

Ovaj projekt koristi Redis za optimizaciju performansi i sigurno upravljanje autentifikacijom putem tokena.

---

## 🔐 Token logika

- `accessToken`: JWT token s rokom trajanja 1 sat
- `refreshToken`: JWT token s rokom trajanja 7 dana
- Refresh token se **sprema u Redis** prilikom prijave

### Ključevi u Redis-u:
- `user_{id}_refresh` → sadrži refresh token korisnika
  - Primjer: `user_3_refresh`

---

## 📤 Login

- Endpoint: `POST /auth/login`
- Vraća:
  - `accessToken`
  - `refreshToken`

---

## 🔁 Refresh access tokena

- Endpoint: `POST /auth/refresh`
- Prima:
  - `userId`
  - `refreshToken`
- Provjerava valjanost refresh tokena u Redis cacheu
- Vraća novi `accessToken`

---

## 🧠 Keširanje korisnika

- `GET /users`:
  - Prvi put dohvaća podatke iz baze
  - Sprema listu korisnika u Redis kao `all_users`
- Sljedeći pozivi:
  - Koriste cache (`all_users`) za brži odgovor

---

## 🧹 Keš se automatski briše kad:

- Registriraš novog korisnika (`POST /auth/register`)
- Dodamo i druge operacije (npr. brisanje korisnika)

---

## 📌 Zabilješke

- Redis pokrenut lokalno kroz Docker: `docker run -d --name redis-test -p 6379:6379 redis`
- Redis CLI: `docker exec -it redis-test redis-cli`
- Provjera ključeva: `keys *`, `get user_3_refresh`

