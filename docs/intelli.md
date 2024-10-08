# intelli\_suggetion.intelli documents

<a id="intelli_suggetion.intelli.IntelliRule"></a>

## IntelliRule Class

```python
class IntelliRule()
```

<a id="intelli_suggetion.intelli.IntelliRule.__init__"></a>

#### \_\_init\_\_

```python
def __init__(name, rule_id)
```

Initializes an instance of IntelliRule with a given name.

**Arguments**:

  - name (str): The name of the IntelliRule.
  - rule_id (str): The id of the IntelliRule.

<a id="intelli_suggetion.intelli.IntelliRule.get_params"></a>

#### get\_params

```python
def get_params(key: str)
```

Extracts and returns the components of a hierarchical key.

**Arguments**:

  - key (str): The hierarchical key.
  

**Returns**:

  - list or None: A list of components if key contains '.', otherwise None.

<a id="intelli_suggetion.intelli.IntelliRule.on_config"></a>

#### on\_config

```python
def on_config()
```

Placeholder method for handling configuration updates.

<a id="intelli_suggetion.intelli.IntelliRule.intelli"></a>

#### intelli

```python
def intelli(key: str, max_result: int)
```

Placeholder method for intelligent suggestions based on the key.

**Arguments**:

  - key (str): The hierarchical key for which suggestions are needed.
  - max_result (int): The maximum number of suggestions to return.
  

**Returns**:

  - list: A list of intelligent suggestions based on the key.

<a id="intelli_suggetion.intelli.IntelliRule.complete"></a>

#### complete

```python
def complete(key: str)
```

Placeholder method for completing the given key.

**Arguments**:

  - key (str): The hierarchical key to be completed.
  

**Returns**:

  - str: The completed key.

<a id="intelli_suggetion.intelli.IntelliRule.remove_rule_name"></a>

#### remove\_rule\_name

```python
def remove_rule_name(key: str)
```

Remove the rule name from the key.

**Arguments**:

- `key` _str_ - The hierarchical key to be remove.
  

**Returns**:

- `str` - After remove key.

<a id="intelli_suggetion.intelli.KeywordIntelliRule"></a>

## KeywordIntelliRule Class

```python
class KeywordIntelliRule(IntelliRule)
```

A rule class for intelligent keyword-based completion.

<a id="intelli_suggetion.intelli.KeywordIntelliRule.__init__"></a>

#### \_\_init\_\_

```python
def __init__(name, rule_id)
```

Initializes an instance of KeywordIntelliRule.

**Arguments**:

  - name (str): The name of the rule.
  - rule_id (int): The unique identifier for the rule.

<a id="intelli_suggetion.intelli.KeywordIntelliRule.intelli"></a>

#### intelli

```python
def intelli(key: str, max_result: int)
```

Performs intelligent completion based on keywords.

**Arguments**:

  - key (str): The input key for completion.
  - max_result (int): The maximum number of results to return.
  

**Returns**:

  A list of completion results.

<a id="intelli_suggetion.intelli.KeywordIntelliRule.complete"></a>

#### complete

```python
def complete(key: str)
```

Completes the provided key based on rule specifications.

**Arguments**:

  - key (str): The key to be completed.
  

**Returns**:

  A completed string based on rule specifications.

<a id="intelli_suggetion.intelli.MapKeywordIntelliRule"></a>

## MapKeywordIntelliRule Class

```python
class MapKeywordIntelliRule(IntelliRule)
```

A rule class for intelligent keyword-based completion.
This rule store the keyword with the count.
Result will be sorted by the count.

<a id="intelli_suggetion.intelli.MapKeywordIntelliRule.__init__"></a>

#### \_\_init\_\_

```python
def __init__(name, rule_id)
```

Initializes an instance of KeywordIntelliRule.

**Arguments**:

  - name (str): The name of the rule.
  - rule_id (int): The unique identifier for the rule.

<a id="intelli_suggetion.intelli.MapKeywordIntelliRule.intelli"></a>

#### intelli

```python
def intelli(key: str, max_result: int)
```

Performs intelligent completion based on keywords.

**Arguments**:

  - key (str): The input key for completion.
  - max_result (int): The maximum number of results to return.
  

**Returns**:

  A list of completion results.

<a id="intelli_suggetion.intelli.MapKeywordIntelliRule.complete"></a>

#### complete

```python
def complete(key: str)
```

Completes the provided key based on rule specifications.

**Arguments**:

  - key (str): The key to be completed.
  

**Returns**:

  A completed string based on rule specifications.

<a id="intelli_suggetion.intelli.get_suggestion_rules"></a>

#### get\_suggestion\_rules

```python
def get_suggestion_rules(key: str, max_result: int)
```

Retrieves suggestion rules based on the given key and maximum number of results.

**Arguments**:

  - key (str): The hierarchical key for which suggestions are needed.
  - max_result (int): The maximum number of suggestions to return.
  

**Returns**:

  - list: A list of suggestion rules.

<a id="intelli_suggetion.intelli.get_suggestion_complete"></a>

#### get\_suggestion\_complete

```python
def get_suggestion_complete(key: str)
```

Retrieves the completion for the given key.

**Arguments**:

  - key (str): The hierarchical key to be completed.
  

**Returns**:

  - str: The completed key.

<a id="intelli_suggetion.intelli.add_intelli_rules"></a>

#### add\_intelli\_rules

```python
def add_intelli_rules(key, rule: IntelliRule, short_keys=None)
```

Adds an IntelliRule to the global rule registry and associates it with a key.

**Important**: Must be called after the module is loaded by stable-diffusion-webui, typically in `script_callbacks.on_before_ui()`.

**Arguments**:

  - key (str): The key to associate with the IntelliRule.
  - rule (IntelliRule): The IntelliRule object to be added.
  - short_keys (list or None): Optional list of additional keys to associate with the same IntelliRule.
  

**Returns**:

  None
  
  Modifies the global dictionaries:
  - idx2intelli_rules: Maps rule IDs to IntelliRule objects.
  - intelli_command_rules: Maps command keys to rule IDs.
  - idx2intelli_rule_configs: Maps rule IDs to configuration dictionaries.
  
  If short_keys are provided, they are also associated with the same IntelliRule.

