::: column
# Quick start
First, to contribute to `zenika-open-source/cheatsheets` you must have an account on [github](https://github.com/).

Then you have to clone [git repository](https://github.com/zenika-open-source/cheatsheets/) and create a branche named `feature/YOUR_CHEATSHEET` (e.g. `feature/quick_start`).

# Architecture

Now you can create a new folder `cheatsheets/YOUR_CHEATSHEET` with a basic structure :
```
cheatsheet
├── YOUR_CHEATSHEET
│   ├── config.json
│   ├── index.md
│   |   ├── assets
│   |   |   ├── logo.png
```

# Config file

Config file `config.json` represent the metadatas of your cheatsheet.

```json
{
  "template": "grid-flow",
  "mainColor": "#5151c5",
  "secondaryColor": "#3e3e98",
  "name": "Template Column",
  "description": "The description that appear on the main page",
  "categoryId": "iot",
  "icon": "assets/logo.png",
  "templateParams": {...}
}
```

 - **template**: template you want to use, see template list to choose one
 - **mainColor**: your main color, appear in header & footer
 - **secondaryColor**: your secondary color, appear in header & footer
 - **name**: name of the cheatsheet, use in header
 - **description**: a quick description of the content
 - **categoryId**: category id of `/cheatsheets/categories.json` file
 - **icon**: image around 80px x 80px use in header
 - **templateParams**: template specific params, see template cheatsheet

:::
::: column

# Categories

Some categories already exists in project `/cheatsheets/categories.json` file, but you can add one if needed.

To do that you have to add an item in the json array with specific properties 

```json
[
  {
    "id": "category_ref",
    "name": "Category name",
    "icon": "material_icon"
  },
  ...
]
```

- **id**: the reference you can use next id cheatsheet config.json
- **name**: the name display in website
- **icon**: material icon name you can find [on google font website](https://fonts.google.com/icons)

__Note: categories order in json file is important__

# Markdown file

Cheatsheet must be write in *markdown* in the `index.md` file.

Markdown is a lightweight markup language for creating formatted text. You can find next basic syntax of markdown to help you to begin.

Additionally, some template can integrate custom markdown syntax, please refer to the template cheatsheet.

## Heading

```markdown
# Level 1 title
## Level 2 title
### Level 3 title
```

## Formatting

```markdown
**bold text**
*italic text*
~~strikethrough text~~
__emphasis__
> blocquote
`code string`
```
:::
::: column

## List

### Ordered List
```markdown
1. Item 1
2. Item 2
3. Item 3
```

### Unordered List
```markdown
 - Item 1
 - Item 2
 - Item 3
```

## Code
Block of code
```markdown
```lang     => for syntax colorization (e.g.: html, java, ts,...)
```         => end of code block
```

## Separators
```markdown
---
```

## Rich text
```markdown
[title](https://www.link.com)
![alt text](assets/image.png)
```

## Table

```markdown
|  Header 1   | Header 2    | Header 3 |    Header 4 |
| ----------- |:------------|:--------:|------------:|
|   cell 1    | aligne left | centered | align right |
|   cell 1    | cell 2      |  cell 3  |      cell 4 |
```

---

The markdown text above will generate the HTML table bellow :

&nbsp;

&nbsp;

| Header 1         | Header 2    | Header 3 |    Header 4 |
|------------------|:------------|:--------:|------------:|
| cell 1           | aligne left | centered | align right |
| cell 1           | cell 2      |  cell 3  |      cell 4 |

:::
::: column
# Test & render

For now, to test you have to start cheatsheet engine locally on your computer. You have to :
 - install LTS version of [NodeJS](https://nodejs.org/fr)
 - start a shell (terminal on linux or powershell on windows)
 - navigate to root of cheatsheet project (where you can find `package.json` file)
 - execute `npm install` and wait execution
 - execute `npm run start:dev`

This last command will start a webserver and refresh it at every changes on your files.

You can now access your local instance of cheatsheets at [http://localhost:8080/](http://localhost:8080/).

# Deploy

Hop hop hop ! Before deploying your great job, you have to submit your work to the community for review.

Push your work on your previoulsy created git branch and go to [github](https://github.com/zenika-open-source/cheatsheets/pulls) to submit a pull request.
- Select `Pull requests` tab at the top of the page
- Click on `Create pull request`
- In `base` drop down, select your branche
- Make sure `compare` branche is `main`
- Then click on `Create pull request`

You can write a message to explain why you write this cheatsheet and add some useful information to reviewers.

Now you can wait for a review, your incredible cheatsheets will be merge as soon as possible.
:::