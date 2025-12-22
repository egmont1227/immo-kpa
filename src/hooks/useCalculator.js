import { useState, useMemo } from 'react';
import { DEFAULT_INPUTS } from '../lib/constants';
import { validateInputs } from '../lib/validation';
import { calculateResults } from '../lib/calculations';

/**
 * Custom hook for calculator state and logic
 */
export const useCalculator = (initialInputs = DEFAULT_INPUTS) => {
    const [inputs, setInputs] = useState(initialInputs);
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

    // Load new inputs (for property switching)
    const loadInputs = (newInputs) => {
        setInputs(newInputs);
    };

    return {
        inputs,
        setInputs,
        updateInput,
        updateInputs,
        loadInputs,
        results,
        errors,
        hasErrors: errors !== null
    };
};
