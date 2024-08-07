def is_subsequence(sub, main):
    if sub == main:
        return True
    
    sub_len = len(sub)
    main_len = len(main)

    if sub_len == 0:
        return True  

    if sub_len > main_len:
        return False  

    sub_index = 0
    main_index = 0

    while main_index < main_len:
        if sub[sub_index] == main[main_index]:
            sub_index += 1

            if sub_index == sub_len:
                return True  
        main_index += 1

    return False 

def check_syntax(key : str):
    if key.count("::") > 1:
        return "error.Syntax Error: More than one '::' found."
    
    return None

def check_dot_before(key : str) -> bool:
    """
    Check a dot before '::' in the key

    Args:
        key (str): The key to check

    Returns:
        bool: True if a dot is before '::' in the key
    """

    if key.count("::") == 0:
        return True
    
    if key.count(".") == 0:
        return False
    
    if key.count(".") > 1:
        return True

    return key.rfind(".") < key.rfind("::")
    
    