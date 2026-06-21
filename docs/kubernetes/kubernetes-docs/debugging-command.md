### Useful debugging commands

`` Check pod logs:``

`` kubectl logs deployment/postgres -n cloudmart``

`` kubectl logs deployment/redis -n cloudmart``

### Describe pod if something fails:

`` kubectl describe pod <pod-name> -n cloudmart `` 

### Get everything:

``` kubectl get all -n cloudmart ```