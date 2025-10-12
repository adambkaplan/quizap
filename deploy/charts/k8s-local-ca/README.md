# k8s-local-ca

A Helm chart for bootstrapping a private PKI (Public Key Infrastructure) using cert-manager. This chart creates a self-signed root certificate authority and an intermediate CA that can be used to issue certificates for your Kubernetes applications.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- cert-manager v1.19.0+ installed in your cluster

## Installation

### Install cert-manager

First, ensure cert-manager is installed in your cluster using the OCI chart:

```bash
helm install cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.19.0
```

### Install k8s-local-ca

**Important**: This chart must be installed in the same namespace where cert-manager is running.

```bash
# Install in the cert-manager namespace
helm install k8s-local-ca ./deploy/charts/k8s-local-ca \
  --namespace cert-manager
```

## What This Chart Creates

This chart deploys a complete PKI infrastructure:

1. **Root Issuer** (`k8s-local-root`): A self-signed root certificate authority
2. **CA Certificate** (`k8s-local-ca`): An intermediate CA certificate signed by the root
3. **CA Issuer** (`k8s-local-ca`): A ClusterIssuer that can issue certificates using the CA

## Configuration

The following table lists the configurable parameters and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ca.name` | Name of the CA certificate | `k8s-local-ca` |
| `ca.commonName` | Common name for the CA certificate | `ca.k8s.local` |
| `ca.secretName` | Name of the secret storing the CA certificate | `k8s-local-ca` |
| `ca.privateKey.algorithm` | Private key algorithm | `ECDSA` |
| `ca.privateKey.size` | Private key size | `256` |
| `rootIssuer.name` | Name of the root ClusterIssuer | `k8s-local-root` |
| `caIssuer.name` | Name of the CA ClusterIssuer | `k8s-local-ca` |
| `global.labels` | Additional labels to apply to all resources | `{}` |
| `global.annotations` | Additional annotations to apply to all resources | `{}` |

## Usage

### Issuing Certificates

Once installed, you can use the `k8s-local-ca` ClusterIssuer to issue certificates for your applications:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-app-cert
  namespace: my-namespace
spec:
  secretName: my-app-tls
  issuerRef:
    name: k8s-local-ca
    kind: ClusterIssuer
  dnsNames:
  - my-app.example.com
  - my-app.local
```

### Custom Configuration

You can customize the installation by providing your own values:

```bash
helm install k8s-local-ca ./deploy/charts/k8s-local-ca \
  --namespace cert-manager \
  --set ca.commonName=my-ca.local \
  --set ca.privateKey.algorithm=RSA \
  --set ca.privateKey.size=2048
```

### Adding Labels and Annotations

You can add custom labels and annotations to all resources:

```bash
helm install k8s-local-ca ./deploy/charts/k8s-local-ca \
  --namespace cert-manager \
  --set global.labels.environment=production \
  --set global.annotations."cert-manager\.io/inject-ca-from-secret"=k8s-local-ca
```

## Verification

After installation, verify that the resources were created successfully:

```bash
# Check ClusterIssuers
kubectl get clusterissuers

# Check Certificate
kubectl get certificate -n cert-manager

# Check Certificate status
kubectl describe certificate k8s-local-ca -n cert-manager

# Check the CA secret
kubectl get secret k8s-local-ca -n cert-manager
```

## Troubleshooting

### Certificate Not Ready

If the CA certificate is not ready, check the cert-manager logs:

```bash
kubectl logs -n cert-manager deployment/cert-manager
```

### Wrong Namespace

If you installed the chart in the wrong namespace, uninstall and reinstall:

```bash
helm uninstall k8s-local-ca -n wrong-namespace
helm install k8s-local-ca ./deploy/charts/k8s-local-ca -n cert-manager
```

### ClusterIssuer Not Found

Ensure cert-manager is running and the ClusterIssuer was created:

```bash
kubectl get clusterissuers k8s-local-ca
```

## Security Considerations

- The CA private key is stored in a Kubernetes secret. Ensure proper RBAC and network policies are in place.
- This creates a self-signed root CA. For production environments, consider using a trusted external CA.
- The CA certificate has a default validity period. Monitor certificate expiration and renew as needed.

## Uninstalling

To uninstall the chart:

```bash
helm uninstall k8s-local-ca -n cert-manager
```

**Note**: This will remove the CA certificate and ClusterIssuer, but will not affect certificates already issued by the CA.

## Contributing

Contributions are welcome! Please see the main project repository for contribution guidelines.

## License

This chart is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues and questions, please open an issue in the main project repository.
