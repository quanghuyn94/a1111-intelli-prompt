let promptHistoryStack = [];
const INTELLI_HOTKEY_OPTS = {
    "move_up" : "ArrowUp",
    "move_down" : "ArrowDown",
    "move_left" : "ArrowLeft",
    "move_right" : "ArrowRight",
    "close_suggetion_table" : "Escape",
    "complete_keyword": "Tab",
    "undo": "z"
}
/**
 * Selects an item in the suggestion container at the specified index.
 *
 * @param {HTMLElement} autoCompleteContainer - The suggestion container element.
 * @param {number} index - The index of the item to be selected.
 */
function select(autoCompleteContainer, index) {
    var selectElement = autoCompleteContainer.querySelector(".select");

    if(selectElement) {
        selectElement.classList.remove("select");
    }

    selectElement = autoCompleteContainer.childNodes[index];

    if (selectElement) {
        selectElement.classList.add("select");
    }
}

/**
 * Clamps a numeric value within a specified range.
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum bound of the range.
 * @param {number} max - The maximum bound of the range.
 * @returns {number} - The clamped value within the specified range.
 */
function clamp(value, min, max) {

    if (value < min) {
        value = max;
    }

    if (value > max) {
        value = min;
    }

    return value;
}

function checkHotkey(key) {
    return Object.values(INTELLI_HOTKEY_OPTS).includes(key);
}

function checkElementPosition(element, elementContainer) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = elementContainer.getBoundingClientRect();
  
    if (elementRect.top <= containerRect.top) {
        return -1;
    }
  
    if (elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom) {
        return 0; 
    }
  
    return 1;
}
  

/**
 * 
 * @param {HTMLDivElement} targetContainerElement
 */
function scrollToSelectedElement(targetContainerElement) {
    const selectedElement = targetContainerElement.querySelector(".select");
    
    if (selectedElement instanceof HTMLDivElement) {
        var elementOffset = checkElementPosition(selectedElement, targetContainerElement);
        var style = getComputedStyle(selectedElement)
        if (elementOffset > 0) {
            targetContainerElement.scrollTop = (selectedElement.offsetTop + selectedElement.offsetHeight) - targetContainerElement.offsetHeight;
        }

        if (elementOffset < 0) {
            targetContainerElement.scrollTop = selectedElement.offsetTop
        }
    }
    

};

/**
 * Represents an AutoCompleteField that enhances a textarea with autocomplete suggestions.
 *
 * @class
 * @param {Element} element - The HTML element to which the AutoCompleteField is attached.
 * @param {AutoCompleteCallback} onInputFunc - The callback function to handle input and provide autocomplete suggestions.
 */
class AutoCompleteField {
    /**
     * AutoCompleteField constructor.
     *
     * @constructor
     * @param {Element} element - The HTML element to which the AutoCompleteField is attached.
     * @param {AutoCompleteCallback} onInputFunc - The callback function to handle input and provide autocomplete suggestions.
     */
    constructor(element, onInputFunc) {
        this.element = element;
        var autoCompleteContainer = this.createSuggestionContainer();
        const textarea = element.querySelector(`textarea`);

        var _keyword = "";
        var _selectIndex = 0;
        var _focus = false;

        textarea.style.lineHeight = "1.5";
        textarea.setAttribute("autocomplete", "off");
        
        textarea.addEventListener('keydown', (e) => {
            _focus = true;
            if (e.key == INTELLI_HOTKEY_OPTS["move_up"]) {
                e.preventDefault();
                _selectIndex--;
            }

            if (e.key == INTELLI_HOTKEY_OPTS["move_down"]) {
                e.preventDefault();
                _selectIndex++;
            }

            
            _selectIndex = clamp(_selectIndex, 0, autoCompleteContainer.childNodes.length - 1)
            
            if (e.ctrlKey && e.key == ' ') {

                autoCompleteContainer.style.display = "flex";
                _keyword = getWordNearCursor(textarea, opts['intelli_word_padding']);

                onInputFunc(_keyword, textarea, autoCompleteContainer);
                return;
            }

            if (e.key == INTELLI_HOTKEY_OPTS["close_suggetion_table"]) {
                autoCompleteContainer.style.display = "none";
                return;
            }

            if (e.key == INTELLI_HOTKEY_OPTS["complete_keyword"]) {
                e.preventDefault();
                autoCompleteContainer.childNodes[_selectIndex].click();
                autoCompleteContainer.style.display = "none";
                return;
            }

            if (e.key == INTELLI_HOTKEY_OPTS["move_right"] && autoCompleteContainer.style.display == "flex") {
                e.preventDefault();
                autoCompleteContainer.childNodes[_selectIndex].leftInput(autoCompleteContainer.childNodes[_selectIndex]);
                return;
            }

            if (e.key == INTELLI_HOTKEY_OPTS["undo"] && e.ctrlKey) {
                if (promptHistoryStack.length > 0) {
                    textarea.value = promptHistoryStack.pop();
                    updateInput(textarea);
                }
            }

            select(autoCompleteContainer, _selectIndex);
            scrollToSelectedElement(autoCompleteContainer);
        })

        textarea.addEventListener('keyup', (e) => {

            if (e.key == "Tab") {
                autoCompleteContainer.style.display = "none";
                return;
            }

            if (checkHotkey(e.key)) return;

            _selectIndex = 0;
            _keyword = getWordNearCursor(textarea, opts['intelli_word_padding']);

            onInputFunc(_keyword, textarea, autoCompleteContainer);
        })

        textarea.addEventListener("click", (e) => {
            _focus = true;
        })

        textarea.addEventListener("blur", (e) => {
            _focus = false;
        });

        document.addEventListener("click", (e) => {

            if (e.target == this.element || e.target == textarea) {
                return;
            }

            if (!_focus) {
                autoCompleteContainer.style.display = "none";
            }
        })
    }

