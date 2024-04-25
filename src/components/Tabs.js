import Icon from "./Icon"

export default function Tabs({ tabs, active, setActive, icon, icon_title }) {
    return (
        <div className="tabs flex" name="image_sort">
            {icon ? <Icon icon={icon} title={icon_title}/> : ''}
            {tabs.map(label => {
                return <div
                    className={`tab ${active === label ? 'active' : ''}`}
                    role="button" tabIndex="0"
                    onClick={() => setActive(label)}
                >
                    {label}
                </div>
            })}
        </div>
    )
}