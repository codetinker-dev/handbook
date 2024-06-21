# Best Practices - Get to know the RxJS operators
To make good use of RxJS and develop the application in a reactive way, it is important to utilize the operators. RxJS operators allow you to modify the stream of data in multiple ways. Some common operators are:

- map
- filter
- tap (replaces .do)
- delay
- debounceTime
- distinctUntilChanged
- catchError (replaces .catch)
- switchMap

You can also write your own operators. If you do so, it is strongly recommended to write them as pure pipeable operator functions.

Covering all the various operators is out of the scope of this handbook. Please refer to some of the learning resources mentioned earlier [1] [2].

<br/><br/>
## tap() vs subscribe()
---------------
When to use the tap operator in Rx flow? As per the official documentation for the tap operator, it should be used when performing "side-effects". This means that the operator should be used when the user wants to "affect outside state with a notification without altering the notification". Although side-effects can be performed inside of the map operator, we should strive to write pure functions wherever possible and have a clear separation of responsibilities. This is one of the cases where the tap operator comes in handy. Since the tap operator's callback is the same as the subscriber's next callback, nothing stops us from writing the same logic in either of those places. Well, nothing besides semantics. When writing Rx flows, we should convey as much information as we can just through our code, which means - use tap for performing side-effects and debugging/logging mostly, whereas subscribe represents the end of the flow which means that we have probably received some data which can then be used in application. This makes subscribe callback the correct place to do something with the data you've received through piped operators. This is also why an empty subscribe call is basically a code smell. Of course, there are exceptions when you cannot avoid using an empty subscribe(), but you should be mindful of it.
```javascript
// Bad
source$.pipe(
  tap(() => {
    this.router.navigate(['some-route']);
  }),
).subscribe();
```
In the example above, we are navigating to a new location before we've reached the end of the flow which doesn't make too much sense. We could possibly add another operator in the flow which would make this approach even more wrong, especially if you forget to reorder operators so that the tap comes after all of the newly added mapping operators.
```javascript
// Better
source$.subscribe(() => {
  this.router.navigate(['some-route']);
})
```
The example above is more correct. Navigation and other, similar actions should be executed at the end of the Rx flow, which is in the subscribe's next callback.

<br/><br/>
## Observables and async/await
---------------
You can use async/await to await for the completion of observables. Keep in mind that this probably does not make too much sense for observables that emit more than one value, but it might be OK for things like HTTP requests.

To convert an observable to a promise, just call obs$.toPromise() and then you can await it.

One important thing to note is that you are waiting for the completion, not emission of values. Knowing that, what do you expect the result to be in the following example?
```javascript
const source$: Subject<string> = new Subject();
const sourcePromise: Promise<string> = source$.toPromise();

source$.next('foo');
source$.next('bar');
source$.complete();

const result = await sourcePromise;
```
Spoiler alert! The result will be bar, and if we do not complete the source observable, awaiting will hang indefinitely.

<br/><br/>
## Avoid manual subscriptions and asynchronous property assignment
---------------
We recommend avoiding making manual subscription calls and asynchronous property assignment. The code example below has some comments indicating what is meant by "manual subscription" and "asynchronous property assignment".

It is best to leave subscription handling to the async pipe because it:
- Encourages reactive programming
- Handles unsubscribing automatically
- Works well with OnPush change detection
- Avoids the need to do asynchronous property assignment
Component:
```javascript
// bad
@Component(...)
export class ArticlesList {
  public articles: Array<Article>;

  constructor(...) {
    this.articleService.fetchArticles().subscribe((articles) => { // manual subscription
      this.articles = articles; // asynchronous property assignment
    });
  }
}

// good
@Component(...)
export class ArticlesList {
  public readonly articles$: Observable<Array<Article>> = this.articleService.fetchArticles();

  constructor(...) { }
}
```
Template:
```html
<!-- bad -->
<my-app-article-details
  *ngFor="let article of articles"
  [article]="article"
></my-app-article-details>

<!-- good -->
<my-app-article-details
  *ngFor="let article of articles$ | async"
  [article]="article"
></my-app-article-details>
```

<br/><br/>
## Avoid concatenation of translation keys
---------------
A common requirement for applications is that the application must be localized. Regardless of the library which is used for fetching the translations,, we should avoid concatenation of translation keys. Concatenating translation keys makes managing of translation keys harder. It could prove very tiresome to keep the translations file in sync with translations that are used throughout the application, if you have to search for partial strings instead of searching for the whole string. One of the most tempting cases for using concatenation is when you iterate over some enum and match those values with the ones received from the backend service.

```javascript
enum ApprovalStatus{
  Approved = 'Approved',
  Rejected = 'Rejected',
  NotApplicable = 'N/A',
}
```

```html
<mat-radio-button *ngFor="let approvalStatus of approvalStatusOptions">
  {{ 'enums.approvalStatus.' + approvalStatus | translate }}
</mat-radio-button>
```

