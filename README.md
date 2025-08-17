# SimplePOS

Next.js POS with Shadcn UI, Prisma, and RBAC.

## Auth & RBAC

- JWT httpOnly cookie stored as `pos_auth` using secret `JWT_SECRET`.
- Prisma models: `User`, `Role`, `Permission`, `RolePermission`, `PasswordResetToken`, plus existing `Product`/`Category`.
- Seed creates roles (Admin, Kasir, Manajer, Staff Gudang), permissions and an admin user `admin@example.com` / `Admin#123`.

## Environment

Create `.env` in project root:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-secret"
```

## Setup

```
npm i
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

