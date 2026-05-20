export function validateTaskInput(value) {
    const text = value.trim();

    if (text === "") {
        return {
            valid: false,
            message: "Task cannot be empty"
        };
    }

    if (text.length < 3) {
        return {
            valid: false,
            message: "Task must be at least 3 characters"
        };
    }

    if (text.length > 80) {
        return {
            valid: false,
            message: "Task must be less than 80 characters"
        };
    }

    return {
        valid: true,
        message: ""
    };
}