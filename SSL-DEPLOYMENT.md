# SSL Deployment Guide

This guide provides instructions for deploying your Leaf Classifier application with SSL certificates for both IP-based and domain-based access.

## 🚀 Quick Start

### Universal Deployment Script

Use the unified deployment script for both IP-based and domain-based SSL:

```bash
# For IP-based SSL (Self-signed)
./scripts/deploy-with-ssl.sh ip YOUR_VPS_IP_ADDRESS

# For Domain-based SSL (Let's Encrypt)
./scripts/deploy-with-ssl.sh domain YOUR_DOMAIN.COM your-email@example.com
```

### For IP-based Access (Self-signed SSL)

If you want to deploy with SSL using just your server's IP address:

```bash
# Replace with your actual server IP
./scripts/deploy-with-ssl.sh ip 129.153.122.159
```

**What this does:**
- ✅ Generates self-signed SSL certificate for your IP
- ✅ Builds frontend with Docker (no permission issues)
- ✅ Deploys all services with SSL enabled
- ✅ Access your app at `https://YOUR_IP_ADDRESS`
- ⚠️ Browsers will show security warnings (click "Advanced" → "Proceed")

### For Domain-based Access (Let's Encrypt SSL)

If you have a domain name and want trusted SSL certificates:

```bash
# Replace with your actual domain and email
./scripts/deploy-with-ssl.sh domain myapp.example.com admin@example.com
```

**Prerequisites for domain SSL:**
1. **Domain DNS Setup**: Point your domain to your VPS IP (`129.153.122.159`)
   - Add A record: `yourdomain.com` → `129.153.122.159`
   - Add A record: `www.yourdomain.com` → `129.153.122.159` (optional)
2. **Wait for DNS propagation** (5 minutes to 24 hours)
3. **Check DNS**: `nslookup yourdomain.com` should return your VPS IP

**What this does:**
- ✅ Gets trusted SSL certificate from Let's Encrypt
- ✅ Builds frontend with Docker for your domain
- ✅ Sets up automatic certificate renewal
- ✅ No browser security warnings
- ✅ Production-ready SSL configuration

## 📋 Prerequisites

### System Requirements
- Docker and Docker Compose installed
- OpenSSL installed (for certificate generation)
- Domain name pointing to your server (for domain-based SSL)
- Ports 80 and 443 available on your server

### For Domain-based SSL
- Domain DNS pointing to your server's public IP
- Email address for Let's Encrypt notifications
- Server accessible from the internet on ports 80 and 443

## 🔐 SSL Certificate Options

### 1. IP-based SSL (Self-signed)
- **Use case**: Development, testing, or internal networks
- **Certificate type**: Self-signed
- **Browser behavior**: Shows security warning (can be bypassed)
- **Setup time**: ~2 minutes
- **Cost**: Free

### 2. Domain-based SSL (Let's Encrypt)
- **Use case**: Production applications
- **Certificate type**: Trusted certificate from Let's Encrypt
- **Browser behavior**: No security warnings
- **Setup time**: ~5-10 minutes (depends on DNS propagation)
- **Cost**: Free
- **Auto-renewal**: Yes (automatic)

## 🛠️ Manual Setup (Advanced)

### Generate SSL Certificates Manually

```bash
# For IP-based access
./scripts/generate-ssl-certificates.sh 129.153.122.159

# For domain-based access (creates Let's Encrypt setup)
./scripts/generate-ssl-certificates.sh "" myapp.example.com
```

### Deploy with Docker Compose

```bash
# For IP-based SSL
export IP_ADDRESS="129.153.122.159"
docker-compose -f docker-compose.ssl-ip.yml up -d --build

# For domain-based SSL
docker-compose -f docker-compose.ssl-domain.yml up -d --build
```

### Individual Script Usage

If you prefer to use individual scripts:

```bash
# IP-based deployment
./scripts/deploy-ssl-ip.sh 129.153.122.159

# Domain-based deployment
./scripts/deploy-ssl-domain.sh myapp.example.com admin@example.com
```

## 📁 File Structure

```
nginx/
├── nginx.conf                 # Original HTTP configuration
├── nginx-ssl-ip.conf          # SSL configuration for IP access
├── nginx-ssl-domain.conf      # SSL configuration for domain access
└── ssl/
    ├── ip/                    # IP-based certificates
    │   ├── leafapp.crt
    │   └── leafapp.key
    ├── domain/                # Domain certificate configs
    └── dhparam.pem           # DH parameters for security

frontend/
├── Dockerfile.prod            # Original production Dockerfile
├── Dockerfile.ssl.prod        # SSL-enabled Dockerfile for IP
└── Dockerfile.ssl-domain.prod # SSL-enabled Dockerfile for domain

scripts/
├── generate-ssl-certificates.sh
├── deploy-with-ssl.sh         # Universal deployment script
├── deploy-ssl-ip.sh          # IP-specific deployment
├── deploy-ssl-domain.sh      # Domain-specific deployment
└── renew-ssl.sh              # Auto-generated for domain SSL

docker-compose.ssl-ip.yml      # Docker Compose for IP SSL
docker-compose.ssl-domain.yml  # Docker Compose for domain SSL
```

