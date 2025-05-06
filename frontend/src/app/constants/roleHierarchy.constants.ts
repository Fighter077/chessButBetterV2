export const roleHierarchy: string[] = [
    'user',
    'admin'
]

export const roleSuffices: (necessary: string | undefined, has: string | undefined) => boolean = (necessary: string | undefined, has: string | undefined) => {
    if (!necessary) return true; // If no necessary role is provided, return true
    if (!has) return false; // If no user's role is provided, return false
    const necessaryIndex = roleHierarchy.indexOf(necessary); // Get the index of the necessary role
    const hasIndex = roleHierarchy.indexOf(has); // Get the index of the user's role
    return hasIndex >= necessaryIndex; // Check if the user's role is equal to or higher than the necessary role
}