# SSL Deployment Guide

This guide provides instructions for deploying your Leaf Classifier application with SSL certificates for both IP-based and domain-based access.

## 🚀 Quick Start

### For IP-based Access (Self-signed SSL)

If you want to deploy with SSL using just your server's IP address:

```bash
# Replace with your actual server IP
./scripts/deploy-ssl-ip.sh 192.168.1.100
```

### For Domain-based Access (Let's Encrypt SSL)

If you have a domain name and want trusted SSL certificates:

```bash
# Replace with your actual domain and email
./scripts/deploy-ssl-domain.sh myapp.example.com admin@example.com
```

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
./scripts/generate-ssl-certificates.sh 192.168.1.100

# For domain-based access (creates Let's Encrypt setup)
./scripts/generate-ssl-certificates.sh "" myapp.example.com
```

### Deploy with Docker Compose

```bash
# For IP-based SSL
docker-compose -f docker-compose.ssl-ip.yml up -d

# For domain-based SSL
docker-compose -f docker-compose.ssl-domain.yml up -d
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

scripts/
├── generate-ssl-certificates.sh
├── deploy-ssl-ip.sh
├── deploy-ssl-domain.sh
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
docker logs leaf-nginx
docker logs leaf-backend
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
# View all services
docker-compose -f docker-compose.ssl-ip.yml ps

# View logs
docker-compose -f docker-compose.ssl-ip.yml logs -f

# Check certificate expiry (domain SSL)
docker-compose -f docker-compose.ssl-domain.yml exec certbot certbot certificates
```

### SSL Test
Visit [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/) to test your SSL configuration (domain-based only).

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# For IP-based SSL
./scripts/deploy-ssl-ip.sh YOUR_IP_ADDRESS

# For domain-based SSL
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
