const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken(); // Assuming getJWTToken is a method in your User model

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("token", token, options);

  const formattedUser = {
    _id: user._id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(statusCode).json({
    success: true,
    user: formattedUser,
    message,
  });
};

export default sendToken;