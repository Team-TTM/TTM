const licenceService = require("../services/licenceService");
const {createToken} = require("../services/tokenService");


/**
 * Contrôleur pour la connexion via une licence d'adhérent.
 * @async
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une réponse JSON avec un message de confirmation ou une erreur.
 */
const licenceSignInController = async (req, res) => {
    const { licence } = req.body;
    const { userId } = req.auth;

    if (!licence) {
        return res.status(400).json({
            error: "Le paramètre 'licence' est requis."
        });
    }

    try {
        const {user,message} = await licenceService.processLicenceSignIn(userId, licence);
        const token = createToken(user.id_user);
        return res.status(200).json({token, message});
    } catch (error) {
        console.error("❌ Erreur dans l'authentification de la licence :", error);
        return res.status(500).json({
            error: error.message || "Une erreur s'est produite lors de l'authentification de la licence."
        });
    }
};

/**
 * Gère la redirection après authentification via une plateforme (Google ou Facebook).
 * @async
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} platform - La plateforme d'authentification ("Google" ou "Facebook").
 * @returns {Promise<Response>} Une redirection vers l'URL appropriée ou une réponse JSON en cas d'erreur.
 */
const handleAuthRedirection = async (req, res, platform) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const { token, licenceExiste } = req.user;

        const redirectUrl = licenceExiste
            ? `http://localhost:3000/users/connected?token=${token}`
            : `http://localhost:3000/users/verify-licence?token=${token}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error(`Erreur dans ${platform}AuthController:`, error);
        return res.status(501).json({ error: "Erreur lors de la redirection après authentification" });
    }
};


/**
 * Contrôleur pour l'authentification via Google.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une redirection après authentification Google.
 */
const googleAuthController = (req, res) => handleAuthRedirection(req, res, "Google");
/**
 * Contrôleur pour l'authentification via Facebook.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une redirection après authentification Facebook.
 */
const facebookAuthController = (req, res) => handleAuthRedirection(req, res, "Facebook");

module.exports = { googleAuthController, facebookAuthController ,licenceSignInController};