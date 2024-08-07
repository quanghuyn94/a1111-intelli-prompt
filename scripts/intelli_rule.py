import glob
import json
import os
import gradio as gr

from fastapi import FastAPI
from pathlib import Path
import pandas as pd
from intelli_suggetion import utils 
from intelli_suggetion.intelli import KeywordIntelliRule 
from intelli_suggetion.intelli import MapKeywordIntelliRule
import intelli_suggetion.intelli as intelli
import scripts.intelli_shared as intelli_shared
from modules import script_callbacks, shared
class DanbooruIntelliRule(MapKeywordIntelliRule):

    def __init__(self):
        super().__init__("Danbooru Intellitor", "intelli_danbooru")
        # df_sorted = csv_df.sort_values(by='count', ascending=False)
        # self.keywords = [tag for tag in df_sorted["tag"]]
        self.keywords = []
        intelli_shared.INTELLI_CONFIG[self.rule_id] = shared.OptionInfo(
            "", "Extend Tags - Fill in here the tag you want to add to the Danbooru Rule, tags are separated by ',' Example: 'ling,4k,...'", gr.Textbox, onchange=self.on_config
        )

        self.load()

    def load(self):
        csv_df = pd.read_csv(intelli_shared.KEYWORD_FOLDER.joinpath("danbooru_intelli.csv"))
        for tag, count, _ in csv_df.values:
            self.keywords.append((tag, count))
    
    def on_config(self):
        _tmp_keys = shared.opts.intelli_danbooru.split(",")
        self.keywords = []
        self.keywords = [(tag.strip(), 99999999) for tag in _tmp_keys]

        self.load()

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
    intelli.add_intelli_rules("dan", DanbooruIntelliRule(), short_keys=["_"])
    intelli.add_intelli_rules("lora", LoraIntelliRule())
    intelli.add_intelli_rules("ti", TextualInversionIntelliRule())
    print("Intelli Rules Loaded")

def unload():
    intelli.idx2intelli_rules = {}
    intelli.intelli_command_rules = {}
    print("Intelli Rules Unloaded")

script_callbacks.on_before_ui(init)
script_callbacks.on_before_reload(unload)