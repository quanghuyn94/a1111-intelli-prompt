interface AutoCompleteCallback {
    (keyword : string, textarea: HTMLTextAreaElement, autoCompleteContainer : HTMLDivElement, self : AutoCompleteField) : void;
}

function scrollToSelectedElement(targetContainerElement : HTMLDivElement, selectElement : HTMLDivElement) : void;