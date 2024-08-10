import glob
import gradio as gr
from modules import scripts, shared
from pathlib import Path

KEYWORD_FOLDER = Path(scripts.basedir()).absolute().joinpath("keyword")
LORA_FOLDER =  Path(shared.cmd_opts.lora_dir)
EMB_PATH = Path(shared.cmd_opts.embeddings_dir)
HYP_PATH = Path(shared.cmd_opts.hypernetwork_dir)
VERSION_PATH = Path(scripts.basedir()).absolute().joinpath(".version")
INTELLI_RULE_CONFIG_PATHS = Path(scripts.basedir()).absolute().joinpath("intelli_config.json")

VESION = ""

INTELLI_CONFIG = {
    "intelli_word_padding" : shared.OptionInfo(" ", "Word padding.", gr.Textbox),
    "intelli_max_result" : shared.OptionInfo(5, "Max result of Intelli Search.", gr.Number),
    "intelli_max_history_length" : shared.OptionInfo(1000, "Maximum amount of history stored.", gr.Number),
    "intelli_move_up": shared.OptionInfo("ArrowUp", "Move up key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_move_down": shared.OptionInfo("ArrowDown", "Move down key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_move_right": shared.OptionInfo("ArrowRight", "Fill with current suggestion key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_open_suggetion_table": shared.OptionInfo("Ctrl+/", "Open suggetion table key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_close_suggetion_table": shared.OptionInfo("Escape", "Close suggetion table key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_complete_keyword": shared.OptionInfo("Tab", "Complete suggetion key. (Enter the character as javascript key)", gr.Textbox),
    "intelli_undo": shared.OptionInfo("Ctrl+z", "Undo key. (Enter the character as javascript key)", gr.Textbox),
}

with open(VERSION_PATH, 'r') as f:
    VESION = f.read()


