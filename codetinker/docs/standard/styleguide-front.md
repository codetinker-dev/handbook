---
id: standard-guideline-front
title: Front-end standard
tags:
  - Code
  - Standard
sidebar_position: 2
---


https://infinum.com/handbook/frontend/styleguide

# References

Avoid using `var`. If you're working with values that don't change, use `const`. In other cases, use `let`.
Note that both `let` and `const` are block-scoped.

```javascript
// const and let only exist in the blocks they are defined in.
{
    let a = 1;
    const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

# Objects

Use computed property names when creating objects with dynamic property names.

```javascript
function getKey(k) {
    return `a key named ${k}`;
}

// bad
const obj = {
    id: 5,
    name: 'San Francisco',
};
obj[getKey('enabled')] = true;

// good
const obj = {
    id: 5,
    name: 'San Francisco',
    [getKey('enabled')]: true,
};
```

Use object method shorthand.

```javascript
// bad
const atom = {
    value: 1,

    addValue: function (value) {
        return atom.value + value;
    },
};

// good
const atom = {
    value: 1,

    addValue(value) {
        return atom.value + value;
    },
};
```

Use property value shorthand. Group your shorthand properties at the beginning of your object declaration.

```javascript
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
    episodeOne: 1,
    twoJediWalkIntoACantina: 2,
    lukeSkywalker: lukeSkywalker,
    episodeThree: 3,
    mayTheFourth: 4,
    anakinSkywalker: anakinSkywalker,
};

// good
const obj = {
    lukeSkywalker,
    anakinSkywalker,
    episodeOne: 1,
    twoJediWalkIntoACantina: 2,
    episodeThree: 3,
    mayTheFourth: 4,
};
```

Quote only properties that are invalid identifiers.

# Arrays

Use array spreads ... to copy arrays.

```javascript
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
    itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

To convert an array-like object to an array, use Array#from.

```javascript
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```

# Destructuring

Use object destructuring when accessing and using multiple properties of an object.

```javascript
// bad
function getFullName(user) {
    const firstName = user.firstName;
    const lastName = user.lastName;

    return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
    const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
    return `${firstName} ${lastName}`;
}
```

Use array destructuring.

```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
Use object destructuring for multiple return values, not array destructuring.

// bad
function processInput(input) {
  // then a miracle occurs
  return [left, right, top, bottom];
}

// the caller needs to think about the order of return data
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // then a miracle occurs
  return { left, right, top, bottom };
}

// the caller selects only the data they need
const { left, right } = processInput(input);
When programmatically building up strings, use template strings instead of concatenation.

// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// bad
function sayHi(name) {
  return `How are you, ${ name }?`;
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

# Variables

Group all your consts and then group all your lets.

```javascript
// bad
let i, len, dragonball,
    items = getItems(),
    goSportsTeam = true;

// bad
let i;
const items = getItems();
let dragonball;
const goSportsTeam = true;
let len;

// good
const goSportsTeam = true;
const items = getItems();
let dragonball;
let i;
let length;
Assign variables where you need them, but place them in a reasonable place.

// bad - unnecessary function call
function checkName(hasName) {
  const name = getName();

  if (hasName === 'test') {
    return false;
  }

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}

// good
function checkName(hasName) {
  if (hasName === 'test') {
    return false;
  }

  const name = getName();

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}
```

# Functions

Never use arguments; opt to use rest syntax ... instead.

```javascript
// bad
function concatenateAll() {
    const args = Array.prototype.slice.call(arguments);
    return args.join('');
}

// good
function concatenateAll(...args) {
    return args.join('');
}
```

Use default parameter syntax rather than mutating function arguments.

```javascript
// really bad
function handleThings(opts) {
    // No! We shouldn't mutate function arguments.
    // Double bad: if opts is falsy, it'll be set to an object which may
    // be what you want but it can introduce subtle bugs.
    opts = opts || {};
    // ...
}

// still bad
function handleThings(opts) {
    if (opts === void 0) {
        opts = {};
    }
    // ...
}

// good
function handleThings(opts = {}) {
    // ...
}
```

Always put the default parameters last.

```javascript
// bad
function handleThings(opts = {}, name) {
    // ...
}

// good
function handleThings(name, opts = {}) {
    // ...
}
```

# Arrow functions

When you must use function expressions (e.g., when passing an anonymous function), use arrow function notation.

```javascript
// bad
[1, 2, 3].map(function (x) {
    const y = x + 1;
    return x * y;
});

// good
[1, 2, 3].map((x) => {
    const y = x + 1;
    return x * y;
});
```

If the function body consists of a single expression, omit the braces and use the implicit return. Otherwise, keep the braces and use a return statement.

```javascript
// good
[1, 2, 3].map((number) => `A string containing the ${number}.`);

// bad
[1, 2, 3].map((number) => {
    const nextNumber = number + 1;
    `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number) => {
    const nextNumber = number + 1;
    return `A string containing the ${nextNumber}.`;
});
```

In case the expression spans over multiple lines, wrap it in parentheses for better readability.

```javascript
// bad
[1, 2, 3].map((number) => 'As time went by, the string containing the ' + `${number} became much longer. So we needed to break it over multiple ` + 'lines.');

// good
[1, 2, 3].map((number) => `As time went by, the string containing the ${number} became much ` + 'longer. So we needed to break it over multiple lines.');
```

Avoid confusing arrow function syntax `(=>)` with comparison operators `(<=, >=)`.

```javascript
// bad
const itemHeight = (item) => (item.height > 256 ? item.largeSize : item.smallSize);

// bad
const itemHeight = (item) => (item.height > 256 ? item.largeSize : item.smallSize);

// good
const itemHeight = (item) => {
    return item.height > 256 ? item.largeSize : item.smallSize;
};
```

# Commas

Use an additional trailing comma. This leads to cleaner git diffs. Also, transpilers like Babel will remove the additional trailing comma in the transpiled code, which means you don't have to worry about the trailing comma problem in legacy browsers.

```javascript
// bad - git diff without trailing comma
const hero = {
     firstName: 'Florence',
-    lastName: 'Nightingale'
+    lastName: 'Nightingale',
+    inventorOf: ['coxcomb graph', 'modern nursing']
};

// good - git diff with trailing comma
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing'],
};

// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
};

const heroes = [
  'Batman',
  'Superman'
];

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};

const heroes = [
  'Batman',
  'Superman',
];
```
