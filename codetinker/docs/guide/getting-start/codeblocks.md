---
title: Codeblocks
sidebar_position: 5
---

In codeblock you can customise even further, specific a title or higlight line of code as you want.


## Codeblock with title
```jsx title="Codeblock"
function Greeting(props) {
  return <p>Welcome, {props.userName}!</p>;
}

export default Greeting;
```

## Highlight
```jsx title="Highlight Lines"
function HighlightText(highlight) {
  if (highlight) {
    // highlight-next-line
    return 'This text is highlighted!';
  }
  return 'Nothing highlighted';
}

function HighlightMoreText(highlight) {
  // highlight-start
  if (highlight) {
    return 'This range is highlighted!';
  }
  // highlight-end
  return 'Nothing highlighted';
}
```

## Line number
```jsx title="Line Numbers" showLineNumbers
import React from 'react';

function UserProfile(props) {
  const { username, email, isAdmin } = props;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      {isAdmin && <p>Admin User</p>}
    </div>
  );
}

export default UserProfile;
```

## Line number with highlight

```jsx title="Line Numbers with Highlight" {4,9-11} showLineNumbers
import React from 'react';

function UserProfile(props) {
  const { username, email, isAdmin } = props;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      {isAdmin && <p>Admin User</p>}
    </div>
  );
}

export default UserProfile;
```