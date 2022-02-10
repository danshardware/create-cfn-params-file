const theForm = `
<p class="alert">&nbsp</p>
<textarea id="%ID%-extractor-input" rows="8"></textarea>
<input type="checkbox" id="%ID%-extractor-no-defaults" name="%ID%-extractor-no-defaults"/>
<label for="%ID%-extractor-no-defaults">Only Extract Required</label>
<button id="%ID%-extractor-convert-button">Convert</button>
<textarea id="%ID%-extractor-output" rows="8"></textarea>
`
const theCss = `
#%ID% {
    font-family: sans-serif;
}

#%ID% > textarea {
    font-family: "Courier New", "mono";
    width: 100%;
    margin: .5rem 0;
}

#%ID% > .alert {
    color: red;
}
        `
export {theForm, theCss}