In the example above, you also have to make sure that you create `approvalStatusOptions` structure which will be iterable and used in the ngFor directive. In cases where enum keys don't match their values, there is also the question of storing translation keys in a way that will make the most sense. Should you use enum keys in the translations file, or should you use enum values corresponding to that key?

Another case that emphasizes the issue with this approach is when you need to add some new keys. You have to verify that you've added them to potentially multiple places and that everything will work together as intended.

A pattern that proved to work well for us is the "translatable enum" pattern which relies on using TypeScript's Record utility type and for which we've implemented EnumPropertyPipe that is available in the `ngx-nuts-and-bolts` library.

```javascript
enum ITranslatableEnum {
  translationKey: string;
}

export enum ApprovalStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  NotApplicable = 'N/A',
}

export const approvalStatusData: Record<ApprovalStatus, ITranslatableEnum> = {
    [ApprovalStatus.Approved]: {
        translationKey: 'enums.approvalStatus.approved',
    },
    [ApprovalStatus.Rejected]: {
        translationKey: 'enums.approvalStatus.rejected',
    },
  [ApprovalStatus.NotApplicable]: {
        translationKey: 'enums.approvalStatus.notApplicable',
    },
};

@Component({
  selector: 'demo-component',
  template: `
  <mat-radio-button *ngFor="let approvalStatus of approvalStatusOptions">
    {{ approvalStatus | enumProperty: approvalStatusData | translate}}
  </mat-radio-button>
  `
})
class DemoComponent{

  public readonly ApprovalStatus = ApprovalStatus;
  public readonly approvalStatusData = approvalStatusData;
}
```

By using this approach, your translation keys are all in one place, easing refactoring and keeping the translation file clean and up to date. You will also get compilation errors if a new enum is added without adding a corresponding entry with the translation key in the record. You can further expand on this pattern by adding additional "metadata" about the enum to the record. For example, a sortingIndex property that is taken into account when the enum values are rendered as dropdown options.

<br/><br/>
## Avoid unnecessary creation of multiple observables and avoid subscriptions
---------------
Taking the learnings from all the previous examples and the fact that we can use services during initial assignment, we can greatly simplify initialization of observables and their usage in templates.

In this example, we have to fetch the user by ID. The ID is read from route parameters.
```javascript
// bad
@Component({
  template: `
  <ng-container *ngIf="user">
    {{ user.name }}
  </ng-container>
  `,
  ...
})
class MyComponent {
  public user: UserModel;
  private userSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {
    this.userSubscription = this.route.params.pipe(switchMap((params: Params) => {
      return this.usersService.fetchById(params.userId);
    })).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
```
This is bad because it will not work correctly with OnPush change detection and we have to take care of subscriptions manually - it is easy to forget to unsubscribe and we have to introduce ngOnDestroy.
```javascript
// even worse
@Component({
  template: `
  <ng-container *ngIf="user$ | async as user">
    {{ user.name }}
  </ng-container>
  `,
  ...
})
class MyComponent {
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {}

  public get user$(): Observable<UserModel> {
    return this.route.params.pipe(switchMap((params: Params) => {
      return this.usersService.fetchById(params.userId);
    }));
  }
}
```
Here we no longer have to take care of unsubscribing, but the issue now is that during each template check, user$ getter will be called. In Example #4 in one of the previous sub-chapters we had a case where using a getter was fine, but in this case it is not. Each time it is called it creates a new observable, template will subscribe to this new observable during each change detection, meaning that a new subscription will trigger another API call every CD cycle - which is unnecessary.
```javascript
// good
@Component({
  template: `
  <ng-container *ngIf="user$ | async as user">
    {{ user.name }}
  </ng-container>
  `,
  ...
})
class MyComponent {
  public user$: Observable<UserModel> = this.route.params.pipe(switchMap((params: Params) => {
    return this.usersService.fetchById(params.userId);
  }));

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {}
}
```
Finally the correct solution simply assigns user$ to an observable which is created only once. The template will have only one subscription and we will just react to updates in the data stream which happen when params change.

If the observable creation pipeline gets larger, you can move it to a private method like so:
```javascript
// good
@Component(...)
class MyComponent {
  public user$: Observable<UserModel> = this.createUserObservable();

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {}

  private createUserObservable(): Observable<UserModel> {
    return this.route.params.pipe(switchMap((params: Params) => {
      return this.usersService.fetchById(params.userId);
    }));
  }
}
```

<br/><br/>
## Subscribe as late as possible and use the operators
---------------
If you are new to RxJS, you will probably be overwhelmed by the amount of operators and the "Rx-way" of doing things. To do things in the "Rx-way", you will have to embrace the usage of operators and think carefully when and how you subscribe.

A rule of thumb is to subscribe as little and as late as possible, and do minimal amount of work in subscription callbacks.

