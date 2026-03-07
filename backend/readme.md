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
post req: http://localhost:4000/api/v1/users/signup
post req: http://localhost:4000/api/v1/users/login
patch req: http://localhost:4000/api/v1/users/grant/:id
get/post req: http://localhost:4000/api/v1/courses
post req: http://localhost:4000/api/v1/courses/join
get req: http://localhost:4000/api/v1/courses/request
put req: http://localhost:4000/api/v1/courses/enrollment/approve
put req: http://localhost:4000/api/v1/coursesenrollment/reject
```
