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