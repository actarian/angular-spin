If you want to avoid this "boiler plate" code injecting services in child classes just for injection in parent classes' constructor and then effectively using that services in child classes through inheritance, you could do this:

edit: from Angular 5.0.0 ReflectiveInjector has been deprecated in favour of StaticInjector, below is updated code to reflect this change

Have a services map with deps,

export const services: {[key: string]: {provide: any, deps: any[], useClass?: any}} = {
  'FetchApi': {
    provide: FetchApi,
    deps: []
  }
}
Have an Injector holder,

import {Injector} from "@angular/core";

export class ServiceLocator {
  static injector: Injector;
}
set it up in AppModule,

@NgModule(...)
export class AppModule {
  constructor() {
    ServiceLocator.injector = Injector.create(
      Object.keys(services).map(key => ({
        provide: services[key].provide,
        useClass: services[key].provide,
        deps: services[key].deps
      }))
    );
  }
}
use the injector in parent class,

export class ParentClass {

  protected fetchApi: FetchApi;

  constructor() {
    this.fetchApi = ServiceLocator.injector.get(FetchApi);
    ....
  }
}
and extend parent class so you don't need to inject the FetchApi service.

export class ChildClass extends ParentClass {
  constructor() {
    super();
    ...
  }

  onInit() {
    this.fetchApi.call();
  }
}
shareeditflag
