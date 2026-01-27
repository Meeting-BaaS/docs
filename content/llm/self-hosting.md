# self-hosting Documentation

Documentation for self-hosting.

## Configuration

Configure feature flags and environment variables for your deployment

### Source: ./content/docs/self-hosting/configuration.mdx


This guide explains how to configure Meeting BaaS v2 for your self-hosted deployment using feature flags and environment variables.

## Feature Flags Overview

Feature flags control which functionality is enabled in your deployment. All flags default to `false`, making minimal deployments straightforward.

### Feature Flag Reference

| Flag | Default | Description | Required Services |
|------|---------|-------------|-------------------|
| `SELF_HOSTED` | `false` | Enable self-hosted mode (simplified configuration) | - |
| `ENABLE_STRIPE` | `false` | Enable Stripe billing, subscriptions, and token system | Stripe account |
| `ENABLE_SVIX` | `false` | Enable SVIX managed webhooks (otherwise use direct callbacks) | SVIX instance |
| `ENABLE_CALENDAR` | `false` | Enable Google/Microsoft calendar integration | OAuth credentials |
| `ENABLE_MULTI_TENANT` | `false` | Enable multi-tenant mode (teams, multiple users) | - |
| `ENABLE_DASHBOARD` | `false` | Enable frontend dashboard (BFF and internal routes) | OAuth credentials |
| `ENABLE_TRANSCRIPTION` | `false` | Enable Gladia transcription service | Gladia API key |
| `ENABLE_EMAIL` | `false` | Enable Resend email notifications | Resend API key |

## Configuration Files

Feature flags are configured in your environment override files:

- `environment-overrides/api_server_v2_chart/prod.yaml` - API server configuration
- `environment-overrides/job_v2_chart/prod.yaml` - Background jobs configuration

## Deployment Modes

### Single-Tenant Self-Hosted (Minimal)

Perfect for organizations that need a single team with unlimited usage:

```yaml
# environment-overrides/api_server_v2_chart/prod.yaml
featureFlags:
  selfHosted: true
  enableStripe: false
  enableSvix: false
  enableCalendar: false
  enableMultitenant: false
  enableDashboard: false
  enableTranscription: false
  enableEmail: false

selfHosted:
  staticApiKey: "your-secure-api-key-here"
  staticTeamId: "your-team-id"
```

**What's Enabled**:
- Bot creation via `/v2/bots` endpoint
- Scheduled bots via `/v2/bots/scheduled` endpoint
- Direct webhook callbacks (via `callback_url` in bot config)
- Unlimited bot usage (no token billing)
- Recording and video artifacts

**What's Disabled**:
- SVIX managed webhooks
- Stripe billing and token system
- Calendar integration
- Frontend dashboard
- Email notifications
- Multi-tenant features (team creation, deletion, invitations)
- Team deletion background job

### Single-Tenant with Dashboard

For organizations that want the frontend dashboard without multi-tenancy:

```yaml
featureFlags:
  selfHosted: true
  enableMultitenant: false
  enableDashboard: true  # Enable dashboard
  enableStripe: false
  enableSvix: false
  enableCalendar: false
  enableTranscription: false
  enableEmail: false

selfHosted:
  staticApiKey: "your-secure-api-key-here"
  staticTeamId: "your-team-id"

dashboard:
  masterAdminEmail: "admin@yourcompany.com"  # User to auto-promote to admin
```

**Additional Requirements**:
- OAuth credentials (Google and/or GitHub)
- `BETTER_AUTH_SECRET` (authentication secret)

### Multi-Tenant Self-Hosted

For organizations that need multiple teams and user management:

```yaml
featureFlags:
  selfHosted: true
  enableMultitenant: true  # Enable multi-tenant
  enableDashboard: true    # Usually enabled with multi-tenant
  enableStripe: false     # Optional: enable for billing
  enableSvix: false
  enableCalendar: false
  enableTranscription: false
  enableEmail: false
```

**Note**: When `ENABLE_MULTI_TENANT=true`, you don't need `STATIC_API_KEY` or `STATIC_TEAM_ID`. Teams are created dynamically.

## Environment Variables

### Required Variables

These are always required, regardless of feature flags:

```yaml
secret:
  # Database
  database_url: "postgres://user:password@host:port/database"
  
  # Redis
  redis_url: "redis://user:password@host:port"
  
  # SQS Queues
  sqs_queue_url_zoom: "https://sqs.region.amazonaws.com/account/queue-name"
  sqs_queue_url_meet_teams: "https://sqs.region.amazonaws.com/account/queue-name"
  aws_access_key_id_sqs: "your-sqs-access-key"
  aws_secret_access_key_sqs: "your-sqs-secret-key"
  
  # S3 Storage
  aws_access_key_id: "your-s3-access-key"
  aws_secret_access_key: "your-s3-secret-key"
  
  # Bot encryption (for transcription API keys)
  bot_encryption_secret: "generate-a-random-32-byte-key"
```

### Optional Variables

These are only needed when specific features are enabled:

#### When ENABLE_DASHBOARD=true

```yaml
secret:
  better_auth_secret: "generate-a-random-secret"  # Required for dashboard
  google_id: "your-google-oauth-client-id"
  google_secret: "your-google-oauth-client-secret"
  github_id: "your-github-oauth-client-id"
  github_secret: "your-github-oauth-client-secret"

configmap:
  frontend_baseurl: "https://dashboard.yourcompany.com"
  trusted_origins: "https://yourcompany.com,https://dashboard.yourcompany.com"
```

#### When ENABLE_CALENDAR=true

```yaml
secret:
  calendar_credentials_key: "generate-a-random-32-byte-key"  # For encrypting OAuth tokens
  google_id: "your-google-oauth-client-id"
  google_secret: "your-google-oauth-client-secret"
  # Microsoft OAuth configured via Azure AD

configmap:
  api_server_baseurl: "https://api.yourcompany.com"  # Used for webhook URLs
```

#### When ENABLE_TRANSCRIPTION=true

```yaml
secret:
  gladia_api_key: "your-gladia-api-key"

configmap:
  aws_s3_audio_chunks_bucket: "your-audio-chunks-bucket"
```

#### When ENABLE_EMAIL=true

```yaml
secret:
  resend_api_key: "your-resend-api-key"

configmap:
  resend_email_from: "Meeting BaaS <noreply@yourcompany.com>"
  support_email: "support@yourcompany.com"
```

#### When ENABLE_SVIX=true

```yaml
secret:
  svix_jwt_secret: "your-svix-jwt-secret"

configmap:
  svix_url: "http://svix.services.svc.cluster.local:8071"  # Or external URL
```

#### When ENABLE_STRIPE=true

```yaml
secret:
  stripe_secret_key: "sk_live_..."
  stripe_webhook_secret: "whsec_..."

configmap:
  stripe_pro_subscription_product_id: "prod_..."
  stripe_pro_subscription_price_id: "price_..."
  # ... other Stripe product/price IDs
```

### ConfigMap Variables

Common configuration values:

```yaml
configmap:
  # Server configuration
  port: "3001"
  host: "0.0.0.0"
  node_env: "production"
  environ: "prod"
  log_level: "info"  # or "debug" for troubleshooting
  
  # API URLs
  api_server_baseurl: "https://api.yourcompany.com"
  frontend_baseurl: "https://dashboard.yourcompany.com"  # If dashboard enabled
  domain: ".yourcompany.com"
  trusted_origins: "https://yourcompany.com,https://api.yourcompany.com"
  
  # AWS/S3 Configuration
  aws_region: "us-east-1"
  aws_default_region: "us-east-1"
  aws_endpoint_url: "https://s3.us-east-1.amazonaws.com"
  aws_endpoint_url_sqs: "https://sqs.us-east-1.amazonaws.com"
  
  # S3 Buckets
  aws_s3_artifacts_bucket: "your-company-meeting-baas-artifacts"
  aws_s3_logs_bucket: "your-company-meeting-baas-logs"
  aws_s3_audio_chunks_bucket: "your-company-meeting-baas-audio-chunks"  # If transcription enabled
  aws_s3_logo_bucket: "your-company-meeting-baas-logo"  # Optional
  aws_s3_support_bucket: "your-company-meeting-baas-support"  # Optional
```

## Background Jobs Configuration

Background jobs are configured in `environment-overrides/job_v2_chart/prod.yaml`:

```yaml
featureFlags:
  enableCalendar: false      # Must match api_server_v2_chart
  enableMultitenant: false   # Must match api_server_v2_chart
  enableTranscription: false # Must match api_server_v2_chart
  enableEmail: false         # Must match api_server_v2_chart
```

**Important**: Job chart feature flags should match the API server chart flags.

### Jobs That Run

Based on feature flags:

**Always Running**:
- `scheduled-bot-job` - Creates bots for scheduled meetings (every minute)
- `data-retention-deletion-job` - Deletes old bot data (daily)

**When ENABLE_CALENDAR=true**:
- `calendar-bot-job` - Creates bots for calendar events (every minute)
- `microsoft-calendar-resubscription-job` - Renews Microsoft subscriptions (every 6 hours)
- `google-calendar-resubscription-job` - Renews Google subscriptions (every 6 hours)
- `calendar-materialization-job` - Materializes calendar events (daily)

**When ENABLE_MULTI_TENANT=true**:
- `team-permanent-deletion-job` - Deletes soft-deleted teams (daily at 9 AM UTC)

## Generating Secrets

### Bot Encryption Secret

```bash
# Generate 32-byte key (base64 encoded)
openssl rand -base64 32
```

### Calendar Credentials Key

```bash
# Generate 32-byte key (base64 encoded)
openssl rand -base64 32
```

### Better Auth Secret

```bash
# Generate random secret
openssl rand -hex 32
```

### Static API Key

For single-tenant mode, generate a secure API key:

```bash
# Generate random key (64 characters)
openssl rand -hex 32
```

Use this as your `STATIC_API_KEY` value.

## Configuration Checklist

Before deploying, verify:

### API Server Chart

- [ ] Feature flags set correctly
- [ ] `staticApiKey` set (if single-tenant)
- [ ] `staticTeamId` set (if single-tenant)
- [ ] `masterAdminEmail` set (if dashboard enabled)
- [ ] All required secrets filled in
- [ ] ConfigMap values updated (domain, URLs, etc.)
- [ ] Node selector matches your pool name
- [ ] Image repository points to your registry

