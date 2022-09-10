export default function FormInput(props) {

    return (
        <div className="my-4">
            <input className="outline-none p-2 rounded-md ring-2 ring-[#dcdde1] ring-offset-[-1px] w-full" required type={props.type} placeholder={props.label} value={props.value} onChange={(e) => props.setData(e.target.value)} />
        </div>
    )
}