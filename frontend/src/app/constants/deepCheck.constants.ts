
export const deepCheckArray = <T>(arr1: T[] | null, arr2: T[] | null): boolean => {
    if (arr1 === null || arr2 === null) {
        return arr1 === arr2;
    }

    for (let i = 0; i < arr1.length; i++) {
        const item1 = arr1[i];
        const item2 = arr2[i];

        if (Array.isArray(item1) && Array.isArray(item2)) {
            if (!deepCheckArray(item1, item2)) {
                return false;
            }
        } else if (typeof item1 === 'object' && typeof item2 === 'object') {
            if (!deepCheckObject(item1, item2)) {
                return false;
            }
        } else if (item1 !== item2) {
            return false;
        }
    }

    return true;
};

export const deepCheckObject = <T extends { [key: string]: any }>(obj1: T | null, obj2: T | null): boolean => {
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!deepCheckObject(obj1[key], obj2[key])) {
                return false;
            }
        } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            if (!deepCheckArray(obj1[key], obj2[key])) {
                return false;
            }
        } else if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};

export const deepCopyArray = <T>(arr: T[]): T[] => {
    return arr.map(item => {
        if (Array.isArray(item)) {
            // Type assertion to T to satisfy the return type
            return deepCopyArray(item) as unknown as T;
        } else if (typeof item === 'object' && item !== null) {
            return { ...item };
        }
        return item;
    });
}