[![npm](https://nodei.co/npm/much.png)](https://nodei.co/npm/much/)

# much

[![Dependency Status][david-badge]][david]

[david-badge]: https://david-dm.org/eush77/much.png
[david]: https://david-dm.org/eush77/much

`much` — pager with depth support.

Fold function and object bodies interactively.

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


## Install

```shell
npm install -g much
```

## License

MIT
