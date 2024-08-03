import glob

from modules import scripts, shared
from pathlib import Path

KEYWORD_FOLDER = Path(scripts.basedir()).absolute().joinpath("keyword")
LORA_FOLDER =  Path(shared.cmd_opts.lora_dir)
EMB_PATH = Path(shared.cmd_opts.embeddings_dir)
HYP_PATH = Path(shared.cmd_opts.hypernetwork_dir)
VERSION_PATH = Path(scripts.basedir()).absolute().joinpath(".version")
INTELLI_RULE_CONFIG_PATHS = Path(scripts.basedir()).absolute().joinpath("intelli_config.json")

VESION = ""

with open(VERSION_PATH, 'r') as f:
    VESION = f.read()


