import User from "../DB/models/user.js";

// Token repository (separate module in practice)
export class TokenRepository {
  static async saveResetToken(userId, token, expiryTime) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiryTime;
      await user.save();
      return true;
  }
  
  static async findUserByResetToken(token, now = Date.now()) {
      return User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: now }
      });
  }
  
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Clears the reset password token and its expiration time for the specified user.
   *
   * @param {String} userId - The ID of the user whose reset token should be cleared.
   * @throws {Error} If the user is not found.
   * @returns {Promise<Boolean>} A promise that resolves to true if the reset token was successfully cleared.
   */

/******  49600870-827b-4a91-9bfa-8efd85ce88fe  *******/
  static async clearResetToken(userId) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return true;
  }
}