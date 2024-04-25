// Components
import Icon from './Icon'

// Data
import data from '../data/data.json'

export default function Tag({ name }) {
    let td = data.tags?.[name];
    if(td === undefined) td = { ...data.tags.und, label:name };
    let {label, icon, color} = td;
    return (
        <div className="tag" style={{"--color": color}}>
            <Icon icon={icon}/>
            <span>{label}</span>
        </div>
    )
}
