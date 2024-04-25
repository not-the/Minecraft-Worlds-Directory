// Components
import Icon from "./Icon"

// Data
import { capitalizeFL, convertTimeStat, convertDistanceStat, numCommas } from "../functions"

export default function Statistic({category, name, value, stats, compare, label}) {
    let formal_name = name.replace(/^(minecraft:)/,"")
    let formal_value = value !== undefined ? value : stats?.[category]?.[name] ?? 0; // Only use value if defined

    /*** Value formatting ***/

    if(value === undefined) {
        // Time
        if(formal_name.includes("one_minute")) formal_value = convertTimeStat(formal_value);

        // Distance
        else if(formal_name.includes("one_cm")) {
            formal_value = convertDistanceStat(formal_value);
        }

        // Other
        else formal_value = numCommas(formal_value);
    }


    /*** Name formatting ***/
    if(label !== undefined) formal_name = label;
    else if(formal_name === 'play_one_minute') formal_name = "Time played";
    else formal_name = capitalizeFL(formal_name).split('_').join(' ');

    if(formal_name.includes("one cm")) formal_name = formal_name.replace("one cm", "distance");
    if(formal_name.includes("Aviate")) formal_name = formal_name.replace("Aviate", "Elytra");
    

    return (
        <tr role="button" tabindex="0" onClick={() => { compare(category, name) }}>
            <th>{formal_name}</th>
            <td>{formal_value}</td>
            <td class="compare"><Icon icon="compare"/></td>
        </tr>
    )
}