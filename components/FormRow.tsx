


// TODO: this is wonky
// Fix A: easier creation and discriminant
// Fix B: type and value type should match as well
interface BaseProps {
    separateDisplayValue: boolean,
    name: string,
    type: 'text' | 'number' | 'textarea' | 'date',
    value: string | number
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
    const inputElement = props.type === 'textarea' ?
        <textarea defaultValue={props.value} id={props.name} name={props.name} />
        : <input type={props.type} defaultValue={props.value} name={props.name} id={props.name} />;

    return <div className="w-full grid grid-cols-1 md:grid-cols-[200px_1fr]">
        <label htmlFor={props.name}>{label}</label>
        {inputElement}
    </div>
}