### Job Chart

- [ ] Feature flags match API server chart
- [ ] Database URL set
- [ ] Required secrets filled in (based on enabled features)
- [ ] Node selector matches your pool name
- [ ] Image repository points to your registry

### Bot Charts

- [ ] Node selector matches bots pool name
- [ ] SQS queue URLs set
- [ ] S3 bucket names set
- [ ] Image repository points to your registry

### Video Device Plugin

- [ ] Node selector matches bots pool name
- [ ] Image repository points to your registry

## Environment-Specific Configuration

### Development/Staging

```yaml
configmap:
  log_level: "debug"
  environ: "dev"
  api_server_baseurl: "https://api-dev.yourcompany.com"
```

### Production

```yaml
configmap:
  log_level: "info"
  environ: "prod"
  api_server_baseurl: "https://api.yourcompany.com"
```

## Next Steps

- [Deployment](/docs/self-hosting/deployment) - Deploy the platform using the provided scripts
- [Upgrades](/docs/self-hosting/upgrades) - Learn how to upgrade your deployment


---

## Deployment

Deploy Meeting BaaS v2 to your Kubernetes cluster

### Source: ./content/docs/self-hosting/deployment.mdx


This guide walks you through deploying Meeting BaaS v2 to your Kubernetes cluster using the provided Helm charts and deployment scripts.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Infrastructure is set up (Kubernetes, database, Redis, S3, SQS)
- [ ] Repository structure is created with Helm charts submodule
- [ ] Environment override files are configured
- [ ] All secrets and config values are filled in
- [ ] DNS records point to your ingress IP
- [ ] Kubernetes cluster is accessible via `kubectl`
- [ ] Container images are accessible (either from Meeting BaaS registry or your own)

## Step 1: Apply Kubernetes Resources

First, apply the certificate issuer and certificate:

```bash
# Apply cluster issuer
kubectl apply -f k8s-resources/prod-certs/cluster-issuer.yaml

# Apply certificate
kubectl apply -f k8s-resources/prod-certs/cluster-certificate.yaml

# Verify certificate is issued (may take a few minutes)
kubectl get certificate -n services
```

## Step 2: Pull and Push Images (If Using Your Own Registry)

If you're mirroring images to your own registry:

```bash
# Set image tag (provided by Meeting BaaS)
export IMAGE_TAG=2026-01-27abc123def456...

# Login to Meeting BaaS registry (credentials provided)
docker login rg.fr-par.scw.cloud

# Pull images
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-api-server/api-server-v2:$IMAGE_TAG
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-bots/zoom-bots-v2:$IMAGE_TAG
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-bots/meet-teams-bots-v2:$IMAGE_TAG
docker pull rg.fr-par.scw.cloud/baas-bots-preprod/video-device-plugin:1.0.0

# Tag for your registry
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-api-server/api-server-v2:$IMAGE_TAG \
  YOUR_REGISTRY/api-server-v2:$IMAGE_TAG
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-bots/zoom-bots-v2:$IMAGE_TAG \
  YOUR_REGISTRY/zoom-bots-v2:$IMAGE_TAG
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-bots/meet-teams-bots-v2:$IMAGE_TAG \
  YOUR_REGISTRY/meet-teams-bots-v2:$IMAGE_TAG
docker tag rg.fr-par.scw.cloud/baas-bots-preprod/video-device-plugin:1.0.0 \
  YOUR_REGISTRY/video-device-plugin:1.0.0

# Login to your registry
docker login YOUR_REGISTRY

# Push images
docker push YOUR_REGISTRY/api-server-v2:$IMAGE_TAG
docker push YOUR_REGISTRY/zoom-bots-v2:$IMAGE_TAG
docker push YOUR_REGISTRY/meet-teams-bots-v2:$IMAGE_TAG
docker push YOUR_REGISTRY/video-device-plugin:1.0.0
```

**Note**: If you have direct access to Meeting BaaS registry, you can skip this step and use the images directly.

## Step 3: Set Up Deployment Script

Make the deployment script executable:

```bash
chmod +x helm-charts/baas_controller.sh
```

Configure your environment:

```bash
# Set environment (prod or preprod)
export ENVIRON=prod

# Set image tag
export IMAGE_TAG=2026-01-27abc123def456...
```

## Step 4: Deploy Video Device Plugin

The video device plugin must be deployed first as it provides the video device resources that bot pods require:

```bash
cd helm-charts

# Install video device plugin
export ENVIRON=prod
export IMAGE_TAG=1.0.0  # Video device plugin uses fixed version
./baas_controller.sh video-device-plugin install
```

**Verify**:

```bash
kubectl get daemonset -n services video-device-plugin
kubectl get nodes -o jsonpath='{.items[*].status.allocatable.meeting-baas\.io/video-devices}'
```

You should see video devices available on bot pool nodes.

## Step 5: Deploy API Server

Deploy the API server (this also sets up the database schema via migration job):

```bash
cd helm-charts

export ENVIRON=prod
export IMAGE_TAG=2026-01-27abc123def456...

# Install API server
./baas_controller.sh api-v2 install
```

**What Happens**:

1. Helm creates a migration Job (pre-install hook)
2. Migration Job runs database migrations
3. Migration Job completes successfully
4. Helm creates the API server Deployment
5. API server starts and runs bootstrap operations:
   - Creates self-hosted team (if `SELF_HOSTED=true` and `ENABLE_MULTI_TENANT=false`)
   - Promotes master admin (if `ENABLE_DASHBOARD=true` and `MASTER_ADMIN_EMAIL` set)
   - Syncs event types to SVIX (if `ENABLE_SVIX=true`)

**Verify**:

```bash
# Check migration job
kubectl get jobs -n services | grep migration

# Check API server pods
kubectl get pods -n services -l app.kubernetes.io/instance=api-server-v2

# Check API server logs
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=50

# Test health endpoint
curl https://api.yourcompany.com/health
```

## Step 6: Deploy Background Jobs

Deploy the background jobs (CronJobs):

```bash
cd helm-charts

export ENVIRON=prod
export IMAGE_TAG=2026-01-27abc123def456...  # Same as API server

# Install jobs
./baas_controller.sh job-v2 install
```

**Verify**:

```bash
# Check CronJobs
kubectl get cronjobs -n services

# Check which jobs are created (based on feature flags)
kubectl get cronjobs -n services -o name

# Should see:
# - scheduled-bot-job (always)
# - data-retention-deletion-job (always)
# - calendar-bot-job (if ENABLE_CALENDAR=true)
# - team-permanent-deletion-job (if ENABLE_MULTI_TENANT=true)
# etc.
```

## Step 7: Deploy Bot Services

Deploy the bot services (they scale to zero initially):

```bash
cd helm-charts

export ENVIRON=prod
export IMAGE_TAG=2026-01-27abc123def456...  # Same as API server

# Install Zoom bots
./baas_controller.sh zoom-bots-v2 install

# Install Meet/Teams bots
./baas_controller.sh meet-teams-bots-v2 install
```

**Verify**:

```bash
# Check ScaledJobs (KEDA)
kubectl get scaledjobs -n services

# Check bot pods (should be 0 initially)
kubectl get pods -n services -l app.kubernetes.io/instance=zoom-bots-v2
kubectl get pods -n services -l app.kubernetes.io/instance=meet-teams-bots-v2
```

## Step 8: Verify Deployment

### Check All Services

```bash
# List all deployments
kubectl get deployments -n services

# List all CronJobs
kubectl get cronjobs -n services

# List all ScaledJobs
kubectl get scaledjobs -n services

# List DaemonSets
kubectl get daemonsets -n services
```

### Test API Endpoints

```bash
# Health check
curl https://api.yourcompany.com/health

# Feature flags status
curl https://api.yourcompany.com/status/features

# Configuration endpoint (if dashboard enabled)
curl https://api.yourcompany.com/v2-internal/configuration
```

### Check Logs

```bash
# API server logs
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=100

# Check for bootstrap messages
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 | grep bootstrap

# Check for errors
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 | grep -i error
```

### Test Bot Creation

```bash
# Test creating a bot (single-tenant mode)
curl -X POST https://api.yourcompany.com/v2/bots \
  -H "Content-Type: application/json" \
  -H "x-meeting-baas-api-key: YOUR_STATIC_API_KEY" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Test Bot"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "bot_id": "...",
    "status": "queued",
    ...
  }
}
```

## Step 9: Monitor Initial Jobs

Watch the first scheduled bot job run:

```bash
# Watch scheduled bot job
kubectl get jobs -n services -w | grep scheduled-bot-job

# Check job logs
kubectl logs -n services -l cron=scheduled-bot-job --tail=50
```

## Common Deployment Issues

### Migration Job Failed

```bash
# Check migration job logs
kubectl logs -n services -l app.kubernetes.io/component=migration --tail=100

# Common causes:
# - Database connection issues
# - Insufficient database permissions
# - Network connectivity problems
```

### API Server Not Starting

```bash
# Check pod status
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2

# Check logs
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=100

# Common causes:
# - Missing secrets
# - Invalid configuration values
# - Database connection issues
```

### Ingress Not Working

```bash
# Check ingress
kubectl get ingress -n services

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check certificate status
kubectl describe certificate -n services api-meeting-baas-tls
```

## Post-Deployment

### Enable Auto-Scaling (Optional)

If you want the API server to auto-scale:

```yaml
# environment-overrides/api_server_v2_chart/prod.yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 80
```

Then upgrade:

```bash
./baas_controller.sh api-v2 upgrade
```

### Set Up Monitoring (Optional)

Consider setting up:
- Prometheus for metrics
- Grafana for dashboards
- Alerting for critical issues

### Set Up Log Aggregation (Optional)

Consider setting up:
- Centralized logging (Loki, ELK stack)
- Log retention policies
- Log analysis tools

## Next Steps

- [Upgrades](/docs/self-hosting/upgrades) - Learn how to upgrade your deployment
- [Troubleshooting](/docs/self-hosting/troubleshooting) - Common issues and solutions


---

## Self Hosting Overview

Deploy Meeting BaaS v2 in your own infrastructure with full control

