# Leaf Classifier App

Esta aplicación consiste en tres componentes principales: **backend**, **frontend** y **classifier**.

## Requisitos

- [Bun](https://bun.sh/) instalado
- [Python 3](https://www.python.org/) instalado

## Inicialización

Se debe descargar el modelo clasificador en la carpeta `classifier` bajo el nombre "vit_leaf_classifier.pth".

### 1. Backend

```bash
cd backend
bun install
bun run dev
```

### 2. Frontend

```bash
cd frontend
bun install
bun run dev
```

### 3. Classifier (modelo de clasificación)

```bash
cd classifier
python3 app.py
```

## Notas

- El backend corre en el puerto configurado en `src/server.ts`.
- El frontend corre en el puerto configurado por Vite (por defecto 5173).
- El classifier corre en el puerto 5000.
