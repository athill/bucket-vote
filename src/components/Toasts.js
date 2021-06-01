import Toast from 'react-bootstrap/Toast';

const Toasts = ({ toasts }) => (
    <div
        aria-live="polite"
        aria-atomic="true"
        style={{
            position: 'relative',
            minHeight: '200px',
        }}
    >
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
            }}
        >
            {
                toasts.map(({ type, message }, idx) => (
                    <Toast key={idx}>
                        <Toast.Header closeButton={false}>
                            <strong className="mr-auto">{type}</strong>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                ))
            }

        </div>
    </div>
);

export default Toasts;
