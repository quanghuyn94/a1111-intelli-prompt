/**
 * From https://github.com/component/textarea-caret-position
 */
class TextareaCaretCoordinatesUtils {
    // We'll copy the properties below into the mirror div.
    // Note that some browsers, such as Firefox, do not concatenate properties
    // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
    // so we have to list every single property explicitly.
    static properties = [
        'direction',  // RTL support
        'boxSizing',
        'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        'height',
        'overflowX',
        'overflowY',  // copy the scrollbar for IE
    
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',
    
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
    
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',
    
        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',  // might not make a difference, but better be safe
    
        'letterSpacing',
        'wordSpacing',
    
        'tabSize',
        'MozTabSize'
    
    ];
    
    static isBrowser = (typeof window !== 'undefined');
    static isFirefox = (TextareaCaretCoordinatesUtils.isBrowser && window.mozInnerScreenX != null);
  
    static getCaretCoordinates(element, position, options) {
        if (!TextareaCaretCoordinatesUtils.isBrowser) {
            throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
        }
  
        var debug = options && options.debug || false;
        if (debug) {
            var el = document.querySelector('#input-textarea-caret-position-mirror-div');
            if (el) el.parentNode.removeChild(el);
        }
    
        // The mirror div will replicate the textarea's style
        var div = document.createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        document.body.appendChild(div);
    
        var style = div.style;
        var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
        var isInput = element.nodeName === 'INPUT';
    
        // Default textarea styles
        style.whiteSpace = 'pre-wrap';
        if (!isInput)
        style.overflowWrap = 'break-word';  // only for textarea-s
    
        // Position off-screen
        style.position = 'absolute';  // required to return coordinates properly
        if (!debug)
        style.visibility = 'hidden';  // not 'display: none' because we want rendering
    
        // Transfer the element's properties to the div
        TextareaCaretCoordinatesUtils.properties.forEach(function (prop) {
        if (isInput && prop === 'lineHeight') {
            // Special case for <input>s because text is rendered centered and line height may be != height
            if (computed.boxSizing === "border-box") {
            var height = parseInt(computed.height);
            var outerHeight =
                parseInt(computed.paddingTop) +
                parseInt(computed.paddingBottom) +
                parseInt(computed.borderTopWidth) +
                parseInt(computed.borderBottomWidth);
            var targetHeight = outerHeight + parseInt(computed.lineHeight);
            if (height > targetHeight) {
                    style.lineHeight = height - outerHeight + "px";
            } else if (height === targetHeight) {
                    style.lineHeight = computed.lineHeight;
            } else {
                    style.lineHeight = 0;
            }
            } else {
                style.lineHeight = computed.height;
            }
        } else {
                style[prop] = computed[prop];
        }
        });
    
        if (TextareaCaretCoordinatesUtils.isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = 'scroll';
        } else {
            style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
        }
    
        div.textContent = element.value.substring(0, position);
        // The second special handling for input type="text" vs textarea:
        // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
        if (isInput)
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    
        var span = document.createElement('span');
        // Wrapping must be replicated *exactly*, including when a long word gets
        // onto the next line, with whitespace at the end of the line before (#7).
        // The  *only* reliable way to do that is to copy the *entire* rest of the
        // textarea's content into the <span> created at the caret position.
        // For inputs, just '.' would be enough, but no need to bother.
        span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
        div.appendChild(span);
    
        var coordinates = {
            top: span.offsetTop + parseInt(computed['borderTopWidth']),
            left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
            height: parseInt(computed['lineHeight'])
        };
    
        if (debug) {
            span.style.backgroundColor = '#aaa';
        } else {
            document.body.removeChild(div);
        }
    
        return coordinates;
    }
}

/**
 * 
 * @param {string} value 
 * @returns {number}
 */
function getIntValue(value) {
    return parseInt(value.replace("px", ""));
}

/**
 * Gets the word near the cursor position in a textarea.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea element from which to extract the word.
 * @param {string} wordPadding - A character used to distinguish two words.
 * @returns {string} - The word near the cursor position.
 */
function getWordNearCursor(textarea, wordPadding ) {
    var cursorPos = textarea.selectionStart;
    var text = textarea.value;
  
    var leftWordStart = text.lastIndexOf(wordPadding , cursorPos - 1) + 1;
    
    var rightWordEnd = text.indexOf(wordPadding , cursorPos);
    if (rightWordEnd === -1) {
        rightWordEnd = text.length;
    }
  
    var wordNearCursor = text.substring(leftWordStart, rightWordEnd);
  
    return wordNearCursor;
}

/**
 * Replaces the word at the cursor position in a textarea with a new word.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea element containing the text to be modified.
 * @param {string} newWord - The new word to replace the existing word at the cursor position.
 * @param {string} wordPadding - A character used to distinguish two words.
 */
function replaceWordAtCursor(textarea, newWord, wordPadding ) {
    var cursorPos = textarea.selectionStart;
    var text = textarea.value;
  
    var start = text.lastIndexOf(wordPadding , cursorPos - 1) + 1;
    var end = text.indexOf(wordPadding , cursorPos);
  
    if (end === -1) {
        end = text.length;
    }
  
    var newText = text.substring(0, start) + newWord + text.substring(end);
  
    textarea.value = newText;
  
    textarea.setSelectionRange(start + newWord.length, start + newWord.length);
    updateInput(textarea);
}