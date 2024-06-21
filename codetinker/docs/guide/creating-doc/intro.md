---
title: Docs
sidebar_position: 2
---


All of the **Docs** should put under `docs` folder.

This is what the structure of the folder should looks like.

```
website # root directory of your site
├── docs
│   └── doc1
|   └── doc-you-want-to-create
|       └── markdown-file
├── src
│   └── pages (custom any page you want)
├── docusaurus.config.js
├── ...
```

You should create a folder under `docs` folder before you start a new docs. For existing docs, you can keep adding markdown file or folder inside to create new page.

The url path of the page will follow the folder structure, so you no need to take care about the path, just focus on documentation😎.

## Category

If you want to have let other people to have quick access or overview on a category, you can create `_category_.json` in the folder.

```js title="your-doc-folder"
{
    "label": "Custom Your Label",
    "position": 2,
    "link": {
      "type": "generated-index",
      "description": "This some basic things you should know before your start doing markdown."
    }
  }
```


You can have **multiple doc** at once, and each doc can have their own side bar, based on the folder. 

## Navbar

You can add item to Navbar to so you can have multiple page

:::note
All files prefixed with an underscore (_) under the docs directory are treated as "partial" pages and will be ignored by default.

Read more about [importing partial pages](/guide/getting-start/mdx-and-react#importing-markdown).
:::