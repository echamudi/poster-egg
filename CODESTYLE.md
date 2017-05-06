# Coding Style

Under construction ...

## TypeScript

### Import order

1. Config
1. Interfaces
1. Angular vendor
1. Other vendors
1. Modules
1. Services
1. Pipes
1. Classes
1. Components
1. Tools

### Bad vs Good

Bad : 

```
import { HttpModule, Http } from '@angular/http';
```

Bad (unsorted) : 

```
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
```

Good (sorted alphabetically) : 

```
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
```
