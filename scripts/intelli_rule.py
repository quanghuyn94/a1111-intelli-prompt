import glob
import json
import os

from fastapi import FastAPI
from pathlib import Path
import pandas as pd
from intelli_suggetion import utils 
from intelli_suggetion.intelli import GOLD, PINK_COLOR, RED_COLOR, KeywordIntelliRule 
from intelli_suggetion.intelli import MapKeywordIntelliRule
import intelli_suggetion.intelli as intelli
import scripts.intelli_shared as intelli_shared
from modules import script_callbacks

class DanbooruIntelliRule(MapKeywordIntelliRule):

    def __init__(self):
        super().__init__("Danbooru Intellitor", "intelli_danbooru")
        csv_df = pd.read_csv(intelli_shared.KEYWORD_FOLDER.joinpath("danbooru_intelli.csv"))
        csv_df_keyhighlights = pd.read_csv(intelli_shared.KEYWORD_FOLDER.joinpath("danbooru_intelli_highlights.csv"))
        # df_sorted = csv_df.sort_values(by='count', ascending=False)
        # self.keywords = [tag for tag in df_sorted["tag"]]

        for tag, count, _ in csv_df.values:
            self.keywords.append((tag, count))

        self.config = intelli.create_defaut_intelli_rule_config(self.rule_id, {
            "extends" : []
        })

        self.highlight = {
            "masterpiece" : GOLD,
            "best quality" : GOLD
        }

        for tag, color in csv_df_keyhighlights.values:
            self.highlight[tag] = color

        for extend in self.config["extends"]:
            self.keywords.append((extend, 999999))

    def get_highlight(self, key: str) -> str:
        key = self.remove_rule_name(key)
        return self.highlight.get(key, "#FFFFFF")
        

    def complete(self, key : str):
        key = self.remove_rule_name(key)

        if key.startswith("_"):
            return self.rule_id
        
        if "::" in key:
            tag, strength = key.split("::")

            return f"({tag.replace('_', ' ')}:{strength}), "
        
        return key.replace("_", " ") + ", "

class LoraIntelliRule(KeywordIntelliRule):
    def __init__(self):
        super().__init__("Lora Intellitor", "intelli_lora")
        
    def intelli(self, key: str, max_result: int):
        lora_paths = [Path(path) for path in glob.glob(intelli_shared.LORA_FOLDER.joinpath("**/*").as_posix(), recursive=True)]

        valid_loras = [
            lf
            for lf in lora_paths
            if lf.suffix in {".safetensors", ".ckpt", ".pt"} and lf.is_file()
        ]

        self.keywords = [
            os.path.splitext(lora.name)[0] for lora in valid_loras
        ]
        return super().intelli(key, max_result)
    
    def complete(self, key : str):
        key = self.remove_rule_name(key)

        if "::" in key:
            lora, strength = key.split("::")

            return f"<lora:{lora}:{strength}> "
        
        return f"<lora:{key}:1> "
    
class TextualInversionIntelliRule(KeywordIntelliRule):
    def __init__(self):
        super().__init__("TextualInversion Intellitor", "intelli_textual_inversion")

    def intelli(self, key: str, max_result: int):
        emb_paths = [Path(path) for path in glob.glob(intelli_shared.EMB_PATH.joinpath("**/*").as_posix(), recursive=True)]

        valid_embs = [
            lf
            for lf in emb_paths
            if lf.suffix in {".safetensors", ".ckpt", ".pt"} and lf.is_file()
        ]

        self.keywords = [
            os.path.splitext(lora.name)[0] for lora in valid_embs
        ]
        return super().intelli(key, max_result)

def init():

    if os.path.exists(intelli_shared.INTELLI_RULE_CONFIG_PATHS) == True:
        with open(intelli_shared.INTELLI_RULE_CONFIG_PATHS, 'r') as f:
            intelli.idx2intelli_rule_configs = json.load(f)

    intelli.add_intelli_rules("dan", DanbooruIntelliRule(), short_keys=["_"])
    intelli.add_intelli_rules("lora", LoraIntelliRule())
    intelli.add_intelli_rules("ti", TextualInversionIntelliRule())

script_callbacks.on_before_ui(init)