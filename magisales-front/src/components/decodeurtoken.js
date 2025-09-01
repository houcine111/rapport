export function decodeToken(token) {
    if (!token) return null;

    try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload;
    } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        return null;
    }
}

export function getIdentifiant(token) {
    const payload = decodeToken(token);
    return payload ? payload.sub || payload.identifiant : null;
}

export function getRole(token) {
    const payload = decodeToken(token);
    return payload ? payload.role || payload.roles || payload.authorities : null;
}
export function getFullname(token) {
    const payload = decodeToken(token);
    return payload ? payload.fullname || payload.name : null;
}
