# Demo Notes

Notes on how I presented this application at KubeCon + CloudNativeCon North America 2025.

## Setup

1. Install the tools needed in the [Development](../DEVELOPMENT.md) document, along with the system
   changes to get all components and DNS routes for `*.k8s.local` working.
2. Run `make kind-setup` to deploy a KIND cluster locally with ArgoCD + Gateway API.
3. Run `make kind-deploy-cloudnative-build` to deploy Tekton, Shipwright, and Harbor.
4. Log into the [ArgoCD console](https://argocd.k8s.local). Check that all Applications are synced
   and are healthy (some may need a refresh to get healthy).
5. Run `make kind-deploy-quizap` to deploy the quizap application.
6. Create the namespace `quizap-dev`

   ```sh
   kubectl create ns quizap-dev
   ```

7. Set up the registry for Shipwright to build:
   1. Log into [Harbor's console](https://registry.k8s.local).
   2. Create the "quizap" project
   3. In the `quizap` project, create robot account with full permissions. Download the credentials to a file.
   4. Use the data in the file to create a registry secret:
      
      ```sh
      # Make sure to escape the $ character!
      kubectl create secret docker-registry harbor -n quizap-dev \
        --docker-server=harbor-core.harbor.svc.cluster.local \
        --docker-username="<robot-name>" \ 
        --docker-password="<robot-secret>"
      ```

## Presentation

Set up three screen "workspaces"

1. (Left) Chrome browser with following windows:
   1. README for QuiZap repo (link)
   2. QuiZap application (link)
   3. Harbor console (link)
   4. QuiZap Deployments repo (link)
   5. ArgoCD console (link)
2. (Center) Slides presentation
3. (Right) VSCode with following:
   1. Split terminal with "local" build demo magic scripts.
   2. Split terminal with "shipwright" demo magic scripts.
