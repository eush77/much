[![npm](https://nodei.co/npm/much.png)](https://nodei.co/npm/much/)

# much

[![Dependency Status][david-badge]][david]

[david-badge]: https://david-dm.org/eush77/much.png
[david]: https://david-dm.org/eush77/much

`much` — pager with depth support.

Fold function and object bodies interactively.

## Example

```
$ much browserify.js
```

![screenshot](screenshot.png)

## CLI

#### `$ much [<file>]`

Consumes `stdin` by default.

## Controls

| key                             | description
| :-----------------------------: | -----------
| <kbd>q</kbd>, <kbd>Ctrl+c</kbd> | Quit.
| <kbd>left</kbd>, <kbd>h</kbd>   | Fold code.
| <kbd>right</kbd>, <kbd>l</kbd>  | Unfold code.
| <kbd>down</kbd>, <kbd>j</kbd>   | Scroll down.
| <kbd>up</kbd>, <kbd>k</kbd>     | Scroll up.
| <kbd>g</kbd>                    | Scroll to top.
| <kbd>G</kbd>                    | Scroll to bottom.


## $LESSOPEN

`much` supports `$LESSOPEN` variable in the same manner as `less(1)`. This allows for preprocessing step before pager displays file contents. See `less(1)` manual for details.

For example, include the following line in the shell config to highlight files with `source-highlight(1)`:

```bash
LESSOPEN="| src-hilite-lesspipe.sh %s"
```

## Install

```shell
npm install -g much
```

## License

MIT