    /**
     * Creates the suggestion container element and appends it to the AutoCompleteField's element.
     *
     * @private
     * @returns {HTMLElement} - The created suggestion container element.
     */
    createSuggestionContainer() {
        const autoCompleteContainer = document.createElement("div");
        autoCompleteContainer.classList.add("auto-complete-container");
        this.element.appendChild(autoCompleteContainer);

        return autoCompleteContainer;
    }
}

async function getKeywords(key, max) {
    const response = await fetch(`/sdapi/v1/intelli/get?keyword=${key}&max_result=${max}`)

    return await response.json()
}

async function completeKeywords(key) {
    const response = await fetch(`/sdapi/v1/intelli/complete?keyword=${key}`)

    return await response.json()
}

/**
 * Provides suggestions for a given keyword and displays them in an auto-complete container.
 *
 * @param {string} k - The input keyword for which suggestions are generated.
 * @param {HTMLInputElement} textarea - The HTML input element (usually a textarea) where the user is entering text.
 * @param {HTMLDivElement} autoCompleteContainer - The HTML div element that serves as the container for displaying auto-complete suggestions.
 * @param {string[]} tags - An array of strings representing suggested keywords to be displayed in the auto-complete container.
 * @returns {void}
 */
function suggestionWord(k, textarea, autoCompleteContainer, tags) {
    // Get the pixel position of the cursor within the textarea

    var cursorPixelPosition = TextareaCaretCoordinatesUtils.getCaretCoordinates(textarea, textarea.selectionEnd);

    // Display the auto-complete container
    autoCompleteContainer.style.display = "flex";

    // Set the position of the auto-complete container based on the cursor position
    var style = window.getComputedStyle(textarea, null);
    autoCompleteContainer.style.left = `${cursorPixelPosition.left + 14}px`;
    autoCompleteContainer.style.top = `${cursorPixelPosition.top + 4 + getIntValue(style.lineHeight)}px`;

    // Clear existing suggestions in the auto-complete container
    while (autoCompleteContainer.firstChild) {
        autoCompleteContainer.removeChild(autoCompleteContainer.firstChild);
    }

    // Populate the auto-complete container with suggested tags
    for (let index = 0; index < tags.length; index++) {
        const tagElement = document.createElement("div");

        tagElement.innerText = tags[index];
        let tag = tags[index];
        var tagText = tag[0];
        var tagHighlight = tag[1];
        tagElement.innerText = tagText;
        tagElement.style.color = tagHighlight;
        tagElement.classList.add("tag-element");
        autoCompleteContainer.appendChild(tagElement);

        // Attach a click event listener to each tag element
        tagElement.addEventListener('click', (e) => {
            
            if (autoCompleteContainer.style.display == "flex") {
                textarea.focus();

                // Get the selected tag and complete the keyword in the textarea
                /**
                 * @type {string}
                 */
                var tag = e.target.innerText;

                if (tag.includes("error")) {
                    return;
                }

                completeKeywords(tag).then((response) => {
                    
                    replaceWordAtCursor(textarea, response, opts['intelli_word_padding']);
                })

                // Hide the auto-complete container after selection
                autoCompleteContainer.style.display = "none";

                promptHistoryStack.push(textarea.value);
            }

            
        });

        tagElement.leftInput = (element) => {
            if (autoCompleteContainer.style.display == "flex") {
                textarea.focus();

                // Get the selected tag and complete the keyword in the textarea
                /**
                 * @type {string}
                 */
                var tag = element.innerText;

                if (tag.includes("error")) {
                    return;
                }

                replaceWordAtCursor(textarea, tag, opts['intelli_word_padding']);
                promptHistoryStack.push(textarea.value);
            }
            
        }
    }

    // Select the first suggestion in the auto-complete container
    select(autoCompleteContainer, 0);
}

function pushHistory(textarea) {
    promptHistoryStack.push(textarea.value);
    if (promptHistoryStack.length > opts['intelli_max_history']) {
        promptHistoryStack.shift();
    }
}
/**
 * Asynchronously suggests keywords for a given input and updates the auto-complete container.
 *
 * @param {string} k - The input keyword for which suggestions are generated.
 * @param {HTMLTextAreaElement} textarea - The HTML textarea element where the user is entering text.
 * @param {HTMLDivElement} autoCompleteContainer - The HTML div element that serves as the container for displaying auto-complete suggestions.
 * @returns {Promise<void>}
 */
async function suggestionWordAsync(k, textarea, autoCompleteContainer) {
    let response = await getKeywords(k, opts['intelli_max_result']);

    // If no suggestions are received, hide the auto-complete container and return
    if (response.length < 1) {
        autoCompleteContainer.style.display = "none";
        return;
    };

    // Display suggestions in the auto-complete container
    suggestionWord(k, textarea, autoCompleteContainer, response);
}