### Source: ./content/docs/self-hosting/index.mdx


Meeting BaaS v2 supports self-hosted deployments, allowing you to run the platform in your own infrastructure with configurable feature flags. This gives you full control over your deployment while maintaining compatibility with the SaaS version.

## What You Get

When you self-host Meeting BaaS v2, you receive:

- **Container Images**: Pre-built Docker images for:
  - API Server (used for both API server and background jobs)
  - Zoom Bots (`zoom-bots-v2`)
  - Meet/Teams Bots (`meet-teams-bots-v2`)
  - Video Device Plugin (custom Kubernetes device plugin for v4l2 devices)

- **Helm Charts**: Production-ready Kubernetes Helm charts via the `kubernetes-config` repository
- **Deployment Scripts**: CLI tools for easy deployment and upgrades
- **Documentation**: Complete setup and configuration guides

## Deployment Architecture

Meeting BaaS v2 is designed to run on Kubernetes with the following components:

- **API Server**: Handles API requests, authentication, and business logic
- **Background Jobs**: CronJobs for scheduled tasks (bot creation, data retention, calendar sync)
- **Bot Pods**: Scalable pods that join meetings and record them
- **Video Device Plugin**: DaemonSet that provisions virtual video devices (v4l2loopback) for bots

### Component Interaction

The following diagram illustrates how the API server, bot pods, and video device plugin interact:

<Mermaid
  chart="
graph TB
    subgraph K8s[Kubernetes Cluster]
        API[API Server]
        Jobs[Background Jobs]
        Bot[Bot Pods]
        VDP[Video Device Plugin]
    end
    
    SQS[SQS Queue]
    S3[S3 Storage]
    DB[(PostgreSQL)]
    Redis[(Redis)]
    Zoom[Zoom]
    Meet[Google Meet]
    Teams[Microsoft Teams]
    
    API -->|Creates jobs| SQS
    API -->|Reads/Writes| DB
    API -->|Locks| Redis
    
    Jobs -->|Scheduled jobs| SQS
    Jobs -->|Data retention| DB
    
    SQS -->|Consumes| Bot
    VDP -->|Provides devices| Bot
    
    Bot -->|Joins meetings| Zoom
    Bot -->|Joins meetings| Meet
    Bot -->|Joins meetings| Teams
    Bot -->|Uploads| S3
"
/>

**How It Works**:

1. **API Server** receives bot creation requests and enqueues jobs to **SQS**
2. **Background Jobs** (CronJobs) also create bot jobs in **SQS** for scheduled meetings
3. **Bot Pods** (auto-scaled via KEDA) consume jobs from **SQS**
4. **Video Device Plugin** (DaemonSet) runs on bot pool nodes and provisions virtual video devices (`/dev/video*`) that bot pods require
5. **Bot Pods** use the video devices to join meetings on **Zoom**, **Google Meet**, or **Microsoft Teams**
6. **Bot Pods** record meetings and upload recordings to **S3**
7. **API Server** manages all metadata in **PostgreSQL** and uses **Redis** for deduplication

## Feature Flags

The platform uses feature flags to enable/disable functionality, making it easy to deploy only what you need:

| Flag | Description |
|------|-------------|
| `SELF_HOSTED` | Enable self-hosted mode (simplified configuration) |
| `ENABLE_STRIPE` | Enable Stripe billing and token system |
| `ENABLE_SVIX` | Enable SVIX managed webhooks |
| `ENABLE_CALENDAR` | Enable Google/Microsoft calendar integration |
| `ENABLE_MULTI_TENANT` | Enable multi-tenant mode (teams, multiple users) |
| `ENABLE_DASHBOARD` | Enable frontend dashboard (BFF and internal routes) |
| `ENABLE_TRANSCRIPTION` | Enable Gladia transcription service |
| `ENABLE_EMAIL` | Enable Resend email notifications |

All flags default to `false`, making minimal deployments straightforward.

## Deployment Modes

### Single-Tenant (Simplest)

Perfect for organizations that need a single team with unlimited usage:

- Static API key authentication
- No billing system
- Direct webhook callbacks (no SVIX needed)
- Single team with enterprise-level limits

### Multi-Tenant

For organizations that need multiple teams and user management:

- Team-based access control
- User invitations and management
- Per-team rate limits and quotas
- Optional Stripe billing integration

### With Dashboard

Add the frontend dashboard for a complete UI experience:

- Web-based bot management
- User authentication via OAuth
- Team management interface
- Usage analytics and monitoring

## Quick Start

1. **Review Prerequisites**: Ensure you have the required infrastructure
2. **Set Up Repository**: Clone the Helm charts and create your environment overrides
3. **Configure**: Set up environment variables and feature flags
4. **Deploy**: Use the provided deployment scripts to install the platform
5. **Upgrade**: Use CI/CD-friendly upgrade process for updates

## Next Steps

- [Prerequisites](/docs/self-hosting/prerequisites) - Infrastructure and requirements
- [Infrastructure Setup](/docs/self-hosting/infrastructure-setup) - Set up your Kubernetes cluster and services
- [Repository Setup](/docs/self-hosting/repository-setup) - Configure the Helm charts repository
- [Configuration](/docs/self-hosting/configuration) - Configure feature flags and environment variables
- [Deployment](/docs/self-hosting/deployment) - Deploy the platform
- [Upgrades](/docs/self-hosting/upgrades) - Keep your deployment up to date
- [Troubleshooting](/docs/self-hosting/troubleshooting) - Common issues and solutions


---

## Infrastructure Setup

Set up your Kubernetes cluster, databases, and services

### Source: ./content/docs/self-hosting/infrastructure-setup.mdx


This guide walks you through setting up the infrastructure required for Meeting BaaS v2.

## Architecture Overview

The following diagram illustrates the complete infrastructure architecture for Meeting BaaS v2:

```mermaid
flowchart TB
    subgraph Internet
        Users[Users/API Clients]
        MeetingPlatforms[Meeting Platforms<br/>Zoom, Google Meet, MS Teams]
    end

    subgraph DNS
        Domain[api.yourcompany.com]
    end

    subgraph "Kubernetes Cluster"
        subgraph Ingress["Ingress Layer"]
            LB[LoadBalancer<br/>External IP]
            NGINX[NGINX Ingress Controller]
            CertManager[cert-manager<br/>Let's Encrypt SSL]
        end

        subgraph APIPool["API Server Node Pool<br/>(2-4 CPU, 4-8GB RAM, Auto-scale: 1-3 nodes)"]
            API1[API Server Pod 1]
            API2[API Server Pod 2]
            API3[API Server Pod 3]

            subgraph CronJobs["Background CronJobs"]
                ScheduledBot[Scheduled Bot Job<br/>Every minute]
                CalendarSync[Calendar Sync Job<br/>6 hours]
                DataRetention[Data Retention Job<br/>Daily]
                TeamCleanup[Team Cleanup Job<br/>Daily]
            end
        end

        subgraph BotPool["Bot Node Pool<br/>(16+ CPU, 32GB+ RAM, Auto-scale: 0-10+ nodes)"]
            VideoPlugin[Video Device Plugin<br/>DaemonSet]

            subgraph ZoomBots["Zoom Bots<br/>(KEDA ScaledJob)"]
                ZBot1[Zoom Bot Pod 1]
                ZBot2[Zoom Bot Pod 2]
                ZBotN[Zoom Bot Pod N]
            end

            subgraph MeetTeamsBots["Meet/Teams Bots<br/>(KEDA ScaledJob)"]
                MTBot1[Meet/Teams Bot Pod 1]
                MTBot2[Meet/Teams Bot Pod 2]
                MTBotN[Meet/Teams Bot Pod N]
            end
        end
    end

    subgraph "External Services"
        subgraph Database["PostgreSQL 14+"]
            DB[(Main Database<br/>Users, Teams, Bots,<br/>API Keys, Configs)]
        end

        subgraph Cache["Redis 6.0+"]
            Redis[(Session Store<br/>Locks, Cache)]
        end

        subgraph Storage["S3-Compatible Object Storage"]
            S3Artifacts[artifacts bucket<br/>Recordings]
            S3Logs[logs bucket<br/>Bot logs]
            S3Audio[audio-chunks bucket<br/>Transcription]
            S3Logo[logo bucket<br/>Team logos]
        end

        subgraph Queue["SQS-Compatible Message Queues"]
            SQSZoom[zoom queue<br/>Zoom bot jobs]
            SQSMeet[meet-teams queue<br/>Meet/Teams bot jobs]
        end

        subgraph Optional["Optional Services"]
            EFS[EFS/NFS<br/>Redundant storage]
            Gladia[Gladia API<br/>Transcription]
            Stripe[Stripe<br/>Billing]
            Email[Resend<br/>Email]
        end
    end

    %% User flows
    Users -->|HTTPS| Domain
    Domain -->|DNS A Record| LB
    LB --> NGINX
    NGINX -->|TLS Termination| API1
    NGINX --> API2
    NGINX --> API3

    %% SSL certificate management
    CertManager -.->|Issues & Renews<br/>SSL Certs| NGINX

    %% API Server connections
    API1 <-->|Read/Write| DB
    API2 <-->|Read/Write| DB
    API3 <-->|Read/Write| DB

    API1 <-->|Sessions/Locks| Redis
    API2 <-->|Sessions/Locks| Redis
    API3 <-->|Sessions/Locks| Redis

    API1 -->|Send Jobs| SQSZoom
    API1 -->|Send Jobs| SQSMeet
    API2 -->|Send Jobs| SQSZoom
    API2 -->|Send Jobs| SQSMeet
    API3 -->|Send Jobs| SQSZoom
    API3 -->|Send Jobs| SQSMeet

    %% CronJob connections
    ScheduledBot <-->|Create scheduled<br/>bot jobs| DB
    ScheduledBot -->|Queue bot jobs| SQSZoom
    ScheduledBot -->|Queue bot jobs| SQSMeet
    CalendarSync <-->|Sync calendar events| DB
    DataRetention <-->|Delete old data| DB
    DataRetention -->|Delete old files| S3Artifacts
    TeamCleanup <-->|Cleanup soft-deleted| DB

    %% Bot scaling
    SQSZoom -->|KEDA monitors<br/>queue depth| ZoomBots
    SQSMeet -->|KEDA monitors<br/>queue depth| MeetTeamsBots

    %% Video device plugin
    VideoPlugin -.->|Provides virtual<br/>video devices| ZoomBots
    VideoPlugin -.->|Provides virtual<br/>video devices| MeetTeamsBots

    %% Bot operations
    ZBot1 -->|Receive jobs| SQSZoom
    ZBot2 -->|Receive jobs| SQSZoom
    ZBotN -->|Receive jobs| SQSZoom

    MTBot1 -->|Receive jobs| SQSMeet
    MTBot2 -->|Receive jobs| SQSMeet
    MTBotN -->|Receive jobs| SQSMeet

    ZBot1 <-->|Join & Record| MeetingPlatforms
    ZBot2 <-->|Join & Record| MeetingPlatforms
    MTBot1 <-->|Join & Record| MeetingPlatforms
    MTBot2 <-->|Join & Record| MeetingPlatforms

    ZBot1 -->|Upload recordings| S3Artifacts
    ZBot1 -->|Upload logs| S3Logs
    ZBot2 -->|Upload recordings| S3Artifacts
    MTBot1 -->|Upload recordings| S3Artifacts
    MTBot1 -->|Upload logs| S3Logs
    MTBot2 -->|Upload recordings| S3Artifacts

    ZBot1 <-->|Store metadata| DB
    ZBot2 <-->|Store metadata| DB
    MTBot1 <-->|Store metadata| DB
    MTBot2 <-->|Store metadata| DB

    %% Optional services
    ZBot1 -.->|Transcription| Gladia
    MTBot1 -.->|Transcription| Gladia
    API1 -.->|Billing| Stripe
    API1 -.->|Notifications| Email
    ZBot1 -.->|Backup storage| EFS
    MTBot1 -.->|Backup storage| EFS

    classDef kubernetes fill:#326ce5,stroke:#fff,stroke-width:2px,color:#fff
    classDef external fill:#ff9900,stroke:#fff,stroke-width:2px,color:#fff
    classDef optional fill:#888,stroke:#fff,stroke-width:2px,color:#fff
    classDef ingress fill:#00758f,stroke:#fff,stroke-width:2px,color:#fff

    class APIPool,BotPool,CronJobs,ZoomBots,MeetTeamsBots kubernetes
    class Database,Cache,Storage,Queue external
    class Optional,EFS,Gladia,Stripe,Email optional
    class Ingress,LB,NGINX,CertManager ingress
```

