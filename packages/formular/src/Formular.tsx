import React, { useEffect, useRef, useState } from 'react'
import { FormularData, FormData } from './types'

window.__FORMULAR_DATA__ = {} as FormularData



const changeEventListener = (e, formId) => {
    
    const data = window.__FORMULAR_DATA__ 
    const {tagName, name, value} = e.target 

    const formData = data[formId] || {} as FormData
    formData[tagName] = [...(formData[tagName] || []).filter(el => el.name !== name), {name, value}]

    window.__FORMULAR_DATA__[formId] = formData
}

const blurEventListener = (e) => console.log('blur e', e)
const focusEventListener = (e) => console.log('focus e', e)


export const Formular = ({children, onSubmit, ...props}) => {

    const [formId]  = useState<string>(props.id || `id_${Math.floor(100000 + Math.random() * 900000)}`)
    const [elements, setElements] = useState<HTMLBaseElement[]>([])
    const formRef = useRef()
    const fields = React.Children.toArray(children)

    const changeFormElementEventListener = (e) => changeEventListener(e, formId)

    
    useEffect(() => {
        if(!formRef.current) return
        
        const submitFormListner = (e) => {
            e.preventDefault();

            console.log('window.__FORMULAR_DATA__[formId]', window.__FORMULAR_DATA__[formId], window)

            
            return false;
        }
   

        (formRef.current as HTMLFormElement).addEventListener("submit", submitFormListner, true)

        const elements = Array.from(formRef.current).filter((el: HTMLBaseElement ) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))
        
        setElements(elements as HTMLBaseElement[])

        return () =>  (formRef.current as HTMLFormElement).removeEventListener("submit", submitFormListner)
        
    }, [children])

    useEffect(() => {

        elements.forEach(el => el.addEventListener('change', changeFormElementEventListener))

        return () => {
            elements.forEach(el => el.removeEventListener('change', changeFormElementEventListener))
        }

    }, [elements])

    return <form ref={formRef}>
        {fields.map((field => {

            return field
        }))}
    </form>
}