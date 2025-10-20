This document explains how to enable HTTPS for the `leaf-frontend` service using an automatic nginx reverse proxy + Let's Encrypt companion.

Overview
- We'll add an nginx-proxy (jwilder/nginx-proxy) that routes by VIRTUAL_HOST.
- We'll use nginxproxy/acme-companion to request and renew Let's Encrypt certificates automatically.
- The frontend container will not publish port 80 directly; the proxy will expose ports 80 and 443 and handle TLS.

Prerequisites
- Your DNS record for the domain (e.g. plantai.lab.utb.edu.co) must point to the host running Docker.
- Ports 80 and 443 must be reachable from the internet.

Environment variables
- VIRTUAL_HOST: Domain for the frontend (default: plantai.lab.utb.edu.co)
- LETSENCRYPT_HOST: Domain for Let's Encrypt (same as VIRTUAL_HOST)
- LETSENCRYPT_EMAIL: Email used for Let's Encrypt registration/renewal notices

Quick steps
1. Set environment variables for production (or export them before running docker-compose):

   export VIRTUAL_HOST=plantai.lab.utb.edu.co
   export LETSENCRYPT_HOST=plantai.lab.utb.edu.co
   export LETSENCRYPT_EMAIL=admin@plantai.lab.utb.edu.co

2. Start the stack (preferably with the updated `docker-compose.prod.yml`):

   docker compose -f docker-compose.prod.yml up -d nginx-proxy nginx-letsencrypt

   Wait until both containers are healthy and the acme-companion logs show successful provisioning.

3. Start the frontend (and other services):

   docker compose -f docker-compose.prod.yml up -d backend classifier frontend db

4. Check logs for certificate issuance:

   docker logs -f nginx-letsencrypt

   You should see messages about issuing certificates for your domain. The certificates are stored in the `certs` volume and automatically mounted into `nginx-proxy`.

5. Verify HTTPS from a remote machine (or locally if DNS resolves):

   curl -I https://plantai.lab.utb.edu.co

   Or open https://plantai.lab.utb.edu.co in a browser.

Notes and troubleshooting
- If certificates are not issued, check Let's Encrypt rate limits and DNS accuracy.
- Make sure `docker` has permission to read/write the sockets and volumes.
- If you want to use your own certificate, place the key and fullchain at `certs/<domain>.key` and `certs/<domain>.crt` on the host (or inside the `certs` volume) and reload the proxy.

Common ACME failure: webroot not writable or proxy config overridden

- The ACME companion uses HTTP-01 by default and writes challenge files to the nginx webroot at `/usr/share/nginx/html` inside the proxy.
- Do not override the `nginx-proxy` default config by mounting a custom `conf.d/default.conf` into the proxy container unless you also provide a writable `/usr/share/nginx/html` volume and the required location for `/.well-known/acme-challenge`.
- The `docker-compose.prod.yml` now provides a shared `webroot` volume mounted at `/usr/share/nginx/html` into both `nginx-proxy` and `nginx-letsencrypt` so the companion can write challenge files.
- If you still see "Invalid response" errors, verify that:
   1. The domain resolves to the VPS public IP (use `dig plantai.lab.utb.edu.co`).
   2. Ports 80 and 443 are open and reachable from the internet (use `nmap` or a remote `curl`).
   3. No other host process (another nginx) is intercepting requests on port 80/443.

Security
- Keep your `LETSENCRYPT_EMAIL` valid to receive expiry notices.
- Monitor the `nginx-letsencrypt` container and renewals.

Advanced
- You can use Traefik instead of nginx-proxy for advanced routing and HTTP->HTTPS redirect rules.
- If your server is behind a firewall or NAT, ensure ports are forwarded.

That's it — this setup will automatically provision certificates and keep them renewed while the companion is running.

Using subdomains for backend and classifier (recommended)
------------------------------------------------------

To expose both backend and classifier under HTTPS with the same proxy, the recommended approach is to create separate subdomains and let the nginx-proxy + acme-companion request certificates for each.

1. Create DNS records:
   - `api.plantai.lab.utb.edu.co` -> VPS IP
   - `classifier.plantai.lab.utb.edu.co` -> VPS IP

2. Environment variables: set these before starting the compose stack (or add to your host env):

   export BACKEND_VIRTUAL_HOST=api.plantai.lab.utb.edu.co
   export CLASSIFIER_VIRTUAL_HOST=classifier.plantai.lab.utb.edu.co
   export LETSENCRYPT_EMAIL=you@example.com

3. Start proxy and services (proxy first):

   docker compose -f docker-compose.prod.yml up -d nginx-proxy nginx-letsencrypt
   docker compose -f docker-compose.prod.yml up -d backend classifier frontend db

4. Verify with curl:

   curl -I https://api.plantai.lab.utb.edu.co
   curl -v -X POST https://classifier.plantai.lab.utb.edu.co/predict -F "image=@/path/to/test.jpg;type=image/jpeg"

Notes:
- Do not expose ports 5000/8000 publicly when using the proxy; the proxy will handle TLS and route traffic internally to the containers.
- If you need the backend accessible from the frontend, set `VITE_API_URL=https://api.plantai.lab.utb.edu.co/api` when building the frontend (the compose file updates this value by default).
