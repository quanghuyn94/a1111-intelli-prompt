# Intelli module document.

This module provides functions and classes for managing and interacting with IntelliSystem, which are used for intelligent suggestions and completions within a specific **keyword.**

## IntelliRule Class

This class represents an IntelliRule, which provides intelligent suggestions and completions for hierarchical keys within a specific domain.

### Attributes

* `rule_command` (str): The command associated with this IntelliRule (e.g., "configure", "filter").
* `description` (str): A description of the IntelliRule's purpose.
* `name` (str): The name of the IntelliRule.
* `rule_id` (str): The unique identifier of the IntelliRule.  Rule id should look like this `intelli_rule.your_name.your_rule_id`. This will limit overlap with other rules.

### Methods

#### __init__(self, name, rule_id)

Initializes an instance of `IntelliRule` with the given name and ID.

* **Parameters:**
    * `name` (str): The name of the IntelliRule.
    * `rule_id` (str): The unique identifier of the IntelliRule.

#### Function: get_params(self, key: str) -> list | None

Extracts and returns the components of a hierarchical key.

* **Parameters:**
    * `key` (str): The hierarchical key.

* **Returns:**
    * A list of components if the key contains '.', otherwise None.

#### Function: intelli(self, key: str, max_result: int) -> list

Provides intelligent suggestions based on the given key, up to a specified maximum number.

* **Parameters:**
    * `key` (str): The hierarchical key for which suggestions are needed.
    * `max_result` (int): The maximum number of suggestions to return (optional, default is implementation-specific).

* **Returns:**
    * A list of suggested completions for the key.

#### Function: complete(self, key: str) -> str

Completes the given key using intelligent suggestions.

* **Parameters:**
    * `key` (str): The hierarchical key to be completed.

* **Returns:**
    * The completed key.

#### Function: remove_rule_name(self, key: str) -> str

Removes the rule command prefix from the given key.

* **Parameters:**
    * `key` (str): The hierarchical key to be processed.

* **Returns:**
    * The key without the rule command prefix (e.g., "configure.").

## KeywordIntelliRule Class

This class extends the `IntelliRule` class to provide intelligent keyword-based completion for hierarchical keys.

### Attributes

* **keywords** (list): A list of keywords used for intelligent completion.

### Methods

#### __init__(self, name, rule_id)

Initializes an instance of `KeywordIntelliRule` with the given name and ID.

* **Parameters:**
    * `name` (str): The name of the rule.
    * `rule_id` (int): The unique identifier for the rule.

#### Function: intelli(self, key, max_result)

Performs intelligent completion based on keywords.

* **Parameters:**
    * `key` (str): The input key for completion.
    * `max_result` (int): The maximum number of results to return.

* **Returns:**
    * A list of completion results.

#### Function: on_search(self, query, current_keyword, found, result)

Callback function used during the completion process.

* **Parameters:**
    * `query` (str): The search query.
    * `current_keyword` (str): The current keyword being processed.
    * `found` (list): The list of already found results.
    * `result` (list): The list of partial results.

* **Returns:**
    * A tuple of (found, result, skip), where:
        * `found`: A list of fully matching results.
        * `result`: A list of partially matching results.
        * `skip`: A boolean indicating whether to skip further processing of the current keyword.

#### Function: complete(self, key: str)

Completes the provided key based on rule specifications.

* **Parameters:**
    * `key` (str): The key to be completed.

* **Returns:**
    * A completed string based on rule specifications. Rule id should look like this `intelli_rule.your_name.your_rule_id`. This will limit overlap with other rules.

## Function: add_intelli_rules(key, rule: IntelliRule, short_keys=None, config={})
Registers an IntelliRule with a given key and optional configuration.

* **Parameters:**
    - key (str): The key to associate with the IntelliRule.
    - rule (IntelliRule): The IntelliRule object to be added.
    - short_keys (list or None): Optional list of additional keys to associate with the same IntelliRule.

* **Returns:** None

* **Modifies global dictionaries:**
    * idx2intelli_rules: Maps rule IDs to IntelliRule objects.
    * intelli_command_rules: Maps command keys to rule IDs.
    * idx2intelli_rule_configs: Maps rule IDs to configuration dictionaries.

- **⚠️ Important:** Must be called after the module is loaded by stable-diffusion-webui, typically in `script_callbacks.on_before_ui()`.

## Function: get_intelli_rule_config(rule_id)
Retrieves the configuration for an IntelliRule.

* **Parameters:**
    - rule_id (str): The ID of the IntelliRule.
- **Returns:** The configuration dictionary for the IntelliRule, or None if not found.

## Function: set_intelli_rule_config(rule_id : str, config : dict)
Sets the configuration for an IntelliRule.

Different from `set_intelli_rule_config`, this function will initialize default values if that value does not exist. Use inside the constructor of the `IntelliRule` class

- **Parameter:s**
    - rule_id (str): The ID of the IntelliRule.
    - config (dict): The new configuration dictionary.
- **Returns**: The updated configuration dictionary.

## Function: create_defaut_intelli_rule_config(rule_id : str, config : dict)
Creates a default configuration for an IntelliRule if it doesn't exist, and updates it with provided values.
- **Parameters**:
    - rule_id (str): The ID of the IntelliRule.
    - config (dict): The configuration values to add or update.
- **Returns**: The updated configuration dictionary.