### Key Architecture Components

**Kubernetes Cluster**:
- **API Server Pool**: Runs API servers and background CronJobs with horizontal pod autoscaling
- **Bot Node Pool**: Runs bot pods that join and record meetings, scales from 0 to 10+ nodes based on demand
- **Ingress Layer**: NGINX Ingress Controller with cert-manager for automatic SSL/TLS certificate management

**External Services**:
- **PostgreSQL**: Central database for all persistent data (users, teams, bots, configurations)
- **Redis**: Session storage, distributed locks, and caching
- **S3 Object Storage**: Stores recordings, logs, audio chunks, and assets
- **SQS Message Queues**: Decouples API from bot execution, enables elastic auto-scaling

**Data Flow**:
1. Users make API requests via HTTPS to your domain
2. DNS routes to the Kubernetes LoadBalancer
3. NGINX Ingress terminates SSL and routes to API server pods
4. API servers process requests, store data in PostgreSQL/Redis
5. When a bot is needed, API servers send jobs to SQS queues
6. KEDA monitors SQS queue depth and scales bot pods automatically
7. Bot pods receive jobs, join meetings, record, and upload to S3
8. Background CronJobs handle scheduled tasks, calendar sync, and data retention

## Kubernetes Cluster Setup

### 1. Create Node Pools

Create two node pools in your Kubernetes cluster:

#### API Server Pool

```bash
# Example for Scaleway Kapsule
scw k8s pool create \
  cluster-id=YOUR_CLUSTER_ID \
  name=api-server-pool \
  node-type=GP1-XS \
  size=2 \
  autoscaling=true \
  min-size=1 \
  max-size=3
```

**Configuration**:
- **Node Type**: General purpose (2-4 CPU, 4-8GB RAM)
- **Initial Size**: 1-2 nodes
- **Auto-scaling**: Enabled (min: 1, max: 3-5)
- **Labels**: `k8s.scaleway.com/pool-name=api-server-pool`

#### Bot Pool

```bash
scw k8s pool create \
  cluster-id=YOUR_CLUSTER_ID \
  name=bots-pool \
  node-type=DEV1-L \
  size=0 \
  autoscaling=true \
  min-size=0 \
  max-size=10
```

**Configuration**:
- **Node Type**: High-performance (16+ CPU, 32GB+ RAM)
- **Initial Size**: 0 nodes (scales based on demand)
- **Auto-scaling**: Enabled (min: 0, max: 10+)
- **Labels**: `k8s.scaleway.com/pool-name=bots-pool`

### 2. Install Ingress Controller

Install NGINX Ingress Controller:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 3. Install cert-manager (for SSL/TLS)

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

### 4. Create Namespace

```bash
kubectl create namespace services
```

## Database Setup

### PostgreSQL

Create a PostgreSQL database (version 14+):

**Required Databases**:
- Main database for Meeting BaaS v2

**Connection String Format**:
```
postgres://username:password@host:port/database_name
```

**Recommended Settings**:
- **Encoding**: UTF8
- **Timezone**: UTC
- **Max Connections**: 100+ (adjust based on your API server replica count)
- **Backup**: Enable automated backups

**Security**:
- Use strong passwords
- Restrict network access to Kubernetes cluster IPs only
- Enable SSL/TLS connections

## Redis Setup

Create a Redis instance:

**Configuration**:
- **Version**: 6.0+ or 7.0+
- **Memory**: 1GB+ (adjust based on usage)
- **Persistence**: Optional (AOF recommended for production)
- **TLS**: Enable if available

**Connection String Format**:
```
redis://username:password@host:port
# Or with TLS
rediss://username:password@host:port
```

**Security**:
- Use strong passwords
- Restrict network access to Kubernetes cluster IPs only
- Enable TLS if supported

## Object Storage (S3) Setup

### Create Buckets

Create the following buckets in your S3-compatible storage:

```bash
# Artifacts bucket (recordings)
aws s3 mb s3://your-company-meeting-baas-artifacts

# Logs bucket
aws s3 mb s3://your-company-meeting-baas-logs

# Audio chunks bucket (if transcription enabled)
aws s3 mb s3://your-company-meeting-baas-audio-chunks

# Logo bucket (optional)
aws s3 mb s3://your-company-meeting-baas-logo

# Support bucket (optional)
aws s3 mb s3://your-company-meeting-baas-support
```

### Configure CORS

Set up CORS for the artifacts bucket to allow direct downloads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

### Create Access Keys

Create IAM user or access keys with permissions:
- `s3:GetObject` - Read artifacts
- `s3:PutObject` - Upload recordings
- `s3:DeleteObject` - Delete old data
- `s3:ListBucket` - List objects

## Message Queue (SQS) Setup

### Create Queues

Create two SQS queues:

```bash
# Zoom bots queue
aws sqs create-queue \
  --queue-name meeting-baas-zoom \
  --attributes VisibilityTimeout=3600

# Meet/Teams bots queue
aws sqs create-queue \
  --queue-name meeting-baas-meet-teams \
  --attributes VisibilityTimeout=3600
```

**Queue Configuration**:
- **Visibility Timeout**: 3600 seconds (1 hour) - matches bot recording duration
- **Message Retention**: 14 days (default)
- **Dead Letter Queue**: Recommended for failed messages

### Create Access Keys

Create IAM user or access keys with permissions:
- `sqs:SendMessage` - Send bot jobs
- `sqs:ReceiveMessage` - Receive bot jobs
- `sqs:DeleteMessage` - Delete processed jobs
- `sqs:GetQueueAttributes` - Check queue depth

## Optional: EFS/NFS Server Setup

### Option 1: AWS EFS

```bash
# Create EFS file system
aws efs create-file-system \
  --creation-token meeting-baas-efs \
  --performance-mode generalPurpose \
  --throughput-mode provisioned \
  --provisioned-throughput-in-mibps 100

# Create mount targets in each availability zone
aws efs create-mount-target \
  --file-system-id fs-xxxxx \
  --subnet-id subnet-xxxxx \
  --security-groups sg-xxxxx
```

### Option 2: NFS Server on Elastic Metal/VM

Set up an NFS server:

```bash
# Install NFS server
sudo apt-get install nfs-kernel-server

# Create shared directory
sudo mkdir -p /shared
sudo chown nobody:nogroup /shared
sudo chmod 777 /shared

# Configure exports
echo "/shared *(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports
sudo exportfs -a
```

**NFS Configuration**:
- **Version**: NFSv4 recommended
- **Options**: `vers=4,soft,timeo=30,retrans=3`
- **Security**: Restrict access to Kubernetes cluster IPs

## DNS Configuration

### Create DNS Records

Point your domain to the Kubernetes ingress:

```bash
# Get ingress IP
kubectl get svc -n ingress-nginx ingress-nginx-controller

# Create A record
# api.yourcompany.com -> <INGRESS_IP>
```

### Verify DNS

```bash
dig api.yourcompany.com
# Should return your ingress IP
```

## Video Device Plugin Requirements

The video device plugin requires:

- **Kernel modules**: `v4l2loopback` (loaded automatically by the plugin)
- **Privileged access**: Plugin runs as DaemonSet with privileged security context
- **Node labels**: Bot pool nodes must be labeled correctly

The plugin automatically:
- Loads `v4l2loopback` kernel module
- Creates virtual video devices
- Exposes them as Kubernetes resources (`meeting-baas.io/video-devices`)

## Security Considerations

### Network Security

- **Database**: Restrict access to Kubernetes cluster IPs only
- **Redis**: Restrict access to Kubernetes cluster IPs only
- **S3**: Use IAM policies to restrict bucket access
- **SQS**: Use IAM policies to restrict queue access

### Secrets Management

- Store sensitive credentials in Kubernetes Secrets (not in code)
- Use external secret management (AWS Secrets Manager, HashiCorp Vault) if available
- Rotate credentials regularly

