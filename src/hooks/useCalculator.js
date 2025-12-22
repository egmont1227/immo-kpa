import { useState, useMemo } from 'react';
import { DEFAULT_INPUTS } from '../lib/constants';
import { validateInputs } from '../lib/validation';
import { calculateResults } from '../lib/calculations';

/**
 * Custom hook for calculator state and logic
 */
export const useCalculator = () => {
    const [inputs, setInputs] = useState(DEFAULT_INPUTS);
    const [validationErrors, setValidationErrors] = useState(null);

    // Validate inputs whenever they change
    const errors = useMemo(() => validateInputs(inputs), [inputs]);

    // Calculate results (only if no errors)
    const results = useMemo(() => {
        if (errors) {
            // Return empty/default results if validation fails
            return null;
        }
        return calculateResults(inputs);
    }, [inputs, errors]);

    // Update a single input field
    const updateInput = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    // Update multiple fields at once
    const updateInputs = (updates) => {
        setInputs(prev => ({ ...prev, ...updates }));
    };

    return {
        inputs,
        updateInput,
        updateInputs,
        results,
        errors,
        hasErrors: errors !== null
    };
};
