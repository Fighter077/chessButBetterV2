export const roleHierarchy: string[] = [
    'TEMP_USER',
    'USER',
    'ADMIN',
]

export const roleSuffices: (necessary: string[] | undefined, has: string | undefined) => boolean = (necessary: string[] | undefined, has: string | undefined) => {
    if (!necessary) return true; // If no necessary role is provided, return true
    if (!has) return false; // If no user's role is provided, return false
    return necessary.includes(has); // Check if the user's role is equal to or higher than the necessary role
}