### Pod Security

- Use Pod Security Standards (Restricted where possible)
- Video device plugin requires privileged access (unavoidable for v4l2)
- Bot pods require elevated capabilities for video device access

## Resource Planning

### API Server Pool

**Per Node**:
- CPU: 2-4 cores
- Memory: 4-8GB
- Storage: 20GB (for container images)

**Total** (3 nodes):
- CPU: 6-12 cores
- Memory: 12-24GB

### Bot Pool

**Per Node**:
- CPU: 16+ cores
- Memory: 32GB+
- Storage: 100GB+ (for container images and temporary files)

**Scaling**:
- Starts at 0 nodes
- Scales up based on SQS queue depth
- Each bot pod uses 1.5-4 CPU cores and 3-8GB RAM

## Verification Checklist

Before proceeding to repository setup, verify:

- [ ] Kubernetes cluster is accessible via `kubectl`
- [ ] Two node pools created (API server and bots)
- [ ] Ingress controller installed and has external IP
- [ ] cert-manager installed
- [ ] PostgreSQL database created and accessible
- [ ] Redis instance created and accessible
- [ ] S3 buckets created with proper permissions
- [ ] SQS queues created
- [ ] DNS records pointing to ingress IP
- [ ] EFS/NFS server set up (optional)
- [ ] All credentials documented securely

## Next Steps

- [Repository Setup](/docs/self-hosting/repository-setup) - Clone Helm charts and create environment overrides
- [Configuration](/docs/self-hosting/configuration) - Configure feature flags and environment variables


---

## Prerequisites

Infrastructure and requirements for self-hosting Meeting BaaS v2

### Source: ./content/docs/self-hosting/prerequisites.mdx


Before deploying Meeting BaaS v2, ensure you have the following infrastructure and tools in place.

## Infrastructure Requirements

### Kubernetes Cluster

You need a Kubernetes cluster (1.24+) with at least **2 node pools**:

#### API Server Pool
- **Purpose**: Runs API server pods and background job CronJobs
- **Recommended**: 1-3 nodes
- **Node Type**: General purpose (2-4 CPU, 4-8GB RAM per node)
- **Scaling**: Can use Horizontal Pod Autoscaler (HPA) for auto-scaling

#### Bot Pool
- **Purpose**: Runs bot pods that join and record meetings
- **Recommended**: 0-10+ nodes (scales based on demand)
- **Node Type**: High-performance (16+ CPU, 32GB+ RAM per node)
- **Scaling**: Uses KEDA for auto-scaling based on SQS queue depth
- **Special Requirements**: Requires video device plugin for v4l2 devices

### Database

**PostgreSQL 14+** database for storing:
- User accounts and authentication
- Team and organization data
- Bot configurations and metadata
- API keys and permissions
- Calendar connections (if enabled)
- Webhook configurations (if SVIX enabled)

**Recommended**: Managed PostgreSQL service (AWS RDS, Scaleway RDB, etc.)

### Object Storage

**S3-compatible object storage** for:
- Recorded video/audio files
- Bot logs and artifacts
- Team logos
- Support attachments

**Required Buckets**:
- `artifacts` - Recorded videos and audio
- `logs` - Bot execution logs
- `audio-chunks` - Temporary audio chunks (if transcription enabled)
- `logo` - Team logos (optional)
- `support` - Support ticket attachments (optional)

**Recommended**: AWS S3, Scaleway Object Storage, or any S3-compatible service

### Message Queue

**SQS-compatible message queue** for bot orchestration:
- Bot creation requests
- Job scheduling
- Event processing

**Required Queues**:
- `zoom` - Zoom bot jobs
- `meet-teams` - Google Meet and Microsoft Teams bot jobs

**Recommended**: AWS SQS, Scaleway Message Queue (MNQ), or any SQS-compatible service

### Redis

**Redis instance** for:
- Deduplication locks
- Session storage (if dashboard enabled)
- Caching

**Recommended**: Managed Redis service (AWS ElastiCache, Scaleway Redis Cloud, etc.)

### Optional: EFS/NFS Server

**Network File System** for bot data persistence:
- Acts as redundancy layer if S3 upload fails
- Temporary storage for recordings before upload
- Debug artifact collection

**Note**: This is optional but recommended for production deployments.

## Container Registry

You'll need access to:
- **Meeting BaaS Container Registry**: To pull images (we provide access)
- **Your Own Container Registry**: To push images if you want to mirror them

Images provided:
- `api-server-v2` - API server and jobs
- `zoom-bots-v2` - Zoom meeting bots
- `meet-teams-bots-v2` - Google Meet and Microsoft Teams bots
- `video-device-plugin` - Kubernetes device plugin

## Domain and DNS

