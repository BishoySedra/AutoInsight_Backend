import Team from "../../DB/models/team.js";
import { createCustomError } from "../errors/customError.js";

const checkTeamPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const { teamId } = req.params; // assuming route param is teamId
        const userId = req.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            throw new createCustomError("Team not found", 404, null);
        }

        // Owner always has full access
        if (team.owner.toString() === userId) {
            return next();
        }

        const member = team.members.find((m) => m.user_id.toString() === userId);

        if (!member) {
            throw new createCustomError("Access Denied: Not a team member", 403, null);
        }

        const permissionLevels = { view: 1, edit: 2, admin: 3 };

        if (permissionLevels[member.permission] < permissionLevels[requiredPermission]) {
            throw new createCustomError("Access Denied: Insufficient Team Permission", 403, null);
        }

        // Attach team to request for future use if needed
        req.team = team;

        next();
    } catch (error) {
        next(error);
    }
};

export default checkTeamPermission;
