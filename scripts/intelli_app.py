import os
import gradio as gr

from fastapi import FastAPI, HTTPException, status

from modules import script_callbacks, shared
import intelli_suggetion.intelli as intelli
import scripts.intelli_shared as intelli_shared
import json

def intelli_settings():
    intelli_config = {
        "intelli_word_padding" : shared.OptionInfo(" ", "Word padding.", gr.Textbox),
        "intelli_max_result" : shared.OptionInfo(5, "Max result of Intelli Search.", gr.Number),
        "intelli_max_history_length" : shared.OptionInfo(1000, "Maximum amount of history stored.", gr.Number)
    }

    for key, opt in intelli_config.items():
        opt.section = ("intelli", "Intelli Config")
        shared.opts.add_option(key, opt)

def api_suggestion_app(_: gr.Blocks, app: FastAPI):
    @app.get("/sdapi/v1/intelli/get")
    def get_suggestion(keyword : str = "", max_result : int = 5):
        return intelli.get_suggestion_rules(keyword, max_result)
    
    @app.get("/sdapi/v1/intelli/complete")
    def complete_suggestion(keyword : str):
        return intelli.get_suggestion_complete(keyword)
    
    @app.get("/sdapi/v1/intelli/config")
    def get_config(rule):
        config = intelli.get_intelli_rule_config()

        if not config:
            return HTTPException(status.HTTP_404_NOT_FOUND, "Rule name not found")
        
        return config

def set_intelli_config(config):
    config = json.loads(config)

    intelli.idx2intelli_rule_configs = config

    intelli.save_intelli_rule_configs(intelli_shared.INTELLI_RULE_CONFIG_PATHS)

    return json.dumps(intelli.idx2intelli_rule_configs, indent=4)

def intelli_tabs():

    with gr.Blocks() as view:
        # intelli_configs = []
        config = gr.Code(json.dumps(intelli.idx2intelli_rule_configs, indent=4), language="json")

        save_button = gr.Button("Save")

        save_button.click(fn=set_intelli_config, inputs=[config], outputs=[config])

    return (
            (
                view,
                "Intellitor Setting",
                "intellitor-setting",
            ),
        )

def init():
    if intelli_shared.VESION.startswith("beta"):
        print("*=============intelli-prompt============*")
        print("Intelli: Beta version - Thanks for trying")
        print("intelli-prompt. This is just a beta ")
        print("version, so errors and bugs cannot be")
        print("avoided.")
        print("*=======================================*")

script_callbacks.on_ui_settings(intelli_settings)
script_callbacks.on_ui_tabs(intelli_tabs)
script_callbacks.on_before_ui(init)
script_callbacks.on_app_started(api_suggestion_app)