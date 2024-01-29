


// TODO: this is wonky
// Fix A: easier creation and discriminant

import { ChangeEvent } from "react"

// Fix B: type and value type should match as well
interface BaseProps {
    separateDisplayValue: boolean,
    name: string,
    type: 'text' | 'number' | 'textarea' | 'date',
    defaultValue?: string | number
    value?: string | number,
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

interface FormRowPropsWithoutDisplayValue extends BaseProps {
    separateDisplayValue: false
}

interface FormRowPropsWithDisplayValue extends BaseProps {
    separateDisplayValue: true,
    displayValue: string
}

type FormRowProps = FormRowPropsWithDisplayValue | FormRowPropsWithoutDisplayValue

export default function FormRow(props: FormRowProps) {

    const label = props.separateDisplayValue ? props.displayValue : props.name

    // TODO: better validation client side (e.g. max length, numerical limits...)
    const optionalProps = {
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue
    }


    const inputElement = props.type === 'textarea' ?
        <textarea id={props.name} name={props.name} {...optionalProps} rows={6} />
        : <input type={props.type} name={props.name} id={props.name} {...optionalProps} />;

    return <div className="w-full grid grid-cols-1 md:grid-cols-[200px_1fr]">
        <label htmlFor={props.name}>{label}</label>
        {inputElement}
    </div>
}