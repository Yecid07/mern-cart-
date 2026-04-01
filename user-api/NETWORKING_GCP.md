# GCP Networking & Firewall - Inter-Cloud Communication

## 1. VPC Network Configuration

### a) Crear VPC Network
```bash
gcloud compute networks create user-api-vpc \
  --subnet-mode=custom \
  --bgp-routing-mode=regional
```

### b) Crear Subnet
```bash
gcloud compute networks subnets create user-api-subnet \
  --network=user-api-vpc \
  --region=us-central1 \
  --range=10.0.0.0/20
```

## 2. Firewall Rules - AWS ↔ GCP Communication

### a) Permitir tráfico desde AWS
```bash
gcloud compute firewall-rules create allow-from-aws \
  --network=user-api-vpc \
  --allow=tcp:8080 \
  --source-ranges=0.0.0.0/0 \
  --description="Allow HTTP from AWS Order API"
```

### b) Permitir HTTPS desde AWS hacia GCP
```bash
gcloud compute firewall-rules create allow-https-from-aws \
  --network=user-api-vpc \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --description="Allow HTTPS from AWS Order API"
```

### c) Permitir DNS (53)
```bash
gcloud compute firewall-rules create allow-dns-external \
  --network=user-api-vpc \
  --allow=udp:53,tcp:53 \
  --source-ranges=0.0.0.0/0
```

## 3. Cloud Armor (DDoS Protection)

### a) Crear Security Policy
```bash
gcloud compute security-policies create user-api-policy \
  --description="Security policy for User API"
```

### b) Agregar rule para permitir solo desde AWS
```bash
gcloud compute security-policies rules create 100 \
  --security-policy user-api-policy \
  --action allow \
  --origin-region-list us-east-1,us-west-2  # Regiones AWS de tus compañeros
```

### c) Agregar default deny
```bash
gcloud compute security-policies rules create 65535 \
  --security-policy user-api-policy \
  --action deny-403
```

## 4. Cloud Run Network Configuration

### a) Conectar Cloud Run a VPC
```bash
gcloud run deploy user-api \
  --vpc-connector=user-api-connector \
  --vpc-egress=private-ranges-only \
  --region us-central1
```

### b) Crear VPC Connector (si no existe)
```bash
gcloud compute networks vpc-access connectors create user-api-connector \
  --network=user-api-vpc \
  --region=us-central1 \
  --range=10.8.0.0/28
```

## 5. Cross-Cloud DNS Resolution

### a) Crear Cloud DNS Zone
```bash
gcloud dns managed-zones create user-api-zone \
  --dns-name="user-api.gcp." \
  --description="DNS for User API"
```

### b) Agregar registro A para AWS
```bash
gcloud dns record-sets update order-api.aws. \
  --rrdatas=<AWS_LOAD_BALANCER_IP> \
  --ttl=300 \
  --type=A \
  --zone=user-api-zone
```

## 6. Verificar Conectividad

### a) Testar conexión desde Cloud Run hacia AWS
```bash
gcloud run exec user-api \
  --region=us-central1 \
  -- curl -v https://order-api-aws.com/api/v2/orders
```

### b) Ver logs de firewall
```bash
gcloud compute firewall-rules list --filter="network:user-api-vpc"
```

## 7. CORS Configuration para Request Inter-Cloud

En `user-api/server.js`:
```javascript
app.use((req, res, next) => {
  // Permitir CORS desde Order API (Sebas en AWS)
  const allowedOrigins = [
    'https://order-api-xxxxxxxx-uc.a.run.app', // GCP Order API
  ];
  
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  next();
});
```

## 8. Monitorear Tráfico Inter-Cloud

```bash
# Ver VPC Flow Logs
gcloud compute networks vpc-access describe user-api-connector \
  --region=us-central1

# Cloud Logging
gcloud logging read "resource.type=api" --limit 50 --format=json
```

## 9. IPAM - IP Address Management

```bash
# Ver IPs asignadas a VPC
gcloud compute addresses list --global

# Reservar IP estática para futuro Load Balancer
gcloud compute addresses create user-api-ip \
  --region=us-central1
```

## Diagrama de Firewall Rules

```
┌─────────────────────────────────────────────────────┐
│ AWS (Compañero 2 - Santiago)                        │
│ ├─ Product API (3000)                              │
│ └─ Order API (Sebas) (3001)                         │
├─────────────────────────────────────────────────────┤
                    ↓ HTTPS (port 443)
      allow-from-aws Firewall Rule
                    ↓
┌─────────────────────────────────────────────────────┐
│ GCP (us-central1)                                   │
│ ├─ VPC: user-api-vpc (10.0.0.0/20)                │
│ ├─ Cloud Run: user-api                              │
│ └─ Cloud Armor: user-api-policy                    │
└─────────────────────────────────────────────────────┘
```
