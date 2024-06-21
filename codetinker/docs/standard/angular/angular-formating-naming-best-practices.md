# Best Practices

## If you are passing data to a component, use property binding only if necessary

In the following example, property binding is unnecessary because we are assigning a string value.

```html
<!-- bad -->
<my-app-component [name]="'Steve'"></my-app-component>

<!-- good -->
<my-app-component name="Steve"></my-app-component>
```

## Prefix output handlers with on

```html
<!-- bad -->
<my-app-component (somethingHappened)="somethingHappened($event)">
    <!-- bad -->
    <my-app-component (onSomethingHappened)="somethingHappened($event)">
        <!-- bad -->
        <my-app-component (onSomethingHappened)="onSomethingHappened($event)">
            <!-- good -->
            <my-app-component (somethingHappened)="onSomethingHappened($event)"></my-app-component></my-app-component></my-app-component
></my-app-component>
```

## Name click handlers in a short and descriptive manner

```html
<!-- bad -->
<button (click)="onClick()">Log in</button>

<!-- bad - use infinitive instead of past form -->
<button (click)="onLogInClicked()">Log in</button>

<!-- bad - too many words -->
<button (click)="onLogInButtonClick()">Log in</button>

<!-- good -->
<button (click)="onLogInClick()">Log in</button>
```

## Use the optional chaining operator

```html
<!-- bad -->
<div *ngIf="user && user.loggedIn"></div>

<!-- good -->
<div *ngIf="user?.loggedIn"></div>
```

## Order/group attributes and bindings
1. Structural directives (`*ngFor`, `*ngIf`, etc.)
2. Animation triggers (`@fade, [@fade]`)
3. Element reference (`#myComponent`)
4. HTML attributes (class, etc.)
5. Non-interpolated string inputs and attributes (`foo="bar"`)
6. Interpolated inputs (`[bar]="theBar"`)
7. Two-way bindings (`[(ngModel)]="email"`)
8. Outputs (`(click)="onClick()"`)

```html
<!-- bad -->
<my-app-component
  (click)="onClick($event)"
  [(ngModel)]="fooBar"
  class="foo"
  #myComponent
  [bar]="theBar"
  @fade
  foo="bar"
  *ngIf="shouldShow"
  (someEvent)="onSomeEvent($event)"
></my-app-component>

<!-- good -->
<my-app-component
  *ngIf="shouldShow"
  @fade
  #myComponent
  class="foo"
  foo="bar"
  [bar]="theBar"
  [(ngModel)]="fooBar"
  (click)="onClick($event)"
  (someEvent)="onSomeEvent($event)"
></my-app-component>
```

## [class] vs [ngClass] syntax
If you have to set just one class depending on some condition, `[class.class-name]="condition"` is the way to go. Example:
```html
<div [class.active]="isActive"></div>
```
If you need to set many classes, `[ngClass]="{ ... }"` is the way to go. Example:
```html
<div [ngClass]="{ 'active': isActive, 'main-item': isMainItem, 'accent': isAccent }"></div>
```

## Ordering the class members (including getters and lifecycle hooks)
Follow this guideline when ordering class members:
1. @Inputs
2. @Outputs
3. properties
4. constructor
5. getters and setters
6. lifecycle hooks
7. methods
Example:
```javascript
class MyComponent implements OnInit, OnChanges {
  @Input() public i1: string;
  @Input() public i2: string;
  @Output() public o2: EventEmitter<string> = new EventEmitter();
  public attr1: number;
  protected attr2: string;
  private attr3: Date;

  constructor(...) { ... }

  public get computedProp(): string { ... }

  private get secretComputedProp(): number { ... }

  public ngOnInit(): void { ... }

  public ngOnChanges(): void { ... }

  public onSomeButtonClick(event: MouseEvent): void { ... }

  private someInternalAction(): void { ... }
}
```

