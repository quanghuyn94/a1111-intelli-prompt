# IntelliRule Syntax.

Don't panic, it's not as difficult as learning how to code. This is what makes Intelli-prompt stand out. The syntax for Intelli-prompt consists of the following:

- The most basic syntax: `<name>.<keyword>::<strength>`, where `name` is the name of... I can't think of a suitable name for it, but for now, let's understand it as the name of **"IntelliRule**". The `keyword` is the prompt you want, and `strength` is an **optional** parameter indicating the level of attention. For example, `dan.1girl::1.25`, where "dan" is the `name` of the Intellitor Danbooru, "1girl" is the `keyword`, and 1.25 is the `strength` of attention. Of course, you can write it like this: `dan.1girl`.

- Other syntax: `<keyword>::<strength>`, use this syntax when you don't want to use any specific **"IntelliRule"**.

# Build a custom IntelliRule. 
This guide provides step-by-step instructions on creating a custom IntelliRule, either building from the base `IntelliRule` or the pre-built `KeywordIntelliRule`. Both approaches allow you to tailor the IntelliRule to your specific needs.

Note: this guide may not be correct. See also the [IntelliRule documentation](intelli.md).

### **Step 1:** Create you extension in stable-diffusion-webui extensions folder.

Let's create a stable-diffusion-webui extension project. Its structure will be as follows:

- your_extension_name:
    - scripts:
        - your_intelli_rule.py

### **Step 2:** Build your rule.

#### Option 1: Build from Pre-built: `KeywordIntelliRule` or `MapKeywordIntelliRule` (Recommended for beginners)

1. Import the Base Class

    Import the `KeywordIntelliRule` class from the `intelli_suggetion` module.

    ```python
    from intelli_suggetion.intelli import KeywordIntelliRule
    ```

2. Create a Subclass

    Create a subclass of IntelliRule and initialize it with your Intelli name and ID. You can also load your keywords during initialization.

    ```python
    class YourCustomKeywordIntelliRule(KeywordIntelliRule):
        def __init__(self):
            super().__init__(your_custom_name, your_rule_id)
            self.keywords = load_your_keywords()

    ```

    `your_rule_id` : Rule id should look like this `intelli_rule.your_name.your_rule_id`. This will limit overlap with other rules.

3. Implement Optional Methods

    Optionally, you can override the intelli, on_search, and complete methods to tailor the IntelliRule to your specific needs.

    ```python
    def intelli(self, key : str, max_result : int):
        # Optional: Your custom Intelli algorithm
        return your_result_list

    def complete(self, key : str):
        # Optional: Implement custom completion algorithm
        return your_complete_result

    ```

#### Option 2: Build from Base: IntelliRule (Advanced)

1. Import the Base Class

    Import the `IntelliRule` class from the `intelli_suggetion`.

    ```python
    from intelli_suggetion.intelli import IntelliRule
    ```

2. Create a Subclass.

    ```python
    class YourCustomIntelliRule(IntelliRule):
        def __init__(self):
            super().__init__(your_custom_name, your_rule_id)
            self.keywords = load_your_keywords()

    ```

3. Implement Intelli and Completion Algorithms

    Override the `intelli` method to define your custom Intelli algorithm. Ensure that the method returns a list of results.

    ```python
    def intelli(self, key : str, max_result : int):
        # Your custom Intelli algorithm
        return your_result_list
    ```
    Override the `complete` method to implement keyword completion based on your rule specifications.

    ```python
    def complete(self, key: str):
        # Keyword completion algorithm based on your rule specifications.
        return your_complete_result

    ```

### **Step 3:** Add your rule to `IntelliSystem`.
1. Import `add_intelli_rules` from intelli_suggetion
    
    In your_intelli_rule.py, create a `init_rule` function. Import the `add_intelli_rules`function from the 
    `intelli_suggetion` module.

    ```python
    from intelli_suggetion.intelli import IntelliRule, add_intelli_rules

    ```

2. Add your rule.

    ```python
    add_intelli_rules('test', YourCustomIntelliRule())
    # Or
    add_intelli_rules('test', YourCustomIntelliRule(), short_keys=[key1, key2])
    ```

    - `main_command`: The key to associate with the IntelliRule.

    - `YourCustomIntelliRule`: The IntelliRule object to be added.

    - `short_key`: Optional list of additional keys to associate with the same IntelliRule.

### Full code:
```python
from modules import script_callbacks

def custom_rule_init():
    from intelli_suggetion.intelli import KeywordIntelliRule
    from intelli_suggetion.intelli import add_intelli_rules

    class YourCustomKeywordIntelliRule(KeywordIntelliRule):
        def __init__(self):
            super().__init__("Test", 'intelli_your_custom_name')
            self.keywords = ["a", "b", "c"]

    add_intelli_rules('test', YourCustomKeywordIntelliRule())

script_callbacks.on_before_ui(custom_rule_init)
```

### Note: 
As you can see, this code
``` python
    from intelli_suggetion.intelli import KeywordIntelliRule
    from intelli_suggetion.intelli import add_intelli_rules

    class YourCustomKeywordIntelliRule(KeywordIntelliRule):
        def __init__(self):
            super().__init__("Test", 'intelli_your_custom_name')
            self.keywords = ["a", "b", "c"]

```
Is placed inside `custom_rule_init`, if you don't do so, you will get an error like `ModuleNotFoundError: No module named 'intelli_suggetion'`, of course it doesn't always happen but this is the safest solution.

This guide is only relatively accurate. Partly due to language differences, there might be some parts that are hard to understand; please bear with me.
