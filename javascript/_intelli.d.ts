interface AutoCompleteCallback {
    (keyword : string, textarea: HTMLTextAreaElement, autoCompleteContainer : HTMLDivElement) : void;
}

function scrollToSelectedElement(targetContainerElement : HTMLDivElement, selectElement : HTMLDivElement) : void;