import { useState, useEffect, useCallback } from 'react';
import {
    getAllProperties,
    getActivePropertyId,
    setActivePropertyId,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    initializeStorage,
    propertyNameExists
} from '../lib/storage';
import { DEFAULT_INPUTS } from '../lib/constants';

/**
 * Custom hook for managing multiple properties
 */
export const usePropertyManager = () => {
    const [properties, setProperties] = useState([]);
    const [activePropertyId, setActivePropertyIdState] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize on mount
    useEffect(() => {
        const defaultProp = initializeStorage();
        const allProps = getAllProperties();
        const activeId = getActivePropertyId();

        setProperties(allProps);
        setActivePropertyIdState(activeId || (allProps.length > 0 ? allProps[0].id : null));
        setIsInitialized(true);
    }, []);

    // Get active property
    const activeProperty = properties.find(p => p.id === activePropertyId) || null;

    // Create new property
    const addProperty = useCallback((name) => {
        if (!name || !name.trim()) {
            return { success: false, error: 'Name darf nicht leer sein' };
        }

        if (propertyNameExists(name)) {
            return { success: false, error: 'Eine Immobilie mit diesem Namen existiert bereits' };
        }

        const newProperty = createProperty(name);
        const allProps = getAllProperties();
        setProperties(allProps);
        setActivePropertyIdState(newProperty.id);

        return { success: true, property: newProperty };
    }, []);

    // Switch active property
    const switchProperty = useCallback((id) => {
        setActivePropertyId(id);
        setActivePropertyIdState(id);
    }, []);

    // Update property (name or inputs)
    const updatePropertyData = useCallback((id, updates) => {
        if (updates.name && propertyNameExists(updates.name, id)) {
            return { success: false, error: 'Eine Immobilie mit diesem Namen existiert bereits' };
        }

        const updated = updateProperty(id, updates);
        if (updated) {
            const allProps = getAllProperties();
            setProperties(allProps);
            return { success: true, property: updated };
        }

        return { success: false, error: 'Property konnte nicht aktualisiert werden' };
    }, []);

    // Delete property
    const removeProperty = useCallback((id) => {
        const deleted = deleteProperty(id);

        if (deleted) {
            const allProps = getAllProperties();
            setProperties(allProps);

            // If we deleted the active property, switch to first available
            if (id === activePropertyId) {
                const newActiveId = allProps.length > 0 ? allProps[0].id : null;
                setActivePropertyIdState(newActiveId);

                // If no properties left, create a new default one
                if (allProps.length === 0) {
                    const defaultProp = createProperty('Neue Immobilie 1', DEFAULT_INPUTS);
                    const updatedProps = getAllProperties();
                    setProperties(updatedProps);
                    setActivePropertyIdState(defaultProp.id);
                }
            }

            return { success: true };
        }

        return { success: false, error: 'Property konnte nicht gelöscht werden' };
    }, [activePropertyId]);

    // Save current inputs to active property
    const saveCurrentInputs = useCallback((inputs) => {
        if (activePropertyId) {
            updateProperty(activePropertyId, { inputs });
        }
    }, [activePropertyId]);

    return {
        properties,
        activePropertyId,
        activeProperty,
        isInitialized,
        addProperty,
        switchProperty,
        updatePropertyData,
        removeProperty,
        saveCurrentInputs
    };
};
