import { useCallback } from "react";

const useValidateField = () => {
    const validateField = useCallback((statement, setMessage, message) => {
        if (statement) {
            setMessage(message);
        } else setMessage('');
    }, []);

    return validateField;
}

export default useValidateField;