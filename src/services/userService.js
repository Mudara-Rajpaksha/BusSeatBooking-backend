const mongoose = require('mongoose');
const USER_ROLE = require('../enums/userRoles');
const User = require('../models/User');
const emailService = require('../services/emailService');
const generateSecurePassword = require('../utils/genPassword');
const { ApiError } = require('../utils/responses');

class UserService {
  async createUser(userData, createdByAdmin) {
    if (!createdByAdmin?.role === USER_ROLE.ADMIN) {
      throw new ApiError('Only admins can create user accounts', 403);
    }

    if (!Object.values(USER_ROLE).includes(userData.role)) {
      throw new ApiError('Invalid user role specified', 400);
    }

    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }, { mobile: userData.mobile }],
    });

    if (existingUser) {
      throw new ApiError('User with this email, username, or mobile already exists', 400);
    }

    const generatedPassword = generateSecurePassword();

    const user = await User.create({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      mobile: userData.mobile,
      username: userData.username,
      password: generatedPassword,
      role: userData.role,
      verified: true,
      active: true,
    });

    const roleSpecificMessage = this.getRoleSpecificMessage(userData.role);

    const emailContent = {
      to: userData.email,
      subject: `Your ${userData.role} Account Details`,
      html: `
        <h2>Welcome to the System</h2>
        <p>Dear ${userData.firstname} ${userData.lastname},</p>
        <p>Your ${userData.role.toLowerCase()} account has been created by the administrator. Here are your login credentials:</p>
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Password:</strong> ${generatedPassword}</p>
        ${roleSpecificMessage}
        <p>Please change your password after your first login for security purposes.</p>
        <p>Best regards,<br>System Administration</p>
      `,
      text: `
        Welcome to the System
        
        Dear ${userData.firstname} ${userData.lastname},
        
        Your ${userData.role.toLowerCase()} account has been created by the administrator. Here are your login credentials:
        
        Username: ${userData.username}
        Password: ${generatedPassword}
        
        ${roleSpecificMessage}
        
        Please change your password after your first login for security purposes.
        
        Best regards,
        System Administration
      `,
    };

    try {
      await emailService.sendEmail(emailContent);
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw new ApiError('Failed to send credentials email. Account creation rolled back.', 500);
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }

  getRoleSpecificMessage(role) {
    switch (role) {
      case USER_ROLE.ADMIN:
        return `<p>As an administrator, you have full access to manage users and system settings.</p>`;
      case USER_ROLE.OPERATOR:
        return `<p>As an operator, you can manage daily operations and handle user requests.</p>`;
      case USER_ROLE.COMMUTER:
        return `<p>As a commuter, you can access transportation services and manage your travel preferences.</p>`;
      default:
        return '';
    }
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new ApiError('User not found', 404);

    const emailContent = {
      to: user.email,
      subject: `Your account details have been updated`,
      html: `
        <h2>Your account details have been updated</h2>
        <p>Dear ${user.firstname} ${user.lastname},</p>
        <p>Your account details have been successfully updated. Below are your updated details:</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p>If you did not make these changes, please contact support immediately.</p>
        <p>Best regards,<br>System Administration</p>
      `,
      text: `
        Your account details have been updated

        Dear ${user.firstname} ${user.lastname},

        Your account details have been successfully updated. Below are your updated details:

        Username: ${user.username}
        Email: ${user.email}
        Mobile: ${user.mobile}
        Role: ${user.role}

        If you did not make these changes, please contact support immediately.

        Best regards,
        System Administration
      `,
    };

    try {
      await emailService.sendEmail(emailContent);
    } catch (error) {
      throw new ApiError('Failed to send update email notification', 500);
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
    if (!user) throw new ApiError('User not found', 404);

    const emailContent = {
      to: user.email,
      subject: `Your account has been deactivated`,
      html: `
      <h2>Your account has been deactivated</h2>
      <p>Dear ${user.firstname} ${user.lastname},</p>
      <p>Your account has been deactivated. If you believe this was a mistake, please contact support immediately.</p>
      <p>Best regards,<br>System Administration</p>
    `,
      text: `
      Your account has been deactivated

      Dear ${user.firstname} ${user.lastname},

      Your account has been deactivated. If you believe this was a mistake, please contact support immediately.

      Best regards,
      System Administration
    `,
    };

    try {
      await emailService.sendEmail(emailContent);
    } catch (error) {
      throw new ApiError('Failed to send deactivation email notification', 500);
    }

    return user;
  }

  async resetPassword(userId) {
    const user = await User.findById(userId).select('+active +password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const newPassword = generateSecurePassword();

    user.password = newPassword;
    await user.save();

    const emailContent = {
      to: user.email,
      subject: 'Your Password Has Been Reset',
      html: `
        <h2>Your Password Has Been Reset</h2>
        <p>Dear ${user.firstname} ${user.lastname},</p>
        <p>Your password has been successfully reset. Below are your new login credentials:</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>New Password:</strong> ${newPassword}</p>
        <p>Please change your password after your first login for security purposes.</p>
        <p>Best regards,<br>System Administration</p>
      `,
      text: `
        Your Password Has Been Reset

        Dear ${user.firstname} ${user.lastname},

        Your password has been successfully reset. Below are your new login credentials:

        Username: ${user.username}
        New Password: ${newPassword}

        Please change your password after your first login for security purposes.

        Best regards,
        System Administration
      `,
    };

    try {
      await emailService.sendEmail(emailContent);
    } catch (error) {
      throw new ApiError('Failed to send reset password email notification', 500);
    }

    return { message: 'Password reset successfully. An email with new credentials has been sent.' };
  }

  async hardDeleteUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError('Invalid user ID format', 400);
    }

    const user = await User.findById(userId).select('+active').lean();

    const result = await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (result.deletedCount === 0) {
      throw new ApiError('User not found', 404);
    }

    const emailContent = {
      to: user.email,
      subject: 'Your Account Has Been Permanently Deleted',
      html: `
     <h2>Your Account Has Been Permanently Deleted</h2>
     <p>Dear ${user.firstname} ${user.lastname},</p>
     <p>Your account has been permanently deleted from the system. If you believe this was a mistake, please contact support immediately.</p>
     <p>Best regards,<br>System Administration</p>
   `,
      text: `
     Your Account Has Been Permanently Deleted

     Dear ${user.firstname} ${user.lastname},

     Your account has been permanently deleted from the system. If you believe this was a mistake, please contact support immediately.

     Best regards,
     System Administration
   `,
    };

    try {
      await emailService.sendEmail(emailContent);
    } catch (error) {
      console.error('Failed to send deletion email:', error);
    }

    return { message: 'User deleted permanently and notification sent.' };
  }

  async getAllUsers(filters = {}, options = {}) {
    const query = User.find(filters);

    if (options.sort) query.sort(options.sort);
    if (options.select) query.select(options.select);
    if (options.limit) query.limit(parseInt(options.limit));
    if (options.skip) query.skip(parseInt(options.skip));

    return await query.exec();
  }

  async getUsersByRole(role) {
    if (!role) throw new ApiError('Role is required', 400);
    return await User.find({ role });
  }
}

module.exports = new UserService();