- **Domain name** for your API endpoint (e.g., `api.yourcompany.com`)
- **DNS access** to create A/CNAME records pointing to your Kubernetes ingress
- **SSL/TLS certificates** (handled automatically via cert-manager and Let's Encrypt)

## Tools Required

### kubectl

Kubernetes command-line tool:

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Helm

Package manager for Kubernetes:

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Docker (Optional)

Only needed if you want to pull and push images to your own registry:

```bash
# macOS
brew install docker

# Linux
# Follow Docker installation guide for your distribution
```

### Git

For cloning the Helm charts repository:

```bash
# macOS
brew install git

# Linux
sudo apt-get install git  # Ubuntu/Debian
sudo dnf install git      # Fedora/RHEL
```

## Access Requirements

### Kubernetes Access

- **kubeconfig file** for your cluster
- **Cluster admin permissions** (or sufficient permissions to create namespaces, deployments, services, etc.)
- **Ingress controller** installed (NGINX recommended)

### Container Registry Access

- **Read access** to Meeting BaaS container registry (provided by us)
- **Write access** to your own container registry (if mirroring images)

### Service Credentials

You'll need credentials for:
- Database connection string
- Redis connection string
- S3 access keys and bucket names
- SQS access keys and queue URLs
- OAuth client IDs/secrets (if dashboard enabled)
- API keys for optional services (Stripe, SVIX, Gladia, Resend)

## Feature Flag Considerations

Before deployment, decide which features you need:

### Minimal Deployment (Single-Tenant)

- `SELF_HOSTED=true`
- `ENABLE_MULTI_TENANT=false`
- All other flags `false`

**Requires**: Database, Redis, S3, SQS, Kubernetes cluster

### With Dashboard

- `SELF_HOSTED=true`
- `ENABLE_DASHBOARD=true`
- `ENABLE_MULTI_TENANT=false` (or `true` for multi-tenant)

**Requires**: Everything above + OAuth credentials (Google/GitHub)

### With Calendar Integration

- `ENABLE_CALENDAR=true`

**Requires**: Google/Microsoft OAuth credentials, calendar encryption key

### With Transcription

- `ENABLE_TRANSCRIPTION=true`

**Requires**: Gladia API key, audio chunks S3 bucket

### With Email Notifications

- `ENABLE_EMAIL=true`

**Requires**: Resend API key

### With Managed Webhooks (SVIX)

- `ENABLE_SVIX=true`

**Requires**: SVIX instance URL and JWT secret

### With Billing (Stripe)

- `ENABLE_STRIPE=true`

**Requires**: Stripe account, webhook secret, product/price IDs

## Network Requirements

### Ingress

- **Port 443** (HTTPS) exposed to the internet
- **Port 80** (HTTP) for Let's Encrypt ACME challenges
- **Ingress controller** (NGINX recommended)

### Internal Communication

- **Pod-to-pod communication** within the cluster
- **Service discovery** via Kubernetes DNS
- **SQS endpoint** accessible from pods

### External Services

- **Database** accessible from Kubernetes pods
- **Redis** accessible from Kubernetes pods
- **S3 endpoint** accessible from Kubernetes pods
- **SQS endpoint** accessible from Kubernetes pods

## Resource Estimates

### API Server Pool

- **CPU**: 0.5-1.5 cores per pod (2-5 pods recommended)
- **Memory**: 1-5GB per pod
- **Storage**: Minimal (no persistent volumes needed)

### Bot Pool

- **CPU**: 1.5-4 cores per bot pod
- **Memory**: 3-8GB per bot pod
- **Storage**: Optional EFS/NFS mount for temporary files
- **Video Devices**: 1 device per bot pod (managed by video device plugin)

### Background Jobs

- **CPU**: 0.1-0.5 cores per job
- **Memory**: 200MB-1GB per job
- **Frequency**: Varies by job (see [Background Jobs](/docs/self-hosting/configuration#background-jobs))

## Next Steps

Once you have all prerequisites in place:

1. [Set up your infrastructure](/docs/self-hosting/infrastructure-setup) - Configure Kubernetes, databases, and services
2. [Set up the repository](/docs/self-hosting/repository-setup) - Clone Helm charts and create environment overrides
3. [Configure the platform](/docs/self-hosting/configuration) - Set feature flags and environment variables


---

## Repository Setup

Set up the Helm charts repository and environment overrides

### Source: ./content/docs/self-hosting/repository-setup.mdx


This guide explains how to set up the Helm charts repository and create your environment-specific configuration files.

## Overview

Meeting BaaS provides Helm charts via a separate repository (`kubernetes-config`). You'll create your own repository that includes these charts as a git submodule and add your environment-specific overrides.

## Repository Structure

Create the following structure:

```text
your-company-meeting-baas-config/
├── helm-charts/                 # Git submodule (kubernetes-config repo)
│   ├── api_server_v2_chart/
│   ├── job_v2_chart/
│   ├── zoom_bots_v2_chart/
│   ├── meet_teams_bots_v2_chart/
│   ├── video_device_plugin_chart/
│   └── baas_controller.sh
├── environment-overrides/       # Your environment-specific configs
│   ├── api_server_v2_chart/
│   │   └── prod.yaml
│   ├── job_v2_chart/
│   │   └── prod.yaml
│   ├── zoom_bots_v2_chart/
│   │   └── prod.yaml
│   ├── meet_teams_bots_v2_chart/
│   │   └── prod.yaml
│   └── video_device_plugin_chart/
│       └── prod.yaml
├── k8s-resources/              # Kubernetes resources (certificates, etc.)
│   └── prod-certs/
│       ├── cluster-issuer.yaml
│       └── cluster-certificate.yaml
└── kubeconfig.yaml             # Your Kubernetes config (gitignored)
```

## Step 1: Create Your Repository

```bash
# Create new directory
mkdir your-company-meeting-baas-config
cd your-company-meeting-baas-config

# Initialize git repository
git init
```

## Step 2: Add Helm Charts as Submodule

Add the Meeting BaaS kubernetes-config repository as a git submodule:

```bash
# Add submodule
git submodule add https://github.com/Meeting-BaaS/kubernetes-config.git helm-charts

# Initialize and update submodule
git submodule update --init --recursive
```

**Note**: You'll need access to the `kubernetes-config` repository. Contact your Meeting BaaS representative for access.

## Step 3: Create Environment Overrides Directory

```bash
# Create directory structure
mkdir -p environment-overrides/{api_server_v2_chart,job_v2_chart,zoom_bots_v2_chart,meet_teams_bots_v2_chart,video_device_plugin_chart}

# Create k8s-resources directory
mkdir -p k8s-resources/prod-certs
```

## Step 4: Create .gitignore

Create a `.gitignore` file to exclude sensitive files:

```text
# Kubernetes config (contains credentials)
kubeconfig.yaml
kubeconfig-*.yaml

# Environment overrides (may contain secrets)
# Uncomment if you want to keep them private:
# environment-overrides/**/*.yaml

# Git submodule tracking
.git/modules/

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
```

## Step 5: Create Environment Override Files

You'll receive template `prod.yaml` files from Meeting BaaS. Create these files in your `environment-overrides` directory:

### api_server_v2_chart/prod.yaml

```yaml
image:
  repository: YOUR_REGISTRY/api-server-v2  # Update to your registry
  pullPolicy: Always

# Feature flags - customize based on your needs
featureFlags:
  selfHosted: true
  enableStripe: false
  enableSvix: false
  enableCalendar: false
  enableMultitenant: false
  enableDashboard: false
  enableTranscription: false
  enableEmail: false

# Self-hosted configuration
selfHosted:
  staticApiKey: "your-secret-api-key"  # Generate a secure key
  staticTeamId: "your-team-id"         # Choose a team identifier

# Node selector - update with your pool name
nodeSelector:
  k8s.scaleway.com/pool-name: YOUR_API_POOL_NAME

# Secrets - fill in your values
secret:
  database_url: "postgres://..."
  redis_url: "redis://..."
  # ... other secrets

# ConfigMap - update with your values
configmap:
  api_server_baseurl: "https://api.yourcompany.com"
  frontend_baseurl: "https://dashboard.yourcompany.com"
  # ... other config values
```

### job_v2_chart/prod.yaml

```yaml
image:
  repository: YOUR_REGISTRY/api-server-v2  # Same as API server
  pullPolicy: Always

# Feature flags - should match api_server_v2_chart
featureFlags:
  enableCalendar: false
  enableMultitenant: false
  enableTranscription: false
  enableEmail: false

# Node selector - update with your pool name
nodeSelector:
  k8s.scaleway.com/pool-name: YOUR_API_POOL_NAME

# Secrets - fill in your values
secret:
  database_url: "postgres://..."
  # ... other secrets
```

### zoom_bots_v2_chart/prod.yaml

```yaml
image:
  repository: YOUR_REGISTRY/zoom-bots-v2  # Update to your registry
  pullPolicy: Always

# Node selector - update with your bots pool name
nodeSelector:
  k8s.scaleway.com/pool-name: YOUR_BOTS_POOL_NAME

# Secrets - fill in your values
secrets:
  sqs_queue_url: "https://sqs..."
  # ... other secrets
```

### meet_teams_bots_v2_chart/prod.yaml

```yaml
image:
  repository: YOUR_REGISTRY/meet-teams-bots-v2  # Update to your registry
  pullPolicy: Always

# Node selector - update with your bots pool name
nodeSelector:
  k8s.scaleway.com/pool-name: YOUR_BOTS_POOL_NAME

# Secrets - fill in your values
secrets:
  sqs_queue_url: "https://sqs..."
  # ... other secrets
```

### video_device_plugin_chart/prod.yaml

```yaml
image:
  repository: YOUR_REGISTRY/video-device-plugin  # Update to your registry
  pullPolicy: IfNotPresent
  tag: "1.0.0"

# Node selector - update with your bots pool name
nodeSelector:
  k8s.scaleway.com/pool-name: YOUR_BOTS_POOL_NAME
```

## Step 6: Update baas_controller.sh

The `baas_controller.sh` script needs to know your Kubernetes context. Update it:

```bash
# Find your kubectl context name
kubectl config get-contexts

# Edit baas_controller.sh
# Replace 'admin@meeting-baas-prod-k8' with your context name
# Or update the context switching logic to match your setup
```

**Note**: The script automatically detects if you're running from the root directory or `helm-charts` directory.

## Step 7: Configure Kubernetes Resources

### Cluster Issuer (cert-manager)

Create `k8s-resources/prod-certs/cluster-issuer.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-cluster-issuer
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@yourcompany.com  # Update with your email
    privateKeySecretRef:
      name: letsencrypt-cluster-issuer-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

### Certificate

Create `k8s-resources/prod-certs/cluster-certificate.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-meeting-baas-tls
  namespace: services
spec:
  secretName: api-meeting-baas-tls
  issuerRef:
    name: letsencrypt-cluster-issuer
    kind: ClusterIssuer
  dnsNames:
    - api.yourcompany.com  # Update with your domain
```

## Step 8: Add kubeconfig

Download your Kubernetes config file:

```bash
# For Scaleway Kapsule
scw k8s kubeconfig get YOUR_CLUSTER_ID > kubeconfig.yaml

# Or download from your cloud provider's console
```

**Important**: Add `kubeconfig.yaml` to `.gitignore` (already done above).

## Step 9: Verify Setup

```bash
# Verify kubectl can connect
kubectl --kubeconfig=kubeconfig.yaml get nodes

# Verify Helm charts are accessible
ls helm-charts/api_server_v2_chart/

# Verify environment overrides exist
ls environment-overrides/api_server_v2_chart/prod.yaml
```

## Step 10: Commit to Git (Optional)

If you want to version control your configuration:

```bash
# Add files (excluding secrets)
git add helm-charts/
git add environment-overrides/  # Only if not gitignored
git add k8s-resources/
git add .gitignore
git add .gitmodules

# Commit
git commit -m "Initial Meeting BaaS v2 configuration"

# Push to your repository
git remote add origin YOUR_REPO_URL
git push -u origin main
```

**Security Note**: Consider keeping `environment-overrides` in a private repository or using a secrets management tool.

## Updating Helm Charts

When Meeting BaaS updates the Helm charts:

```bash
# Update submodule to latest
cd helm-charts
git pull origin main
cd ..

# Review changes
git diff helm-charts

# Commit the update
git add helm-charts
git commit -m "Update Helm charts to latest version"
```

## Customizing Charts

If you need to customize the Helm charts:

1. **Fork the repository**: Create your own fork of `kubernetes-config`
2. **Use your fork**: Update the submodule to point to your fork
3. **Make changes**: Modify charts as needed
4. **Keep in sync**: Periodically merge updates from the upstream repository

**Note**: Customizing charts makes upgrades more complex. Prefer using environment overrides when possible.

## Next Steps

- [Configuration](/docs/self-hosting/configuration) - Configure feature flags and environment variables
- [Deployment](/docs/self-hosting/deployment) - Deploy the platform to your cluster


---

## Troubleshooting

Common issues and solutions for self-hosted deployments

### Source: ./content/docs/self-hosting/troubleshooting.mdx


This guide covers common issues you might encounter when self-hosting Meeting BaaS v2 and how to resolve them.

## Checking Deployment Status

### Verify All Services

```bash
# Check all deployments
kubectl get deployments -n services

# Check all pods
kubectl get pods -n services

# Check CronJobs
kubectl get cronjobs -n services

# Check ScaledJobs (KEDA)
kubectl get scaledjobs -n services

# Check DaemonSets
kubectl get daemonsets -n services
```

### Check Service Logs

```bash
# API server logs
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=100

# Job logs (latest execution)
kubectl logs -n services -l cron=scheduled-bot-job --tail=100

# Bot pod logs (if any running)
kubectl logs -n services -l app.kubernetes.io/instance=zoom-bots-v2 --tail=100
```

### Check Feature Flags

```bash
# Public endpoint (no auth)
curl https://api.yourcompany.com/status/features

# Should return:
# {
#   "selfHosted": true,
#   "features": {
#     "stripe": false,
#     "svix": false,
#     "calendar": false,
#     "multitenant": false,
#     "dashboard": false,
#     "transcription": false,
#     "email": false
#   }
# }
```

## Common Issues

### API Server Not Starting

#### Symptoms

- Pods stuck in `CrashLoopBackOff` or `Pending` state
- Health endpoint not responding

#### Diagnosis

```bash
# Check pod status
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2

# Check logs
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=100

# Check events
kubectl get events -n services --sort-by='.lastTimestamp'
```

#### Common Causes and Solutions

**1. Missing or Invalid Secrets**

```bash
# Check if secrets exist
kubectl get secrets -n services api-server-v2

# Verify secret keys
kubectl get secret -n services api-server-v2 -o jsonpath='{.data}' | jq 'keys'

# Common missing secrets:
# - DATABASE_URL
# - REDIS_URL
# - STATIC_API_KEY (if single-tenant)
```

**Solution**: Ensure all required secrets are set in `environment-overrides/api_server_v2_chart/prod.yaml`

**2. Database Connection Issues**

```bash
# Test database connection from pod
kubectl run -it --rm --restart=Never db-test \
  --image=postgres:14 \
  --env="PGPASSWORD=password" \
  -- psql -h YOUR_DB_HOST -U username -d database_name
```

**Solution**: 
- Verify `DATABASE_URL` is correct
- Check database firewall rules allow Kubernetes cluster IPs
- Verify database credentials are correct

**3. Invalid Configuration Values**

```bash
# Check ConfigMap
kubectl get configmap -n services api-server-v2 -o yaml

# Look for invalid values like:
# - Empty required fields
# - Invalid URLs
# - Wrong data types
```

**Solution**: Review `environment-overrides/api_server_v2_chart/prod.yaml` configmap section

**4. Image Pull Errors**

```bash
# Check pod events
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2 | grep -A 5 Events

# Common errors:
# - ImagePullBackOff: Cannot pull image
# - ErrImagePull: Authentication failed
```

**Solution**:
- Verify image registry credentials in `imagePullSecrets`
- Check image tag exists: `docker pull YOUR_REGISTRY/api-server-v2:$IMAGE_TAG`
- Verify network connectivity to registry

### Migration Job Failed

#### Symptoms

- Upgrade stuck waiting for migration
- Migration job in `Failed` state

#### Diagnosis

```bash
# Check migration job
kubectl get jobs -n services | grep migration

# Check migration logs
kubectl logs -n services -l app.kubernetes.io/component=migration --tail=100

# Check job details
kubectl describe job -n services api-server-v2-migration
```

#### Common Causes and Solutions

**1. Database Connection Issues**

**Solution**: Same as API server database connection issues above

**2. Migration Conflicts**

**Solution**: 
- Check if manual schema changes conflict with migrations
- Review migration logs for specific errors
- Contact Meeting BaaS support if migrations are incompatible

**3. Insufficient Permissions**

**Solution**: Ensure database user has permissions to:
- Create tables
- Alter tables
- Create indexes
- Create sequences

**4. Migration Timeout**

**Solution**: Increase timeout in `api_server_v2_chart/values.yaml`:

```yaml
migration:
  activeDeadlineSeconds: 600  # Increase from 300 to 600 seconds
```

### Bots Not Starting

#### Symptoms

- No bot pods running
- SQS queue has messages but no bots processing them

#### Diagnosis

```bash
# Check ScaledJob status
kubectl get scaledjobs -n services

# Check KEDA operator
kubectl get pods -n keda-system

# Check SQS queue depth
# (Use AWS CLI or your SQS provider's tool)

# Check bot pod events
kubectl get events -n services --field-selector involvedObject.kind=Pod
```

#### Common Causes and Solutions

**1. KEDA Not Installed**

```bash
# Check if KEDA is installed
kubectl get pods -n keda-system

# Install KEDA if missing
helm repo add kedacore https://kedacore.github.io/charts
helm install keda kedacore/keda --namespace keda-system --create-namespace
```

**2. SQS Credentials Invalid**

**Solution**: Verify SQS credentials in bot chart secrets:
- `AWS_ACCESS_KEY_ID_SQS`
- `AWS_SECRET_ACCESS_KEY_SQS`
- `SQS_QUEUE_URL_ZOOM` or `SQS_QUEUE_URL_MEET_TEAMS`

**3. Video Device Plugin Not Running**

```bash
# Check video device plugin
kubectl get daemonset -n services video-device-plugin

# Check if devices are available
kubectl get nodes -o jsonpath='{.items[*].status.allocatable.meeting-baas\.io/video-devices}'
```

**Solution**: Ensure video device plugin is deployed and running on bot pool nodes

**4. Insufficient Node Resources**

```bash
# Check node resources
kubectl describe nodes | grep -A 5 "Allocated resources"

# Check if nodes can schedule pods
kubectl get nodes
```

**Solution**: 
- Add more nodes to bot pool
- Increase node resources
- Check resource requests/limits in bot chart

### Health Checks Failing

#### Symptoms

- Pods restarting frequently
- `kubectl get pods` shows `CrashLoopBackOff`

#### Diagnosis

```bash
# Check liveness probe
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2 | grep -A 10 Liveness

# Test endpoints manually
kubectl port-forward -n services svc/api-server-v2 3001:3001
# In another terminal:
curl http://localhost:3001/health
curl http://localhost:3001/liveness
```

#### Common Causes and Solutions

**1. Application Not Ready**

**Solution**: Check application logs for startup errors

**2. Port Mismatch**

**Solution**: Verify `configmap.port` matches container port (default: 3001)

**3. Slow Startup**

**Solution**: Increase initial delay in deployment:

```yaml
# In api_server_v2_chart/values.yaml or deployment template
livenessProbe:
  initialDelaySeconds: 30  # Increase from 20
readinessProbe:
  initialDelaySeconds: 15   # Increase from 10
```

### Feature Flags Not Working

#### Symptoms

- Features enabled but not available
- Routes returning 404 or 501

#### Diagnosis

```bash
# Check feature flags
curl https://api.yourcompany.com/status/features

# Check ConfigMap
kubectl get configmap -n services api-server-v2 -o yaml | grep ENABLE_

# Check if routes are registered
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 | grep "Starting API server"
```

#### Common Causes and Solutions

**1. Feature Flags Not Set in ConfigMap**

**Solution**: Verify feature flags in `environment-overrides/api_server_v2_chart/prod.yaml`:

```yaml
featureFlags:
  enableCalendar: true  # Must be true (not "true" string)
```

**2. Job Chart Flags Don't Match**

**Solution**: Ensure `job_v2_chart/prod.yaml` feature flags match `api_server_v2_chart/prod.yaml`

**3. Routes Not Registered**

**Solution**: Check API server logs for route registration messages. Routes are conditionally registered based on feature flags.

### Database Connection Errors

#### Symptoms

- API server logs show database connection errors
- Migrations failing

#### Diagnosis

```bash
# Test database connection
kubectl run -it --rm --restart=Never db-test \
  --image=postgres:14 \
  --env="PGPASSWORD=password" \
  -- psql -h YOUR_DB_HOST -U username -d database_name -c "SELECT 1"
```

#### Common Causes and Solutions

**1. Firewall Rules**

**Solution**: Ensure database firewall allows connections from Kubernetes cluster IPs

**2. SSL/TLS Issues**

**Solution**: 
- Verify `DATABASE_URL` includes SSL parameters if required
- Check if `?sslmode=require` is needed
- Verify CA certificates if using custom certificates

**3. Connection Pool Exhausted**

**Solution**: 
- Increase database `max_connections`
- Reduce API server replica count
- Check for connection leaks in application

### S3 Upload Failures

#### Symptoms

- Recordings not appearing in S3
- Bot logs show upload errors

#### Diagnosis

```bash
# Check bot logs
kubectl logs -n services -l app.kubernetes.io/instance=zoom-bots-v2 --tail=100 | grep -i s3

# Test S3 access
kubectl run -it --rm --restart=Never s3-test \
  --image=amazon/aws-cli \
  --env="AWS_ACCESS_KEY_ID=..." \
  --env="AWS_SECRET_ACCESS_KEY=..." \
  --env="AWS_ENDPOINT_URL=..." \
  -- s3 ls s3://your-bucket-name
```

#### Common Causes and Solutions

**1. Invalid Credentials**

**Solution**: Verify S3 access keys and secret keys

**2. Bucket Not Found**

**Solution**: Verify bucket names match exactly (case-sensitive)

**3. Permissions Issues**

**Solution**: Ensure IAM user/keys have:
- `s3:PutObject` permission
- `s3:GetObject` permission (for retries)
- `s3:ListBucket` permission

**4. Endpoint URL Incorrect**

**Solution**: Verify `AWS_ENDPOINT_URL` matches your S3 provider:
- AWS: `https://s3.region.amazonaws.com`
- Scaleway: `https://s3.region.scw.cloud`
- MinIO: `http://minio-host:9000`

### Webhook Callbacks Not Working

#### Symptoms

- Bots complete but callbacks not received
- Callback logs show errors

#### Diagnosis

```bash
# Check API server logs for callback attempts
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 | grep -i callback

# Test callback endpoint manually
curl -X POST https://your-callback-url.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### Common Causes and Solutions

**1. Callback URL Not Accessible**

**Solution**: 
- Verify callback URL is publicly accessible
- Check firewall rules
- Verify SSL certificate is valid

**2. Callback Secret Mismatch**

**Solution**: Verify `callback_config.secret` matches what your server expects

**3. Network Timeout**

**Solution**: 
- Increase callback timeout in bot configuration
- Check network connectivity from Kubernetes cluster
- Verify DNS resolution for callback URL

### Background Jobs Not Running

#### Symptoms

- CronJobs exist but not executing
- No job pods created

#### Diagnosis

```bash
# Check CronJob status
kubectl get cronjobs -n services

# Check CronJob details
kubectl describe cronjob -n services scheduled-bot-job

# Check if jobs are being created
kubectl get jobs -n services

# Check job logs
kubectl logs -n services -l cron=scheduled-bot-job --tail=100
```

#### Common Causes and Solutions

**1. CronJob Not Created**

**Solution**: Check if feature flags allow the job to be created:
- Calendar jobs require `ENABLE_CALENDAR=true`
- Team deletion job requires `ENABLE_MULTI_TENANT=true`

**2. Job Failing Immediately**

**Solution**: Check job logs for errors (database connection, missing secrets, etc.)

**3. Cron Schedule Not Met**

**Solution**: 
- Verify CronJob schedule is correct
- Check Kubernetes cluster time is synchronized
- Wait for next scheduled time

## Getting Help

### Information to Provide

When seeking help, provide:

1. **Kubernetes Version**: `kubectl version`
2. **Helm Version**: `helm version`
3. **Feature Flags**: Output of `curl https://api.yourcompany.com/status/features`
4. **Pod Status**: `kubectl get pods -n services`
5. **Recent Logs**: `kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=100`
6. **Events**: `kubectl get events -n services --sort-by='.lastTimestamp'`
7. **Configuration**: Feature flags and relevant environment variables (redact secrets)

### Contact Support

- **Email**: support@meetingbaas.com
- **Documentation**: Check this troubleshooting guide first
- **Logs**: Always include relevant logs when reporting issues

## Prevention Tips

### Regular Monitoring

- Set up monitoring for pod health
- Monitor database connections
- Track SQS queue depth
- Monitor S3 upload success rates

### Regular Backups

- Backup database regularly
- Keep configuration files in version control
- Document any custom changes

### Stay Updated

- Keep Helm charts updated
- Apply security patches promptly
- Review release notes before upgrading

## Next Steps

- Review [Configuration Guide](/docs/self-hosting/configuration) for feature flag setup
- Check [Deployment Guide](/docs/self-hosting/deployment) for deployment steps
- Review [Upgrades Guide](/docs/self-hosting/upgrades) for upgrade procedures


---

## Upgrades

Upgrade your Meeting BaaS v2 deployment with CI/CD-friendly process

### Source: ./content/docs/self-hosting/upgrades.mdx


Meeting BaaS v2 deployments are designed to be CI/CD-friendly. This guide explains how to upgrade your deployment when new images are released.

## Upgrade Process Overview

The upgrade process is straightforward:

1. **Receive Image Tag**: Meeting BaaS provides new image tags periodically
2. **Set Environment Variables**: Export `ENVIRON` and `IMAGE_TAG`
3. **Run Upgrade Script**: Use `baas_controller.sh` to upgrade services
4. **Verify**: Check that services are running correctly

## Prerequisites

- Access to the latest image tag from Meeting BaaS
- `kubectl` configured and connected to your cluster
- `helm` installed
- Deployment script (`baas_controller.sh`) accessible

## Upgrade Steps

### Step 1: Set Environment Variables

```bash
# Set environment (prod or preprod)
export ENVIRON=prod

# Set the new image tag (provided by Meeting BaaS)
export IMAGE_TAG=2026-01-27abc123def456...
```

**Note**: The same `IMAGE_TAG` is used for all services (API server, jobs, and bots) since they're built from the same codebase commit.

### Step 2: Pull and Push Images (If Using Your Own Registry)

If you're mirroring images to your own registry:

```bash
# Login to Meeting BaaS registry
docker login rg.fr-par.scw.cloud

# Pull new images
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-api-server/api-server-v2:$IMAGE_TAG
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-bots/zoom-bots-v2:$IMAGE_TAG
docker pull rg.fr-par.scw.cloud/meeting-baas-prod-bots/meet-teams-bots-v2:$IMAGE_TAG

# Tag for your registry
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-api-server/api-server-v2:$IMAGE_TAG \
  YOUR_REGISTRY/api-server-v2:$IMAGE_TAG
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-bots/zoom-bots-v2:$IMAGE_TAG \
  YOUR_REGISTRY/zoom-bots-v2:$IMAGE_TAG
docker tag rg.fr-par.scw.cloud/meeting-baas-prod-bots/meet-teams-bots-v2:$IMAGE_TAG \
  YOUR_REGISTRY/meet-teams-bots-v2:$IMAGE_TAG

# Push to your registry
docker push YOUR_REGISTRY/api-server-v2:$IMAGE_TAG
docker push YOUR_REGISTRY/zoom-bots-v2:$IMAGE_TAG
docker push YOUR_REGISTRY/meet-teams-bots-v2:$IMAGE_TAG
```

### Step 3: Upgrade Services

Navigate to the helm-charts directory and upgrade each service:

```bash
cd helm-charts

export ENVIRON=prod
export IMAGE_TAG=2026-01-27abc123def456...

# Upgrade API server (includes migration job)
./baas_controller.sh api-v2 upgrade

# Upgrade background jobs
./baas_controller.sh job-v2 upgrade

# Upgrade bot services
./baas_controller.sh zoom-bots-v2 upgrade
./baas_controller.sh meet-teams-bots-v2 upgrade
```

**What Happens During Upgrade**:

1. **Migration Job**: Runs automatically as a pre-upgrade hook (if migrations exist)
2. **Rolling Update**: Pods are updated one at a time (zero-downtime)
3. **Health Checks**: New pods must pass health checks before old pods are terminated

### Step 4: Verify Upgrade

```bash
# Check API server pods
kubectl get pods -n services -l app.kubernetes.io/instance=api-server-v2

# Check pod images (should show new tag)
kubectl get pods -n services -l app.kubernetes.io/instance=api-server-v2 -o jsonpath='{.items[*].spec.containers[*].image}'

# Check API server logs for errors
kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 --tail=50

# Test health endpoint
curl https://api.yourcompany.com/health

# Test feature flags endpoint
curl https://api.yourcompany.com/status/features
```

## Database Migrations

Database migrations run automatically during API server upgrades:

### How It Works

1. Helm creates a migration Job before upgrading the deployment
2. The Job runs `node dist/cli/migrate.js` using the new image
3. The Job completes (or fails after retries) before pods roll out
4. Old Job is cleaned up automatically

### Migration Job Details

**Configuration** (in `api_server_v2_chart/values.yaml`):

```yaml
migration:
  enabled: true                    # Enable automatic migrations
  backoffLimit: 3                  # Retries on failure
  activeDeadlineSeconds: 300       # Timeout (5 minutes)
  ttlSecondsAfterFinished: 600     # Cleanup after (10 minutes)
```

### Checking Migration Status

```bash
# Check migration job
kubectl get jobs -n services | grep migration

# Check migration logs
kubectl logs -n services -l app.kubernetes.io/component=migration --tail=100

# Check migration job details
kubectl describe job -n services api-server-v2-migration
```

### Migration Failures

If migration fails:

1. **Check Logs**: Review migration job logs for errors
2. **Fix Issues**: Address database connectivity or permission issues
3. **Retry**: Delete the failed job and upgrade again:

```bash
# Delete failed migration job
kubectl delete job -n services api-server-v2-migration

# Retry upgrade
./baas_controller.sh api-v2 upgrade
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Upgrade Meeting BaaS

on:
  workflow_dispatch:
    inputs:
      image_tag:
        description: 'Image tag to deploy'
        required: true

jobs:
  upgrade:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
      
      - name: Set up Helm
        uses: azure/setup-helm@v3
      
      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBECONFIG }}" > kubeconfig.yaml
          export KUBECONFIG=$PWD/kubeconfig.yaml
      
      - name: Upgrade services
        env:
          ENVIRON: prod
          IMAGE_TAG: ${{ github.event.inputs.image_tag }}
        run: |
          cd helm-charts
          chmod +x baas_controller.sh
          ./baas_controller.sh api-v2 upgrade
          ./baas_controller.sh job-v2 upgrade
          ./baas_controller.sh zoom-bots-v2 upgrade
          ./baas_controller.sh meet-teams-bots-v2 upgrade
      
      - name: Verify deployment
        run: |
          export KUBECONFIG=$PWD/kubeconfig.yaml
          kubectl get pods -n services
          curl -f https://api.yourcompany.com/health || exit 1
```

### GitLab CI Example

```yaml
upgrade:
  stage: deploy
  script:
    - export ENVIRON=prod
    - export IMAGE_TAG=$CI_COMMIT_TAG
    - cd helm-charts
    - chmod +x baas_controller.sh
    - ./baas_controller.sh api-v2 upgrade
    - ./baas_controller.sh job-v2 upgrade
    - ./baas_controller.sh zoom-bots-v2 upgrade
    - ./baas_controller.sh meet-teams-bots-v2 upgrade
  only:
    - tags
```

## Rollback Procedure

If an upgrade causes issues, you can rollback:

### Rollback API Server

```bash
# List revisions
helm history api-server-v2 -n services

# Rollback to previous revision
helm rollback api-server-v2 -n services

# Or rollback to specific revision
helm rollback api-server-v2 3 -n services
```

### Rollback Other Services

```bash
# Rollback jobs
helm rollback job-v2 -n services

# Rollback bots
helm rollback zoom-bots-v2 -n services
helm rollback meet-teams-bots-v2 -n services
```

**Note**: Rolling back may require database migrations to be compatible. Check migration compatibility before rolling back.

## Upgrade Best Practices

### Pre-Upgrade Checklist

- [ ] Review release notes for breaking changes
- [ ] Backup database (if possible)
- [ ] Test upgrade in staging environment first
- [ ] Verify image tag is correct
- [ ] Check that all required secrets are still valid
- [ ] Ensure sufficient cluster resources

### During Upgrade

- Monitor pod status: `kubectl get pods -n services -w`
- Watch API server logs: `kubectl logs -n services -l app.kubernetes.io/instance=api-server-v2 -f`
- Check migration job: `kubectl get jobs -n services | grep migration`
- Test health endpoint: `curl https://api.yourcompany.com/health`

### Post-Upgrade Verification

- [ ] All pods are running: `kubectl get pods -n services`
- [ ] Health endpoint responds: `curl https://api.yourcompany.com/health`
- [ ] Feature flags are correct: `curl https://api.yourcompany.com/status/features`
- [ ] Test bot creation: Create a test bot via API
- [ ] Check logs for errors: Review recent logs for any issues
- [ ] Verify background jobs: Check that CronJobs are running

## Updating Helm Charts

When Helm charts are updated:

```bash
# Update submodule to latest
cd helm-charts
git pull origin main
cd ..

# Review changes
git diff helm-charts

# Test upgrade (dry-run)
cd helm-charts
helm upgrade --dry-run api-server-v2 ./api_server_v2_chart \
  -f ../environment-overrides/api_server_v2_chart/prod.yaml \
  --set image.tag=$IMAGE_TAG

# If everything looks good, upgrade
./baas_controller.sh api-v2 upgrade
```

## Version Compatibility

- **API Server and Jobs**: Must use the same image tag (same codebase)
- **Bot Images**: Can be upgraded independently, but should match API server version for compatibility
- **Video Device Plugin**: Uses fixed version (1.0.0), rarely updated

## Troubleshooting Upgrades

### Migration Job Stuck

```bash
# Check job status
kubectl describe job -n services api-server-v2-migration

# Check logs
kubectl logs -n services -l app.kubernetes.io/component=migration

# Delete and retry
kubectl delete job -n services api-server-v2-migration
./baas_controller.sh api-v2 upgrade
```

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2

# Check events
kubectl get events -n services --sort-by='.lastTimestamp'

# Common issues:
# - Image pull errors (check registry access)
# - Resource constraints (check node resources)
# - Configuration errors (check logs)
```

### Health Checks Failing

```bash
# Check liveness probe
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2 | grep Liveness

# Check readiness probe
kubectl describe pod -n services -l app.kubernetes.io/instance=api-server-v2 | grep Readiness

# Test endpoints manually
kubectl port-forward -n services svc/api-server-v2 3001:3001
curl http://localhost:3001/health
curl http://localhost:3001/liveness
```

## Next Steps

- [Troubleshooting](/docs/self-hosting/troubleshooting) - Common issues and solutions
- Review [Deployment Guide](/docs/self-hosting/deployment) for initial setup


---

