# Parking System API
Backend API for Parking System

## Install Deno
https://deno.land/#installation

## Install cotton cli
https://rahmanfadhil.github.io/cotton/guide/migrations.html#getting-started

## Run migration tool
```
cotton migration:up
```

## Store initial values
Run the sql script from `/data/default_values.sql`

## Then run 
```
deno run --allow-env --allow-read --allow-write app.ts
```
