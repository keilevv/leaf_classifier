#!/bin/bash

# Create necessary directories
mkdir -p certbot/conf certbot/www

# Stop any running containers
docker-compose -f docker-compose.prod.yml down

# Create a temporary nginx configuration for certificate verification
cat > nginx-temp.conf <<EOL
server {
    listen 80;
    server_name plantai.lab.utb.edu.co;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOL

# Move the temporary config
test -f ./frontend/nginx/nginx.conf.bak || cp ./frontend/nginx/nginx.conf ./frontend/nginx/nginx.conf.bak
cp nginx-temp.conf ./frontend/nginx/nginx.conf

# Start nginx with the temporary configuration
echo "Starting Nginx with temporary configuration..."
docker-compose -f docker-compose.prod.yml up -d frontend

# Wait for nginx to start
sleep 5

# Get the SSL certificate
echo "Requesting SSL certificate from Let's Encrypt..."
docker run -it --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot certonly --webroot \
    -w /var/www/certbot \
    --email admin@plantai.lab.utb.edu.co \
    -d plantai.lab.utb.edu.co \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal

# Restore the original nginx config
cp ./frontend/nginx/nginx.conf.bak ./frontend/nginx/nginx.conf

# Start everything with the new configuration
echo "Starting all services with SSL..."
docker-compose -f docker-compose.prod.yml up -d

# Set up a cron job for automatic renewal
echo "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 0 * * * cd $(pwd) && docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt -v $(pwd)/certbot/www:/var/www/certbot certbot/certbot renew --quiet --deploy-hook 'docker-compose -f $(pwd)/docker-compose.prod.yml exec frontend nginx -s reload'") | crontab -

echo ""
echo "=========================================="
echo "SSL setup complete!"
echo "Your site should now be available at:"
echo "https://plantai.lab.utb.edu.co"
echo ""
echo "Backend API is available at:"
echo "https://plantai.lab.utb.edu.co/api"
echo ""
echo "To check certificate renewal logs:"
echo "docker-compose -f docker-compose.prod.yml logs certbot"
echo "=========================================="
