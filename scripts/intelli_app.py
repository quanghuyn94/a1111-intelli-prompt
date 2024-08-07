import os
import gradio as gr

from fastapi import FastAPI, HTTPException, status

from modules import script_callbacks, shared
import intelli_suggetion.intelli as intelli
import scripts.intelli_shared as intelli_shared
import json

def intelli_settings():
    for key, opt in intelli_shared.INTELLI_CONFIG.items():
        opt.section = ("intelli", "Intelli Config")
        shared.opts.add_option(key, opt)

def api_suggestion_app(_: gr.Blocks, app: FastAPI):
    print("Intelli: Adding Intelli API")
    @app.get("/sdapi/v1/intelli/get")
    def get_suggestion(keyword : str = "", max_result : int = 5):
        return intelli.get_suggestion_rules(keyword, max_result)
    
    @app.get("/sdapi/v1/intelli/complete")
    def complete_suggestion(keyword : str):
        return intelli.get_suggestion_complete(keyword)


def init():
    if intelli_shared.VESION.startswith("beta"):
        print("*=============intelli-prompt============*")
        print("Intelli: Beta version - Thanks for trying")
        print("intelli-prompt. This is just a beta ")
        print("version, so errors and bugs cannot be")
        print("avoided.")
        print("*=======================================*")

script_callbacks.on_ui_settings(intelli_settings)
script_callbacks.on_before_ui(init)
script_callbacks.on_app_started(api_suggestion_app)