## 🔧 Configuration Details

### Security Features

Both SSL configurations include:
- **TLS 1.2 and 1.3** support
- **Strong cipher suites** (ECDHE, DHE)
- **HSTS headers** for security
- **Security headers** (XSS protection, content type options, etc.)
- **HTTP to HTTPS redirect**
- **DH parameters** for enhanced security

### Nginx Configuration

- **Frontend**: Serves React app with client-side routing support
- **API Proxy**: Routes `/api/*` to backend service
- **Classifier Proxy**: Routes `/classify/*` to classifier service
- **Static Assets**: Optimized caching for CSS, JS, images
- **File Upload**: Supports up to 100MB file uploads

## 🚨 Troubleshooting

### Common Issues

#### 1. Certificate Generation Fails
```bash
# Check if OpenSSL is installed
openssl version

# Install OpenSSL if missing (Ubuntu/Debian)
sudo apt-get update && sudo apt-get install openssl
```

#### 2. Let's Encrypt Certificate Fails
- Ensure domain DNS points to your server
- Check that ports 80 and 443 are open
- Verify no other service is using port 80
- Wait for DNS propagation (can take up to 24 hours)

#### 3. Browser Shows Security Warning (IP-based SSL)
This is expected for self-signed certificates. To bypass:
1. Click "Advanced" or "Show Details"
2. Click "Proceed to [site] (unsafe)" or "Continue to site"
3. Add security exception if prompted

#### 4. Services Not Starting
```bash
# Check Docker Compose logs
docker-compose -f docker-compose.ssl-ip.yml logs

# Check individual service logs
docker logs leaf-frontend
docker logs leaf-backend
docker logs leaf-classifier
docker logs leaf-db
```

#### 5. Frontend Build Issues
```bash
# Clean Docker build cache
docker system prune -f

# Rebuild frontend image
docker build --no-cache -t leaf-frontend \
    --build-arg VITE_API_URL="https://YOUR_IP/api" \
    -f frontend/Dockerfile.ssl.prod frontend/

# Or use the deployment script with --build flag
./scripts/deploy-with-ssl.sh ip YOUR_IP_ADDRESS
```

### Certificate Renewal

For domain-based SSL, certificates auto-renew via cron job. Manual renewal:

```bash
# Renew certificates manually
./scripts/renew-ssl.sh

# Or using Docker Compose directly
docker-compose -f docker-compose.ssl-domain.yml exec certbot certbot renew
```

### Port Conflicts

If ports 80/443 are already in use:

```bash
# Check what's using the ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop conflicting services
sudo systemctl stop apache2  # if Apache is running
sudo systemctl stop nginx    # if system nginx is running
```

## 📊 Monitoring

### Check Service Status
```bash
# View all services (IP-based)
docker-compose -f docker-compose.ssl-ip.yml ps

# View all services (domain-based)
docker-compose -f docker-compose.ssl-domain.yml ps

# View logs (IP-based)
docker-compose -f docker-compose.ssl-ip.yml logs -f

# View logs (domain-based)
docker-compose -f docker-compose.ssl-domain.yml logs -f

# Check certificate expiry (domain SSL)
docker-compose -f docker-compose.ssl-domain.yml exec certbot certbot certificates
```

### SSL Test
Visit [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/) to test your SSL configuration (domain-based only).

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Universal script (recommended)
./scripts/deploy-with-ssl.sh ip YOUR_IP_ADDRESS
./scripts/deploy-with-ssl.sh domain YOUR_DOMAIN YOUR_EMAIL

# Individual scripts
./scripts/deploy-ssl-ip.sh YOUR_IP_ADDRESS
./scripts/deploy-ssl-domain.sh YOUR_DOMAIN YOUR_EMAIL
```

### Backup Certificates
```bash
# Backup IP certificates
tar -czf ssl-backup-ip.tar.gz nginx/ssl/ip/

# Backup domain certificates
tar -czf ssl-backup-domain.tar.gz nginx/ssl/domain/
```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker Compose logs
3. Verify your server configuration
4. Ensure all prerequisites are met

## 📝 Notes

- Self-signed certificates are suitable for development and internal use
- Let's Encrypt certificates are free but require domain validation
- Certificates auto-renew for domain-based SSL
- All configurations include modern security best practices
- The setup supports both HTTP/1.1 and HTTP/2 protocols
