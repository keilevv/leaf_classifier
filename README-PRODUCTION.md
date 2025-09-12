# Production Deployment Guide

This guide explains how to deploy the Leaf Classifier application in production using Docker.

## 🚀 Quick Start

1. **Setup Production Environment**
   ```bash
   # Interactive setup (recommended)
   ./setup-prod.sh
   
   # Or manually configure
   nano .env.prod
   nano backend/.env.prod
   nano frontend/.env.prod
   ```

2. **Deploy with Script**
   ```bash
   ./deploy.sh
   # Or manually with docker
   docker compose -f docker-compose.prod.yml up -d
   ```

## 📋 Manual Deployment

### 1. Environment Setup

Production environment files have been created with your development configuration:

```bash
# Files already created with your actual values:
# - .env.prod (main configuration)
# - backend/.env.prod (backend configuration)  
# - frontend/.env.prod (frontend configuration)

# Update domain URLs for production:
nano .env.prod
nano backend/.env.prod
nano frontend/.env.prod
```

### 2. Build and Deploy

```bash
# Build production images
docker compose -f docker-compose.prod.yml build --no-cache

# Start production services
docker compose -f docker-compose.prod.yml up -d

# Check service status
docker compose -f docker-compose.prod.yml ps
```

## 🔧 Production Features

### Backend (Express + Bun)
- ✅ Multi-stage build for smaller images
- ✅ Production-only dependencies
- ✅ Non-root user execution
- ✅ Health checks
- ✅ Automatic restart on failure
- ✅ Prisma migrations on startup

### Frontend (React + Vite)
- ✅ Static build with Nginx
- ✅ Gzip compression
- ✅ Security headers
- ✅ Aggressive caching for static assets
- ✅ SPA routing support
- ✅ Non-root user execution

### Classifier (Flask + Gunicorn)
- ✅ Gunicorn WSGI server
- ✅ Multiple workers
- ✅ CPU-only PyTorch (smaller image)
- ✅ Health checks
- ✅ Non-root user execution

### Database (PostgreSQL)
- ✅ Persistent volumes
- ✅ Health checks
- ✅ Automatic restart

## 🌐 Production URLs

- **Frontend**: `http://129.153.122.159` (port 80)
- **Backend API**: `http://129.153.122.159:3000`
- **Classifier**: `http://129.153.122.159:5000`
- **Postgres**: `localhost:5432` (internal only)

## 🔒 Security Considerations

1. **Change Default Passwords**
   - Update `POSTGRES_PASSWORD` in `.env.prod`
   - Update `SESSION_SECRET` in `.env.prod`

2. **Use HTTPS in Production**
   - Add reverse proxy (nginx/traefik) with SSL
   - Update `FRONTEND_URL` and `VITE_API_URL` to use HTTPS

3. **Firewall Configuration**
   - Only expose necessary ports (80, 443)
   - Keep database port (5432) internal

4. **Environment Variables**
   - Never commit `.env.prod` files
   - Use secrets management in production

## 📊 Monitoring

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
```

### Health Checks
```bash
# Check service health
docker compose -f docker-compose.prod.yml ps

# Manual health checks
curl -f http://localhost/api/auth/me  # Backend
curl -f http://localhost/              # Frontend
curl -f http://localhost:5000/api/upload  # Classifier
```

## 🔄 Updates

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Database Migrations
Migrations run automatically on backend startup. For manual migration:

```bash
docker compose -f docker-compose.prod.yml exec backend bunx prisma migrate deploy
```

## 🛑 Stopping Services

```bash
# Stop all services
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ DATA LOSS)
docker compose -f docker-compose.prod.yml down -v
```

## 📁 File Structure

```
├── docker-compose.prod.yml          # Production compose file
├── deploy.sh                        # Deployment script
├── env.prod.example                 # Environment template
├── backend/
│   ├── Dockerfile.prod              # Production backend image
│   ├── docker-entrypoint.prod.sh    # Production entrypoint
│   └── env.prod.example             # Backend environment template
├── frontend/
│   ├── Dockerfile.prod              # Production frontend image
│   └── nginx.prod.conf              # Production nginx config
└── classifier/
    └── Dockerfile.prod              # Production classifier image
```

## 🐛 Troubleshooting

### Services Won't Start
1. Check environment files exist and are configured
2. Check port conflicts: `netstat -tulpn | grep :3000`
3. Check logs: `docker compose -f docker-compose.prod.yml logs`

### Database Connection Issues
1. Verify `DATABASE_URL` in backend environment
2. Check postgres is healthy: `docker compose -f docker-compose.prod.yml ps`
3. Check postgres logs: `docker compose -f docker-compose.prod.yml logs postgres`

### Frontend Not Loading
1. Check nginx logs: `docker compose -f docker-compose.prod.yml logs frontend`
2. Verify `VITE_API_URL` is correct
3. Check if backend is accessible from frontend container
