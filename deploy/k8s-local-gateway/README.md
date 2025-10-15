# k8s.local Gateway

This directory contains a Gateway manifest that serves HTTP and HTTPS traffic for `k8s.local` and `*.k8s.local` domains.

## Overview

The Gateway provides a centralized entry point for all applications using the `k8s.local` domain space, supporting both exact domain matching (`k8s.local`) and wildcard subdomain matching (`*.k8s.local`).

## Features

- **HTTP Support**: Serves HTTP traffic on port 80 for both `k8s.local` and `*.k8s.local`
- **HTTPS Support**: Serves HTTPS traffic on port 443 for both `k8s.local` and `*.k8s.local`
- **TLS Termination**: Uses TLS termination mode (certificates managed by individual services)
- **Cross-Namespace Routing**: Allows HTTPRoutes from all namespaces to attach to this Gateway

## Prerequisites

- Kubernetes cluster with Gateway API support
- NGINX Gateway Fabric or compatible Gateway implementation
- Gateway class `nginx` available in the cluster
- `nginx-gateway` namespace exists (or modify the namespace in the manifest)

## Installation

```bash
# Apply the Gateway manifest
kubectl apply -f deploy/k8s-local-gateway/gateway.yaml
```

## Verification

```bash
# Check Gateway status
kubectl get gateway k8s-local-gateway -n nginx-gateway

# Check Gateway details
kubectl describe gateway k8s-local-gateway -n nginx-gateway

# Check Gateway listeners
kubectl get gateway k8s-local-gateway -n nginx-gateway -o yaml
```

## Usage

Once deployed, applications can create HTTPRoutes that reference this Gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-app-route
  namespace: my-namespace
spec:
  parentRefs:
  - name: k8s-local-gateway
    namespace: nginx-gateway
    sectionName: https-k8s-local  # or https-wildcard-k8s-local
  hostnames:
  - my-app.k8s.local
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: my-app-service
      port: 8080
```

## Listeners

The Gateway provides four listeners:

1. **http-k8s-local**: HTTP traffic for `k8s.local` on port 80
2. **http-wildcard-k8s-local**: HTTP traffic for `*.k8s.local` on port 80
3. **https-k8s-local**: HTTPS traffic for `k8s.local` on port 443
4. **https-wildcard-k8s-local**: HTTPS traffic for `*.k8s.local` on port 443

## TLS Certificates

This Gateway uses TLS termination mode, which means:
- Individual services/applications are responsible for managing their own TLS certificates
- Certificates should be created using cert-manager or similar tools
- The Gateway will terminate TLS and forward plain HTTP to backend services

## DNS Configuration

Ensure DNS resolution is configured for:
- `k8s.local` → Points to your cluster's Gateway IP
- `*.k8s.local` → Points to your cluster's Gateway IP

## Troubleshooting

### Gateway Not Ready

```bash
# Check Gateway status
kubectl describe gateway k8s-local-gateway -n nginx-gateway

# Check Gateway class
kubectl get gatewayclass nginx

# Check NGINX Gateway Fabric logs
kubectl logs -n nginx-gateway deployment/nginx-gateway-fabric
```

### HTTPRoute Not Working

```bash
# Check HTTPRoute status
kubectl describe httproute my-app-route -n my-namespace

# Verify parentRef is correct
kubectl get httproute my-app-route -n my-namespace -o yaml
```

## Uninstallation

```bash
# Remove the Gateway
kubectl delete -f deploy/k8s-local-gateway/gateway.yaml
```

**Note**: This will remove the Gateway but will not affect existing HTTPRoutes. Applications will need to be reconfigured to use a different Gateway or routing mechanism.