## Always safe-guard ngOnChanges
```javascript
// bad
@Component(...)
class MyComponent {
  @Input() public input1: string;
  @Input() public input2: string;
  private upperCaseInput1: string;

  public ngOnChanges() {
    this.upperCaseInput1 = this.input1.toUpperCase();
  }
}
```
The problem with not checking which specific change was triggered is that whatever computation is done might be done unnecessarily. You should add checks so that the action is executed only when the related inputs change and ignore changes of other inputs. In above example upperCaseInput1's value depends only on input1's value, but the assignment will be executed even if only input2 changes, which is unnecessary.
```javascript
// good
@Component(...)
class MyComponent {
  @Input() public input1: string;
  @Input() public input2: string;
  private upperCaseInput1: string;

  public ngOnChanges(changes) {
    if (changes.input1) {
      this.upperCaseInput1 = this.input1.toUpperCase()
    }
  }
}
```

## Extract ngOnChanges logic into methods
If `ngOnChanges` contains some logic, it is often a good idea to separate that logic into private methods to increase readability of `ngOnChanges` method.

```javascript
// bad
@Component(...)
class MyComponent {
  @Input() public user: UserModel;
  public userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.userForm = this.fb.group({
        name: this.user.name,
        ...
      });
    }
  }
}
// good
@Component(...)
class MyComponent {
  @Input() public user: UserModel;
  public userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.createUserForm();
    }
  }

  private createUserForm(): void {
    this.userForm = this.fb.group({
      name: this.user.name,
      ...
    });
  }
}
```
We can even go one step further and make things pure:
```javascript
// even better
@Component(...)
class MyComponent {
  @Input() public user: UserModel;
  public userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.userForm = this.createUserForm(changes.user.currentValue);
    }
  }

  private createUserForm(user: UserModel): FormGroup {
    return this.fb.group({
      name: user.name,
      ...
    });
  }
}
```
## Prefer using ngOnChanges over ngOnInit
In this example we want to react on input changes and call some action.
```javascript
//bad
@Component(...)
class MyComponent {
  @Input() public label: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.label) {
      this.someActions()
    }
  }

  public ngOnInit() {
    this.someActions()
  }

  private someActions() { ... }
}
```
Problem with the above example is that someActions will be called twice, first in `ngOnChanges` and then in `ngOnInit`. Yes, this order seems a bit strange - `ngOnInit` is called after the first `ngOnChanges` call; but this is just how it is.
```javascript
//good
@Component(...)
class MyComponent {
  @Input() public label: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.label) {
      this.someActions()
    }
  }

  private someActions() { ... }
}
```
Look at your use cases and check if you can remove `ngOnInit`. You almost never need `ngOnInit` (more on this in the following sub-chapter). If there are some default input values which should be set, you can do it alongside input declaration (`@Input() label: string = 'default label'`). Any other reactions to input changes should be done in `ngOnChanges`.

## Postfix observables with $
When you want to observe a value, use some of the classes derived from Observable. Most use cases are covered with one of these:
- Subject
- BehaviorSubject
- ReplaySubject
You can subscribe to all classes derived from Observable in order to receive value changes. You can also use operators to manipulate how and when the value changes are sent to the subscribers.

There is a naming convention for Observable variables—postfixing with a dollar sign:
```javascript
// bad
const observable: Observable;

// good
const observable$: Observable;

// good
const mySubject$: Subject;
```
The $ suffix is here to indicate and let you know it is something you can subscribe to, but it does not let you know if you can change the observable in case it is some type of a Subject, e.g. ReplaySubject or BehaviorSubject. This naming convention goes along with the no-exposed-subjects RxJS ESLint rule. The aforementioned rule will cause an error in case you have a publicly exposedSubject. The reasoning behind this is that subjects should never be publicly exposed unless converted to an observable using some pipeable operators or, for example, asObservable function.
```javascript
class ExampleComponent {
  private _isLoading$ = new BehaviorSubject(false); // for internal use for "state management"
  public isLoading$ = this._isLoading$.pipe(debounceTime(250)); // for use in template

  // to be called from some methods, for example during data fetching
  private updateLoadingState(state) {
    this._isLoading$.next(state);
  }
}
```
The potential downside of this convention/pattern is the name separation, in case of a naming conflict, the private member name should be prefixed with the _.