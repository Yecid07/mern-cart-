# 🏛️ Architecture Diagrams

## 1. Multicloud Architecture - High Level

```mermaid
graph TB
    Client["🖥️ Cliente/Frontend"]
    
    subgraph AWS_Region["AWS us-east-1 (Santiago)"]
        ALB["Application Load Balancer"]
        ProductAPI["🟡 Product API Port: 3000<br/>(Santiago)"]
        ProductDB["PostgreSQL DB"]
    end
    
    subgraph GCP_Region["GCP us-central1"]
        subgraph GCP_Services["Cloud Run Services"]
            OrderAPI["🔵 Order API<br/>(Sebas)"]
            UserAPI["🟢 User API<br/>(Yécid)"]
        end
        VPC["VPC Network<br/>10.0.0.0/20"]
        MongoDB["MongoDB Atlas"]
    end
    
    Client -->|HTTPS| ALB
    ALB -->|Route| ProductAPI
    ProductAPI -->|SQL| ProductDB
    ProductAPI -->|HTTPS<br/>Inter-Cloud| OrderAPI
    OrderAPI -->|HTTPS<br/>Internal| UserAPI
    UserAPI -->|Mongoose| MongoDB
    OrderAPI -->|SQL| ProductDB
    
    style AWS_Region fill:#FF9900
    style GCP_Region fill:#4285F4
    style ProductAPI fill:#FFD700
    style OrderAPI fill:#87CEEB
    style UserAPI fill:#90EE90
```

## 2. Message Flow - Detallado

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AWS as AWS ALB
    participant PA as Product API<br/>(Santiago)
    participant OA as Order API<br/>(Sebas - GCP)
    participant UA as User API<br/>(Yécid - GCP)
    participant MDB as MongoDB Atlas

    C->>AWS: POST /api/v2/products/create
    AWS->>PA: Forwarded Request
    PA->>PA: Validar & Crear Producto
    
    PA->>OA: POST /api/v2/orders/message<br/>{ data: { product } }
    Note over OA: Inter-Cloud Call<br/>AWS→GCP
    
    OA->>OA: Crear Orden
    OA->>UA: POST /api/v2/users/message<br/>{ data: { product, order } }
    Note over UA: Internal Call<br/>GCP→GCP
    
    UA->>MDB: Buscar Usuario
    MDB-->>UA: Usuario
    UA->>UA: Enriquecer Body
    UA-->>OA: Response { product, order, user }
    
    OA->>OA: Procesar Respuesta
    OA-->>PA: Response { product, order, user }
    
    PA->>PA: Procesar Respuesta
    PA-->>AWS: Response
    AWS-->>C: RESPUESTA FINAL
```

## 3. Network Topology - GCP

```mermaid
graph TB
    subgraph GCP["GCP Cloud"]
        subgraph VPC["VPC: user-api-vpc<br/>10.0.0.0/20"]
            subgraph CloudRun["Cloud Run"]
                OrderAPI["Order API<br/>(Sebas)"]
                UserAPI["User API<br/>(Yécid)"]
            end
            
            VPCConnector["VPC Connector<br/>10.8.0.0/28"]
        end
        
        MongoDB["MongoDB Atlas<br/>managed.mongodb.com"]
        
        Firewall["Cloud Armor<br/>+ Firewall Rules"]
    end
    
    subgraph AWS["AWS us-east-1"]
        ProductAPI["Product API<br/>(Santiago)"]
    end
    
    Internet["☁️ Internet<br/>HTTPS"]
    
    ProductAPI -->|HTTPS Port 443| Internet
    Internet -->|HTTPS| Firewall
    Firewall -->|allow-from-aws| OrderAPI
    
    OrderAPI -->|Internal| VPCConnector
    VPCConnector -->|Internal| UserAPI
    
    UserAPI -->|Mongoose| MongoDB
    OrderAPI -->|Query<br/>via ALB| ProductAPI
    
    style GCP fill:#4285F4
    style AWS fill:#FF9900
    style VPC fill:#B3E5FC
    style Firewall fill:#FFC0CB
```

## 4. Cloud Run Deployment Architecture

```mermaid
graph TB
    subgraph GCP["GCP Cloud Run - us-central1"]
        subgraph CloudBuild["Cloud Build<br/>CI/CD Pipeline"]
            Repo["GitHub Repo"]
            Build["Build Stage"]
            Push["Push a Registry"]
        end
        
        subgraph Registry["Container Registry"]
            Image["user-api:latest<br/>gcr.io/project/user-api"]
        end
        
        subgraph CloudRun["Cloud Run"]
            Revision1["Revision N<br/>2 instances"]
            Revision2["Revision N-1<br/>2 instances"]
        end
        
        subgraph Services["Services"]
            LB["Load Balancer"]
            HPA["Auto-scaling<br/>Min:2, Max:10"]
        end
    end
    
    Repo -->|Trigger| Build
    Build -->|Multi-stage| Push
    Push -->|Deploy| Image
    Image -->|Pull| Revision1
    Image -->|Previous| Revision2
    
    LB -->|Route| Revision1
    Revision1 <-->|Monitor| HPA
    
    style CloudBuild fill:#FFF3E0
    style Registry fill:#E8F5E9
    style CloudRun fill:#E3F2FD
    style Services fill:#F3E5F5
