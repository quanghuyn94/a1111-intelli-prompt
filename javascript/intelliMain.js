var setup = true

onUiUpdate(async () => {
    if (!setup) return;
    if (Object.keys(opts).length === 0) return;
    WORD_PADDING = opts['intelli_word_padding']
    HISTORY_LENGTH = opts['intelli_max_history_length']
    try {
        var txt2img_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#txt2img_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });

        var txt2img_n_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#txt2img_neg_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });

        var txt2img_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#hires_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });

        var txt2img_n_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#hires_neg_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });

        var img2img_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#img2img_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });

        var img2img_n_prompt_autocomplete = new AutoCompleteField(gradioApp().querySelector("#img2img_neg_prompt > label"), (k, textarea, autoCompleteContainer) => {
            suggestionWordAsync(k, textarea, autoCompleteContainer).then();
        });
    } catch (error) {
        console.log(error);
    }

    setup = false
    
})

