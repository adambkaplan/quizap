# QuiZap

QuiZap - An online quiz game!


## Components

```mermaid
architecture-beta
    group app(cloud)[QuiZap]
    group central(cloud)[Gateway]

    service gateway(internet)[Gateway] in central
    service route(internet)[HTTPRoute] in app
    service frontend(server)[Frontend] in app
    service backend(server)[Backend] in app
    junction routeJunction

    gateway:R -- L:route
    frontend:B -- T:routeJunction
    backend:T -- B:routeJunction
    routeJunction:L -- R:route
```

- [frontend](./frontend): Web user interface, using the [PatternFly](https://www.patternfly.org/)
  design framework. Containerized using [Cloud Native Buildpacks](https://buildpacks.io).
- [backend](./backend): Backend service, using the [Gin](https://github.com/gin-gonic/gin) web
  framework. Containerized using [ko](https://ko.build).

Other components deployed using the [GitOps Deployment repo](https://github.com/adambkaplan/quizap-deployments.git)

## Development Guide

Follow the [Development Guide](./DEVELOPMENT.md) to build and test the application locally.
