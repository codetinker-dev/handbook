# Best Practices - Guard

## Auto unwrap default exports when lazy loading
With Angular v15 it is possible to leverage default exports to shorten the syntax when lazy loading a module or a standalone component. Note that the CLI still generates modules and components without the default export so you will need to add that by yourself.
```javascript
@Component({
  standalone: true,
})
export default class ExampleComponent { ... }

// Without default export
{
  path: 'lazy',
  loadComponent: () => import('./example-component').then(m => m.ExampleComponent),
}

// With default export
{
  path: 'lazy',
  loadComponent: () => import('./example-component'),
}
```

## Favouring canMatch guard
The canMatch is the new type of guard introduced in Angular v14.1. It should be the preferred guard to use over canActivate or canLoad which is deprecated in v15. canMatch has benefits of both worlds, it controls when the route can be used and as a side effect, whether we can download the code. In reality, this means that the chunk won't be loaded if the guard returns false but it will also be invoked/triggered every time the user tries to navigate. This is different from canLoad, which won't load the chunk, but once the guard returns true, it won't be called again which can cause some undesirable consequences, and canActivate which will be called every time, but that also means that chunk will be loaded in all cases. You can read more in the following blog post or in the Angular team's PR description.

No subscriptions in guards
Asynchronous guards are common, but they should not subscribe to anything; they should return an observable.

To demonstrate this on an example, imagine we have AuthService and the getUserData method which returns an observable. The observable will return the User model if the user is authenticated or emit an error if not.

We would like to implement a guard which allows only authenticated users to navigate to the route.
```javascript
// bad
class UserAuthorizedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    const authStatus$ = new Subject();

    this.authService.getUserData().subscribe((user: User) => {
      authStatus$.next(true);
      authStatus$.complete();
    }, (error) => {
      console.error('User not authorized!', error);

      authStatus$.next(false);
      authStatus$.complete();
    })

    return authStatus$;
  }
}

// good
class UserAuthorizedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserData().pipe(
      catchError((error) => {
        console.error('User not authorized!', error);

        return observableOf(false);
      }),
      map(Boolean), // we could technically omit this mapping to Boolean since User model will be a truthy value anyway
    )
  }
}
```

## Be mindful of how and when the data is fetched
There are two basic approaches to data loading:

1. Via route resolve guards
2. Via container components

### Resolve guards

A resolve guard can be used to pre-fetch the data necessary for component rendering. The advantages of using resolve guards are:
- No need to fetch data on component initialization
Data is fetched during the routing event and ready when the component is initialized
- No need to implement logic for not showing the component until the data is fetched
When the component starts rendering, you know you will have the data
- A loader showing/hiding logic can be implemented in one place instead of in each component that loads data
If data is loaded via a resolve guard for all routes, you can have a global loader logic which hooks into router events, thus implementing the loaded showing/hiding logic only once

## Container components

Even though guards are really easy to use and have some advantages, there might be situations where the data has to be loaded through multiple requests or the loading might be slow. In those cases, it might be worth to consider using a container component for data loading instead of guards. The container component would use some service to make the requests and then show the data once the requests have been completed. In this way, it is possible to show partial data as it comes in, and implement empty state design for each chunk of data that is shown.

A good example where partial data loading via a container component can be preferred over all-at-once loading via guards is a dashboard-like page with multiple graphs where each graph shows data from one request. In such cases, it is probably better to let the container component handle data loading, and presentational components (graphs) should implement an empty state with some nice loaders.

Bottom line:
- Use resolve guards if route data can be loaded in one big chunk and is also shown all-at-once.
- Use container components if data is loaded in chunks and results should be shown as they come in.

# The single observable pattern
Did you ever find yourself in the ng-container nesting hell? It might have looked something like this:
```html
<ng-container *ngIf="frameworkName1$ | async as frameworkName1">
  <ng-container *ngIf="frameworkName2$ | async as frameworkName2">
    <ng-container *ngIf="frameworkName3$ | async as frameworkName3">
      {{ frameworkName1 }} is way better than {{ frameworkName2 }}. I will not even talk about {{ frameworkName3 }}.
    </ng-container>
  </ng-container>
</ng-container>
```
There is a simple solution to this problem, and it is called the single data observable pattern. In short, this pattern takes advantage of the reactive programming paradigm introduced with RxJS to combine multiple observable streams into one, allowing us to reduce the amount of nested subscriptions in the template. In its purest form, it allows us to have only one subscription in the template (one async pipe). You can also utilize this pattern to create multiple combined observables instead of having many more individual subscriptions.

The example above could be refactored to use the single data observable pattern:
```javascript
@Component(...)
export class MyComponent {
  private readonly frameworkName1$ = ...;
  private readonly frameworkName2$ = ...;
  private readonly frameworkName3$ = ...;

  public readonly frameworkNames$ = combineLatest([
    frameworkName1$,
    frameworkName2$,
    frameworkName3$,
  ]).pipe(map(([
    frameworkName1,
    frameworkName2,
    frameworkName3,
  ]) => {
    return {
      frameworkName1,
      frameworkName2,
      frameworkName3,
    }
  }))
}
```
```html
<ng-container *ngIf="frameworkNames$ | async as frameworkNames">
  {{ frameworkNames.frameworkName1 }} is way better than {{ frameworkNames.frameworkName2 }}. I will not even talk about {{ frameworkNames.frameworkName3 }}.
</ng-container>
```
