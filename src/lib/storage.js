import { DEFAULT_INPUTS } from './constants';

const STORAGE_KEY = 'immo-kpa-properties';

/**
 * Generate a simple UUID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Load all properties from LocalStorage
 */
export const loadProperties = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error loading properties:', error);
        return null;
    }
};

/**
 * Save properties to LocalStorage
 */
export const saveProperties = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving properties:', error);
        return false;
    }
};

/**
 * Get all properties
 */
export const getAllProperties = () => {
    const data = loadProperties();
    return data?.properties || [];
};

/**
 * Get active property ID
 */
export const getActivePropertyId = () => {
    const data = loadProperties();
    return data?.activePropertyId || null;
};

/**
 * Set active property ID
 */
export const setActivePropertyId = (id) => {
    const data = loadProperties() || { properties: [] };
    data.activePropertyId = id;
    return saveProperties(data);
};

/**
 * Create a new property
 */
export const createProperty = (name, inputs = DEFAULT_INPUTS) => {
    const data = loadProperties() || { properties: [], activePropertyId: null };

    const newProperty = {
        id: generateId(),
        name: name.trim(),
        inputs: { ...inputs },
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    data.properties.push(newProperty);
    data.activePropertyId = newProperty.id;

    saveProperties(data);
    return newProperty;
};

/**
 * Update an existing property
 */
export const updateProperty = (id, updates) => {
    const data = loadProperties();
    if (!data) return null;

    const index = data.properties.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.properties[index] = {
        ...data.properties[index],
        ...updates,
        updatedAt: Date.now()
    };

    saveProperties(data);
    return data.properties[index];
};

/**
 * Delete a property
 */
export const deleteProperty = (id) => {
    const data = loadProperties();
    if (!data) return false;

    data.properties = data.properties.filter(p => p.id !== id);

    // If deleted property was active, set first property as active
    if (data.activePropertyId === id) {
        data.activePropertyId = data.properties.length > 0 ? data.properties[0].id : null;
    }

    saveProperties(data);
    return true;
};

/**
 * Get a specific property by ID
 */
export const getPropertyById = (id) => {
    const properties = getAllProperties();
    return properties.find(p => p.id === id) || null;
};

/**
 * Check if a property name already exists (case-insensitive)
 */
export const propertyNameExists = (name, excludeId = null) => {
    const properties = getAllProperties();
    const lowerName = name.trim().toLowerCase();
    return properties.some(p =>
        p.name.toLowerCase() === lowerName && p.id !== excludeId
    );
};

/**
 * Initialize storage with default property if empty
 */
export const initializeStorage = () => {
    const data = loadProperties();

    if (!data || data.properties.length === 0) {
        const defaultProperty = createProperty('Neue Immobilie 1', DEFAULT_INPUTS);
        return defaultProperty;
    }

    return null;
};
