---
title: MDX and react
sidebar_position: 6
---

You can write your own component and use along with markdown file!.

## Importing Component

You can create it as component inside `src/component`.

```ts title="src/component/Highlist.tsx"
import React from 'react';

export default function Highlight({children, color}) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: '#fff',
        padding: '0.2rem',
      }}>
      {children}
    </span>
  );
}
```

For those markdown file you wanted to use this component, you can just import it.

```markdown
import Highlight from '@site/src/components/Highlight';

<Highlight color="#25c2a0">Docusaurus green</Highlight>
```

import Highlight from '@site/src/components/Highlight';

<Highlight color="#25c2a0">Docusaurus green</Highlight>

I can conveniently use <Highlight color="#25c2a0">Docusaurus green</Highlight> everywhere!


## Importing Markdown
You can use Markdown files as components and import them elsewhere, either in Markdown files or in React pages.

By convention, using the _ filename prefix will not create any doc page and means the Markdown file is a "partial", to be imported by other files.


```markdown title="_markdown-partial-example.mdx"
<span>Hello {props.name}</span>

This is text some content from `_markdown-partial-example.mdx`.
```

```ts title="some-other-md.md"
import PartialExample from './_markdown-partial-example.mdx';

<PartialExample name="Sebastien" />
```

import PartialExample from './_markdown-partial-example.mdx';

<PartialExample name="Sebastien" />

## Inline styling

:::warning

MDX IS JSX
Since all doc files are parsed using MDX, anything that looks like HTML is actually JSX. Therefore, if you need to inline-style a component, follow JSX flavor and provide style objects.

```
/* Instead of this: */
<span style="background-color: red">Foo</span>
/* Use this: */
<span style={{backgroundColor: 'red'}}>Foo</span>
```

:::
