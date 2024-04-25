import { useParams } from 'react-router-dom';

export default function Page404() {
    let name = useParams()['*'];

    return (
        <p>404 not found: {name}</p>
    )
}