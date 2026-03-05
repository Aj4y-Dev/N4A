### To setup the backend:

```
pnpm install

# to generate prisma
pnpm dlx prisma generate || npx prisma generate

# if you change schema you need to first migration it
pnpm dlx prisma migrate dev --name init
```

### Routes

```
post req: http://localhost:4000/api/v1/user/signup
post req: http://localhost:4000/api/v1/user/login
```
