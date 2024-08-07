![](/assets/preview.gif)

# Intelli-prompt.

The assistant suggests prompts for you. It was created from some of my random ideas. (❁´◡`❁)

## Introduce

This is a relatively powerful suggestion system that will help you write prompt faster and look cooler!!!

Displays a box suggesting keywords suggested by rule sets called `IntelliRule`. By default it will suggest you tags by danbooru.
## Note:
This extension will not work with `a1111-sd-webui-tagcomplete`, so make sure you are only using one of the two.

## Features

- `Ctrl` + `Z` ¯\\_(ツ)_/¯
- `→` Fill with current suggestion.

![](/assets/preview2.gif)
- New Builtin Rule: `MapKeywordIntelliRule`.
- By default, `intelli_danbooru` is a auto suggestion without input name.
- Now, you can input follow this:

![](/assets/preview3.gif)

See more [changelog.md](/CHANGELOG.md)
## Used
- To use Intelli-prompt, you naturally have to install this extension first.
- Use the `↑` and `↓` arrow keys to navigate between suggestions.
- Press `Tab` or click to auto-complete.
- Press `Esc` to close suggetion content.
- `Shift` + `Space` to open suggetion content.

See more in [hotkey](/docs/hotkey.md).

Simple, isn't it?

## Syntax.
Don't panic, it's not as difficult as learning how to code. This is what makes Intelli-prompt stand out. The syntax for Intelli-prompt consists of the following:

- The most basic syntax: `<name>.<keyword>::<strength>`, where `name` is the name of... I can't think of a suitable name for it, but for now, let's understand it as the name of **"IntelliRule**". The `keyword` is the prompt you want, and `strength` is an **optional** parameter indicating the level of attention. For example, `dan.1girl::1.25`, where "dan" is the `name` of the Intellitor Danbooru, "1girl" is the `keyword`, and 1.25 is the `strength` of attention. Of course, you can write it like this: `dan.1girl`.

- Other syntax: `<keyword>::<strength>`, use this syntax when you don't want to use any specific **"IntelliRule"**.

## Builtin IntelliRule.
- **Danbooru IntelliRule**: Use to get suggestions for danbooru tag. Syntax:

```
dan.<keyword>::<strength>
or
_.<keyword>::<strength>
```

- **Lora IntelliRule**: Quickly call lora. Syntax:

```
lora.<lora_name>::<strength>
```

- **Textual Inversion IntelliRule**: Quickly call Textual Inversion. Syntax:

```
ti.<textual_inversion_name>::<strength>
```

## Build a custom IntelliRule. 

See more in here: [docs/howto.md](/docs/howto.md#build-a-custom-intellirule)

If you have any difficulty, do not hesitate to ask me, I may not reply often but I will try to help you. 
☆*: .｡. o(≧▽≦)o .｡.:*☆