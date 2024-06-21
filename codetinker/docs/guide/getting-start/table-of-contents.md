---
title: Heading and Table of Contents
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 6
---

import TOCInline from '@theme/TOCInline';

## Headers

will show up on the table of contents on the upper right

So that your users will know what this page is all about without scrolling down or even without reading too much.

## Only h2 and h3 will be in the TOC by default.

You can configure the TOC heading levels either per-document or in the theme configuration.

The headers are well-spaced so that the hierarchy is clear.

- lists will help you
- present the key points
- that you want your users to remember
  - and you may nest them
    - multiple times

Table of contents heading level

Each Markdown document displays a table of contents on the top-right corner. By default, this table only shows **h2** and **h3** headings, which should be sufficient for an overview of the page structure. In case you need to change the range of headings displayed, you can customize the minimum and maximum heading level — either per page or globally.

To set the heading level for a particular page, use the `toc_min_heading_level` and `toc_max_heading_level` front matter.

```markdown title="my-markdown-file.md"
---
# Display h2 to h5 headings
toc_min_heading_level: 2
toc_max_heading_level: 6
---
```

## Inline table of contents
Inline table of contents
It is also possible to display an inline table of contents directly inside a Markdown document, thanks to MDX.

The toc variable is available in any MDX document and contains all the headings of an MDX document. By default, only h2 and h3 headings are displayed in the TOC. You can change which heading levels are visible by setting minHeadingLevel or maxHeadingLevel for individual TOCInline components

```markdown title="my-markdown-file.md"
import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} minHeadingLevel={2} maxHeadingLevel={6} />
```


<TOCInline toc={toc} minHeadingLevel={2} maxHeadingLevel={6} />

## Section

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.

### Sub-Section

Some content here.

#### Sub-Sub-Section

Some content here.

##### Sub-Sub-Sub-Section

Some content here.

###### Sub-Sub-Sub-Sub-Section

Some content here.

## Example Section 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.

### Example SubSection 1 a

Some content here.

### Example SubSection 1 b

Some content here.

### Example SubSection 1 c

Some content here.

##### Example SubSection 1 c (i)

Some content here.