```

## 5. Database Architecture

```mermaid
graph TB
    subgraph GCP_Cloud["GCP Cloud"]
        UserAPI["User API<br/>(Yécid)"]
        
        subgraph Atlas["MongoDB Atlas<br/>Managed Cloud"]
            Primary["Primary Node<br/>GCP us-central1"]
            Secondary["Secondary Node<br/>GCP us-east1"]
            Tertiary["Arbiter Node<br/>GCP europe-west1"]
        end
    end
    
    subgraph Backups["Backups & Recovery"]
        CloudStorage["Cloud Storage<br/>user-db-backups"]
    end
    
    UserAPI -->|Mongoose<br/>Connection Pool| Primary
    Primary -->|Replication| Secondary
    Primary -->|Heartbeat| Tertiary
    
    Primary -->|Daily Backup| CloudStorage
    
    style Atlas fill:#4CAF50
    style Backups fill:#FF9800
```

## 6. CI/CD Pipeline - Completo

```mermaid
graph LR
    A["👨‍💻 Developer<br/>Git Push"] -->|Tag v2.x.x| B["GitHub"]
    B -->|Webhook| C["Cloud Build"]
    
    C -->|1. Build| D["Docker Build<br/>user-api:v2.x.x"]
    D -->|2. Test| E["Unit Tests<br/>npm test"]
    E -->|✅ Pass| F["Push Image<br/>gcr.io/project"]
    
    F -->|3. Deploy Staging| G["Cloud Run<br/>user-api-staging"]
    G -->|4. Smoke Tests| H["Verify Health<br/>/health"]
    
    H -->|✅ OK| I["Deploy Production<br/>user-api"]
    H -->|❌ Fail| J["Rollback<br/>Previous Version"]
    
    I -->|5. Monitor| K["Cloud Logging<br/>+ Alerting"]
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#FFD700
    style F fill:#FFC0CB
    style I fill:#98FB98
    style J fill:#FFB6C6
```

## 7. Inter-Cloud Communication Security

```mermaid
graph TB
    Client["🖥️ Cliente"]
    
    subgraph AWS["AWS - Santiago<br/>Product API"]
        AWSAPI["API Endpoint"]
    end
    
    subgraph GCP2["GCP - Sebas<br/>Order API"]
        GCPAPI1["API Endpoint"]
        CORS1["CORS Whitelist"]
    end
    
    subgraph GCP3["GCP - Yécid<br/>User API"]
        GCPAPI2["API Endpoint"]
        CORS2["CORS Whitelist"]
    end
    
    Client -->|HTTPS<br/>TLS 1.3| AWSAPI
    AWSAPI -->|HTTPS<br/>Port 443<br/>X-API-Key| CORS1
    CORS1 -->|Validate Origin| GCPAPI1
    
    GCPAPI1 -->|HTTPS<br/>Firewall Rule<br/>allow-from-aws| CORS2
    CORS2 -->|Validate Origin| GCPAPI2
    
    style AWS fill:#FF9900
    style GCP2 fill:#4285F4
    style GCP3 fill:#4285F4
    style CORS1 fill:#FFC0CB
    style CORS2 fill:#FFC0CB
```

## 8. Monitoring & Observability Stack

```mermaid
graph TB
    subgraph Services["Services"]
        UserAPI["User API"]
        OrderAPI["Order API"]
        ProductAPI["Product API"]
    end
    
    subgraph Observability["GCP Observability"]
        Logs["Cloud Logging"]
        Traces["Cloud Trace"]
        Metrics["Cloud Monitoring"]
    end
    
    subgraph Tools["Visualization & Alerting"]
        Dashboard["Cloud Dashboard"]
        Alerts["Cloud Alerting"]
        PagerDuty["PagerDuty<br/>Notifications"]
    end
    
    UserAPI -->|Structured Logs| Logs
    OrderAPI -->|Traces| Traces
    ProductAPI -->|Metrics| Metrics
    
    Logs -->|Aggregate| Dashboard
    Traces -->|Visualize| Dashboard
    Metrics -->|Alert| Alerts
    
    Alerts -->|Notify| PagerDuty
    
    style Services fill:#E3F2FD
    style Observability fill:#FFF9C4
    style Tools fill:#F1F8E9
```

## 9. Disaster Recovery Plan

```mermaid
graph TB
    subgraph Primary["Primary - GCP us-central1"]
        UserAPI1["User API - Active"]
        DB1["MongoDB Primary"]
    end
    
    subgraph Secondary["Secondary - GCP us-east1"]
        UserAPI2["User API - Standby"]
        DB2["MongoDB Secondary"]
    end
    
    subgraph Backup["Backup - Cloud Storage"]
        Snapshots["Daily Snapshots"]
    end
    
    DB1 -->|Replication<br/>RPO: 5min| DB2
    Snapshots -->|Point-in-time<br/>recovery| DB1
    
    Traffic["User Traffic<br/>(via LB)"] -->|99.95%<br/>Availability| UserAPI1
    
    style Primary fill:#4CAF50
    style Secondary fill:#FFC107
    style Backup fill:#FF6F00
```

## Componentes Clave por Proveedor

### 🟡 AWS (Santiago)
- **Compute**: EC2 with Auto Scaling Group
- **Load Balancer**: Application Load Balancer (ALB)
- **Database**: RDS PostgreSQL (si aplica)
- **Networking**: VPC, Security Groups, NACLs
- **CDN**: CloudFront (opcional)

### 🔵 GCP (Yécid + Sebas)
- **Compute**: Cloud Run (serverless)
- **Orchestration**: Kubernetes (GKE) alternativa
- **Networking**: VPC, Cloud Armor
- **Database**: MongoDB Atlas + Cloud SQL
- **Observability**: Cloud Logging, Cloud Trace, Cloud Monitoring
- **Storage**: Cloud Storage para backups
- **Secret Management**: Secret Manager

### 🌐 Cross-Cloud
- **Communication**: HTTPS (TLS 1.3)
- **DNS**: Cloud DNS (GCP) + Route 53 (AWS)
- **Monitoring**: Cloud Monitoring (GCP)
- **CI/CD**: GitHub Actions + Cloud Build
