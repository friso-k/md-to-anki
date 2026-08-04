# markdown-to-anki

Convert a folder of Markdown flashcards into an Anki TSV import file.

```sh
npm install
npm start
```

The script requires a folder/ For this demo you can use the supplied flash cards about 'shamatha':
```shell
npm start ./data/shamatha-demo
```
By default, the output file is the deck name with a `.tsv` extension.

```sh
npm start --deck "Programming" --output programming.tsv
```

If you don't want to clone this project, just run it with npx:
```sh
npx @dev.fri.so/md-to-anki
```

Calling it without a folder prints the help menu.

Each Markdown file should contain front and back content separated by a `---`
line. The front and back are converted from Markdown to HTML before import, so
formatting such as headings, emphasis, lists, links, code, and line breaks is
preserved in Anki. YAML frontmatter is optional, may be blank, or may contain
optional `tags`. Card IDs are generated from the deck name and Markdown filename.

```md
---
tags:
  - web
  - html
---

What is HTML?

---

HyperText Markup Language
```

No frontmatter is also valid:

```md
What is HTML?

---

HyperText Markup Language
```

Options:

```text
folder                  folder containing Markdown flashcard files
-d, --deck <name>       deck name; defaults to the folder name
-o, --output <file>     TSV output file; defaults to <deck>.tsv
--max-depth <number>    maximum folder depth to scan
```
