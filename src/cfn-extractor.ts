import YAML from 'yaml'
import {theForm, theCss} from "./the-form"

type parameter = {
    Key: string,
    Value: string | number
}

type cfn = {
    Parameters?: {
        [name: string]: {
            Type: string,
            Description?: string,
            Default?: string,
            AllowedValues?: string[],
            AllowedPattern?:string,
            ConstraintDescription?: string,
            MaxLength?: number,
            MaxValue?: number,
            MinLength?: number,
            MinValue?: number,
            NoEcho?: string,
        }
    },
    Resources: any,
    Conditions: any,
    Outputs: any,
    Mappings: any
    
}

export class Extractor {
    e: HTMLElement | null | undefined

    constructor(id?: string){
        if (id)
            this.setupDom(id)
        else
            this.e = null
    }

    injectStyles(id: string):void{
        const replaceStr = '%ID%'
        const replaceRegex = new RegExp(replaceStr, "g")
        const style = theCss.replace(replaceRegex, id)
        const head = document.head || document.getElementsByTagName('head')[0]
        const css = document.createElement('style')
        head.appendChild(css)
        css.appendChild(document.createTextNode(style))        
    }
    setupDom(id: string){
        this.e = document.getElementById(id)
        if (this.e === null)
            throw new Error("Failed to get HTML entity on setup")

        // inject styles
        this.injectStyles(this.e.id)

        // inject the form
        const replaceStr = '%ID%'
        const replaceRegex = new RegExp(replaceStr, "g")
        this.e.innerHTML = theForm.replace(replaceRegex, this.e.id)

        // inject the hooks
        const btn = document.getElementById(`${id}-extractor-convert-button`)
        const inputArea = <HTMLInputElement> document.getElementById(`${id}-extractor-input`)
        const outputArea = <HTMLInputElement> document.getElementById(`${id}-extractor-output`)
        const nonDefaults = <HTMLInputElement> document.getElementById(`${id}-extractor-no-defaults`)

        // // Add a text area for input
        // const inputArea = doc.createElement("textarea")
        // inputArea.rows = 8
        // this.e.appendChild(inputArea)

        // // Add a text area for Output
        // const outputArea = doc.createElement("textarea")
        // outputArea.rows = 8

        // // Add a process button
        // const btn = doc.createElement("button");
        // btn.innerHTML = "Convert";
        const ep = this.extractParams
        if (btn !== null && outputArea !== null)
            btn.onclick = function(){
                try {
                    outputArea.value = ep(inputArea.value, nonDefaults.checked)
                } catch (error) {
                    if (error instanceof Error)
                        console.error(error.message)
                    else 
                        console.error("Unable to convert")
                }
            }
        // this.e.appendChild(btn)
        // this.e.appendChild(outputArea)
    }

    extractParams(input: string, onlyRequired: boolean = false): string {
        // figure out if the input is JSON or YAML, and convert to a JSON object
        let inObject: any = null
        try {
            inObject = YAML.parse(input)
        } catch (error) {
            // not YAML
            console.log(error)
        }

        if (inObject === null)
            try {
                inObject = JSON.parse(input)
            } catch (error) {
                // Well. it ain't JSON neither
                throw new Error ("Unsupported format, or error in the input")
            }
        
        // ensure we have a "Parameters Section"
        if (!inObject?.hasOwnProperty("Parameters"))
            throw new Error ("No 'Parameters' section found")
        
        // Enumerate the parameters
        const templateIn: cfn = inObject
        let outString = "[\n"
        for (const p in templateIn.Parameters){
            if (onlyRequired === false || ! templateIn.Parameters[p].Default)
                outString += `    {\n        "ParameterKey": "${p}",\n        "ParameterValue": ""\n    },\n`
        }

        outString = outString.slice(0, outString.length -2) + "\n]"
        return outString
    }

}