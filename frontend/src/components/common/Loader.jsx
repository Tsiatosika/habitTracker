import './Loader.css';

const Loader = ({ size = 'medium', text = 'Chargement...' }) => {
    return (
        <div className="loader-container">
            <div className={`loader ${size}`}></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;