We will demonstrate this with an example. Imagine you have a stream of data to which you would like to subscribe and transform the data in some way.
```javascript
interface IUser {
  id: number;
  user_name: string;
  name: string;
  surname: string;
}
```
/account/me returns JSON:
```javascript
{
  "id": 42,
  "user_name": "TheDude",
  "name": "Jeff",
  "surname": "Lebowski"
}
// bad
const user$: Observable<IUser> = http.get('/account/me');

user$.subscribe((response: IUser) => {
  console.log(response.user_name); // TheDude
});
// good
const userName$: Observable<string> = http.get('/account/me').pipe(
  map((response: IUser) => response.user_name)
);

userName$.subscribe(console.log); // TheDude
```
The reason why is because there might be multiple subscribers who want the same thing, and they would all have to do the same transformation in their respective success callbacks.

It is, of course, possible that the subscribers want different things, and for those cases you might want to expose some observable with fewer piped operations.

The point here is that, as soon as you notice that you are repeating yourself in subscription callbacks, you should move that repeated logic into some operator that is piped to the source observable.

<br/><br/>
## Do not use observables if unnecessary
---------------
We recommend using OnPush change detection strategy. This means that some things that work with Default CD will no longer work when you start using OnPush CD. The best way to make things work again is to take a reactive approach when designing the component and utilize the Observables, operators and async pipe.

However, there are cases when you do not need an Observable. Sometimes, direct values work just as fine. Do not implement an Observable if it is not needed, it will just add some unnecessary overhead.

Here is an example where an observable is unnecessary:
```javascript
<!-- bad -->
{{ someNumber }}! = {{ factorialOfTheNumber$ | async }}
// bad
@Component(...)
export class MyComponent implements OnChanges {
  @Input() public someNumber: number = 0;
  public readonly factorialOfTheNumber$ = new BehaviorSubject<number>(1);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.someNumber) {
      this.factorialOfTheNumber$.next(calculateFactorial(changes.someNumber.currentValue));
    }
  }
}
<!-- good -->
{{ someNumber }}! = {{ factorialOfTheNumber }}
// good
@Component(...)
export class MyComponent implements OnChanges {
  @Input() public someNumber: number = 0;
  public readonly factorialOfTheNumber = 1;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.someNumber) {
      this.factorialOfTheNumber = calculateFactorial(changes.someNumber.currentValue);
    }
  }
}
```
This can be a result of confusion about how OnPush CD works. If factorialOfTheNumber$ is not an observable and is a direct value, it might be unclear if the template will be re-rendered or not. The answer is - yes, the template will be re-rendered correctly. While it is true that direct property assignment with OnPush CD can sometimes result in template not being re-rendered, that usually happens only when assigning in an asynchronous piece of code. If the calculateFactorial calculation is synchronous (as it is in this example), then we can assign the value directly, without the need to wrap it in an Observable.

Remember, any property assignments that are done synchronously in ngOnChanges will get rendered correctly. This is because CD is run synchronously after all the code in ngOnChanges is executed. This is true for both OnPush and Default CD.

<br/><br/>
## Consider not using ngOnChanges and use pure pipes
---------------
Building on the previous example with unnecessary Observables, we will go one step further and try to eliminate the ngOnChanges lifecycle hook altogether.

To do this, we have to understand how pipes work. Pipes can have multiple input values and one output value. Input values are mapped to the output value in the transformation method. Impure pipes will execute the transformation method on each change detection cycle. This is probably not optimal nor the desired behaviour in most situations. On the other hand, pure pipes will execute the transformation method only if some of the input values change. All pipes are pure by default, and that is great! You can read more about pipes here.

We can not utilize the knowledge of pure pipes and update our component:
```javascript
{{ someNumber }}! = {{ someNumber | factorial }}
@Component(...)
export class MyComponent implements OnChanges {
  @Input() public someNumber: number = 0;
}
@Pipe({ name: 'factorial' })
export class FactorialPipe implements PipeTransform {
  public transform(value: number): number {
    return calculateFactorial(value);
  }
}
```
We have greatly reduced the amount of code in our component and have created a reusable piece of code in the form of a pure pipe. This pipe can be reused in other places, but it is also ok if it is used in only this one component's template. If it is not reused in other places, it is ok to leave the pipe implementation file alongside the component module file and declare it in the component's module.

You might ask a question "But what if I need to use the factorial value inside my component code?". The solution depends on how and when you need to use the value that is calculated by the pipe. If you need to access the value on some user interaction, you can pass the calculated value from the template to the action handler method. This is great because it keeps your methods pure.

```html
<ng-container *ngIf="someNumber | factorial as someNumberFactorial">
  {{ someNumber }}! = {{ someNumberFactorial }}

  <button (click)="saveFactorialValue(someNumberFactorial)">Save the factorial value</button>
</ng-container>
```

```javascript
@Component(...)
export class MyComponent implements OnChanges {
  @Input() public someNumber: number = 0;

  public saveFactorialValue(someNumberFactorial): void {
    // do something with someNumberFactorial
  }
}
```
Some notes:

We wrapped everything in one ng-container to avoid calling the pipe twice
Be careful in case that your pipe can return a valid falsy value, as in that case the *ngIf will not render the content; in such case you might consider using a custom *ngLet structural directive

