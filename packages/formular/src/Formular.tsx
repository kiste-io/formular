import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FormularData, FormData } from './types'

window.__FORMULAR_DATA__ = {} as FormularData


const obtainValues = (elements, formId) => {
    const formData = window.__FORMULAR_DATA__[formId] || {} as FormData
    
    elements.forEach(el => {
        const {tagName, name, value} = el
        formData[tagName] = [...(formData[tagName] || []).filter(el => el.name !== name), {name, value}]
    })

    window.__FORMULAR_DATA__[formId] = formData

}

const changeEventListener = (e, formId) => {
    
    const formData = window.__FORMULAR_DATA__[formId] || {} as FormData
    
    const {tagName, name, value} = e.target     
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
    
    const submitFormListner = (e) => {
        e.preventDefault();

        const data = window.__FORMULAR_DATA__[formId]
        console.log('data', data)
        const payload = Object.values(data)
        onSubmit(
            payload
            .reduce((acc, tokens) => ([...acc, ...tokens]), [])
            .reduce((acc, token) => ({...acc, [token.name]:token.value}), {})
            )
        
        return false;
    }
    
    useEffect(() => {
        if(!formRef.current) return
        
        const elements = Array.from(formRef.current).filter((el: HTMLBaseElement ) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))

        setElements(elements as HTMLBaseElement[])
        
    }, [children])


    useEffect(() => {

        if(!formRef.current) return

        const form = (formRef.current as HTMLFormElement)

        form.addEventListener("submit", submitFormListner)
        
        return () => form.removeEventListener("submit", submitFormListner)

    }, [elements])

    useEffect(() => {

        obtainValues(elements, formId)

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