import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormularData, FormData } from './types'

window.__FORMULAR_DATA__ = {} as FormularData

const VALID_TAGS = ['INPUT', 'SELECT', 'TEXTAREA']


const filterElementsOut = (elements, _elements) => elements.filter(el => {
    return filterElementOut(_elements, el).length == _elements.length
}) 

const filterElementOut = (elements, _element) => elements.filter(el => el.name !== _element.name)

const resetValues = (formId) => {
    window.__FORMULAR_DATA__[formId] = {} as FormData
}

const obtainValues = (elements, formId) => {
    const formData = window.__FORMULAR_DATA__[formId] || {} as FormData
    
    elements.forEach(el => {
        const {tagName, name, value, files} = el
        formData[tagName] = [...(formData[tagName] || []).filter(el => el.name !== name), {name, value: files || value}]
    })

    window.__FORMULAR_DATA__[formId] = formData

}

const changeEventListener = (e, form, formId) => {
    
    const formData = window.__FORMULAR_DATA__[formId] || {} as FormData
    
    const {tagName, name, value} = e.target     

    formData[tagName] = [...(formData[tagName] || []).filter(el => el.name !== name), {name, value}]

    window.__FORMULAR_DATA__[formId] = formData
}

const findChildFormElements = (nodes) => {
    
    const tagsQuery = VALID_TAGS.map(t => t.toLocaleLowerCase()).join(',')

    const validFormElements = Array.from(nodes).map((el:Element) => 
        el.querySelectorAll && Array.from(el.querySelectorAll(tagsQuery)))
        .reduce((acc, elements) => [...acc, ...elements], [])

    return validFormElements
}


const blurEventListener = (e) => console.log('blur e', e)
const focusEventListener = (e) => console.log('focus e', e)


export const Formular = ({children, onSubmit, ...props}) => {

    const [formId]  = useState<string>(props.id || `id_${Math.floor(100000 + Math.random() * 900000)}`)
    const [elements, setElements] = useState<HTMLBaseElement[]>([])
    const formRef = useRef<HTMLFormElement>()
    

    const changeFormElementEventListener = (e) => changeEventListener(e, formRef.current, formId)
    
    const submitFormListner = (e) => {
        
        e.preventDefault();

        resetValues(formId)
        obtainValues(elements, formId)
        const data = window.__FORMULAR_DATA__[formId]
        const flat = Object.keys(data).reduce((acc, key) => ([...acc, ...data[key]]), [])
        const payload = flat.reduce((acc, token) => ({...acc, [token.name]:token.value}), {})

        onSubmit(payload, new FormData(formRef.current))
        
        return false;
    }

    useEffect(() => {
        const observer = new MutationObserver((mutations => {
        
            mutations.map(mutation => {

                if(mutation.type === 'childList'){
                
                    if(mutation.addedNodes.length > 0) {
    
                        const childFormElements = findChildFormElements(mutation.addedNodes)
                        
                        if(childFormElements.length > 0) {
                            setElements([...elements, ...childFormElements] as HTMLBaseElement[])
                        }
                    
                    }
    
                    if(mutation.removedNodes.length > 0) {
    
                        const childFormElements = findChildFormElements(mutation.removedNodes)

                        if(childFormElements.length > 0) {
                            setElements(filterElementsOut(elements, childFormElements))
                        }
                    
                    }
                }
            })
        }))
    
        observer.observe(formRef.current, { childList: true, subtree:true})
        
        return () => {
            observer.disconnect()
        }
    }, [elements])

    
    
    useEffect(() => {
        if(!formRef.current) return
        
        const first_elements = Array.from(formRef.current).filter((el: HTMLBaseElement ) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))

        setElements(first_elements as HTMLBaseElement[])
        
    }, [formRef.current])


    useEffect(() => {

        if(!formRef.current) return

        const form = (formRef.current as HTMLFormElement)

        form.addEventListener("submit", submitFormListner, true)
        
        return () => {
            form.removeEventListener("submit", submitFormListner, true)
        }

    }, [elements])

    useEffect(() => {

        obtainValues(elements, formId)

        elements.forEach(el => el.addEventListener('change', changeFormElementEventListener, true))

        return () => {
           elements.forEach(el => el.removeEventListener('change', changeFormElementEventListener, true))
        }

    }, [elements])

    return <form ref={formRef}>
        {children}
    </form>
}