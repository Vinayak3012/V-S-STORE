const Profile = require("../models/profile");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

module.exports.show = async (req, res) => {
  let user = await User.findById(req.user.id).populate("profile");
  let profileData = user.profile;
  if (user.profile === undefined) {
    res.render("profile/form.ejs");
  } else {
    res.render("profile/editForm.ejs", { profileData });
  }
};

module.exports.add = async (req, res, next) => {
  let user = await User.findById(req.user.id);
  let profile = new Profile(req.body.profile);
  if (profile.age >= 18 && 6999999999 < profile.phoneNo < 10000000000) {
    user.profile = profile;
    await profile.save();
    await user.save();
    let urlRedirect = res.locals.redirect_url || "/profile";
    delete req.session.redirect_url;
    res.redirect(urlRedirect);
  } else {
    next(new ExpressError(404, "age must 18+ or phone number is wrong"));
  }
  req.flash("success", "Profile Updated Successfully");
};

module.exports.edit = async (req, res, next) => {
  let user = await User.findById(req.user.id);
  let profileOld = await Profile.findById(user.profile._id);
  let profileNew = req.body.profile;
  if (profileNew.age >= 18 && 6999999999 < profileNew.phoneNo < 10000000000) {
    profileOld.name = profileNew.name;
    profileOld.age = profileNew.age;
    profileOld.address = profileNew.address;
    profileOld.gender = profileNew.gender;
    profileOld.phoneNo = profileNew.phoneNo;
    await profileOld.save();
    req.flash("success", "Profile Updated Successfully");
    let urlRedirect = res.locals.redirect_url || "/profile";
    delete req.session.redirect_url;
    res.redirect(urlRedirect);
  } else {
    next(new ExpressError(404, "age must 18+ or phone number is wrong"));
  }
};
